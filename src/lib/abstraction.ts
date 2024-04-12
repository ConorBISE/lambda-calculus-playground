function deepObjectEquality(x: any, y: any): boolean {
    // Adapted from https://javascript.plainenglish.io/you-dont-need-lodash-how-i-gave-up-lodash-693c8b96a07c
    const ok = Object.keys, tx = typeof x, ty = typeof y
    return x && y && tx === "object" && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepObjectEquality(x[key], y[key]))
    ) : (x === y)
}

export type Identifier = string;

export type Application = {
    left: Expression
    right: Expression
}

export type Abstraction = {
    input: Identifier
    body: Expression
}

export type Expression = Identifier | Application | Abstraction;

export function isIdentifier(e: Expression): e is Identifier {
    return typeof e === "string"
}

export function isApplication(e: Expression): e is Application {
    return (e as Application).left !== undefined
}

export function isAbstraction(e: Expression): e is Abstraction {
    return (e as Abstraction).body !== undefined
}

export function recursivelySubstituteArgument(e: Expression, identToReplace: Identifier, replaceWith: Expression): Expression {
    const recursivelySubstituteArgumentInner = (e: Expression): Expression => {
        if (isIdentifier(e) && e == identToReplace) {
            return replaceWith
        } else if (isAbstraction(e)) {
            return e.input == identToReplace ? e : {
                input: e.input,
                body: recursivelySubstituteArgumentInner(e.body),
            }
        } else if (isApplication(e)) {
            return {
                left: recursivelySubstituteArgumentInner(e.left),
                right: recursivelySubstituteArgumentInner(e.right),
            }
        }

        return e
    }
    return recursivelySubstituteArgumentInner(e)
}

export function evaluate(e: Expression): Expression {
    // Identifiers are atomic
    if (isIdentifier(e))
        return e

    if (isAbstraction(e))
        return {
            input: e.input,
            body: evaluate(e.body),
        }

    // Guard rail: everything past this point deals with evaluating applications
    if (!isApplication(e))
        throw Error("Unknown expression type")

    const l = evaluate(e.left)
    const r = evaluate(e.right)

    if (isAbstraction(l)) {
        const identToReplace = l.input

        // Takes in an expression, and recursively substitutes identToReplace with r
        // (by the definition of application)
        const substituted = recursivelySubstituteArgument(l.body, identToReplace, r)

        if (deepObjectEquality(substituted, e)) {
            // We've got a recursive abstraction on our hands!
            // TODO: make this smarter; able to identify cyclical expansion loops
            return substituted
        }

        return evaluate(substituted)
    }

    // If we're here, the left side of this application is a symbol, and we're done.
    // The result is simply the right side applied to the left side.
    return {
        left: l,
        right: r,
    }
}