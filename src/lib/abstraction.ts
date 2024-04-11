export type Identifier = string;

export type Application = {
    left: Expression,
    right: Expression
}

export type Abstraction = {
    input: Identifier,
    body: Expression
}

export type Expression = Identifier | Application | Abstraction;

function isIdentifier(e: Expression): e is Identifier {
    return typeof e === 'string';
}

function isApplication(e: Expression): e is Application {
    return (e as Application).left !== undefined;
}

function isAbstraction(e: Expression): e is Abstraction {
    return (e as Abstraction).body !== undefined;
}

export function evaluate(e: Expression): Expression {
    // Identifiers are atomic
    // and abstractions cannot be evaluated by themselves
    // TODO: some sort of simplication step here that does try to analyse abstraction bodies?
    if (isIdentifier(e) || isAbstraction(e))
        return e;

    // Guard rail: everything past this point deals with evaluating applications
    if (!isApplication(e))
        throw Error("Unknown expression type");

    const l = evaluate(e.left);
    const r = evaluate(e.right);

    if (isAbstraction(l)) {
        const identToReplace = l.input;

        // Takes in an expression, and recursively substitutes identToReplace with r
        // (by the definition of application)
        // TODO: this doesn't take into account variables in inner scopes being shadowed
        const recursivelySubstituteArgument = (e: Expression): Expression => {
            if (isIdentifier(e) && e == identToReplace) {
                return r
            } else if (isAbstraction(e)) {
                return {
                    input: e.input,
                    body: recursivelySubstituteArgument(e.body)
                }
            } else if (isApplication(e)) {
                return {
                    left: recursivelySubstituteArgument(e.left),
                    right: recursivelySubstituteArgument(e.right)
                }
            }

            return e
        }

        return evaluate(recursivelySubstituteArgument(l.body));
    }

    // If we're here, the left side of this application is a symbol, and we're done.
    // The result is simply the right side applied to the left side.
    return {
        left: l,
        right: r
    };
}