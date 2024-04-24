import { Scope } from "./parser"

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

export type Step = {
    e: Expression
    explanation: string
}

export function evaluate(e: Expression, scope: Scope = {}): [Expression, Expression[]] {
    // The current form of the expression we're working on
    let w = e

    const steps: Expression[] = []

    while (true) {
        const wStart = w

        if (isIdentifier(w) && scope[w] !== undefined) {
            // Can this be substituted with something in scope?
            w = scope[w]
        }

        if (isApplication(w)) {
            const [left, leftSteps] = evaluate(w.left, scope)
            steps.push(...leftSteps.map(s => {
                return { left: s, right: (w as Application).right }
            }))

            const [right, rightSteps] = evaluate(w.right, scope)
            steps.push(...rightSteps.map(s => {
                return { left, right: s }
            }))

            if (isAbstraction(left)) {
                w = recursivelySubstituteArgument(left.body, left.input, right)
            } else {
                w = { left, right }
            }
        }

        if (isAbstraction(w)) {
            const [body, bodySteps] = evaluate(w.body, scope)
            steps.push(...bodySteps.map(s => {
                return {
                    input: (w as Abstraction).input,
                    body: s,
                }
            }))

            w = {
                input: w.input,
                body,
            }
        }

        if (deepObjectEquality(wStart, w))
            return [w, steps]

        if (!deepObjectEquality(w, steps.at(-1))) {
            steps.push(w)
        }
    }
}