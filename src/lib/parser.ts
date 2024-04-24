import { Expression, Identifier } from "./abstraction"

function takeCharacter(s: string): [string, string] {
    if (s.length === 0)
        return ["", ""]

    return [s.charAt(0), s.slice(1)]
}

function takeUntil(s: string, until: string): [string, string] {
    const index = s.indexOf(until)

    if (index === -1)
        return [s, ""]

    return [s.slice(0, index), s.slice(index)]
}

function splitOnFirst(s: string, split: string): [string, string] {
    const [a, b] = takeUntil(s, split)
    return [a, takeCharacter(b)[1]]
}

function takeUntilClosingParen(s: string): [string, string] {
    let parenBalance = 0

    for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i)

        if (c === "(") {
            parenBalance += 1
        } else if (c === ")" && parenBalance === 0) {
            return [s.substring(0, i), s.substring(i + 1)]
        } else if (c === ")") {
            parenBalance -= 1
        }
    }

    return [s, ""]
}

export function parseExpression(s: string): Expression {
    // In our formulation of lambda calculus, whitespace is entirely redundant.
    // Get rid of it all to make parsing an easier task
    s = s.replaceAll(/\s/g, "")
    let e = undefined

    while (s.length != 0) {
        let next
        let subExpr;
        [next, s] = takeCharacter(s)

        if (next === "(") {
            let bracketedExpression;
            [bracketedExpression, s] = takeUntilClosingParen(s)
            subExpr = parseExpression(bracketedExpression)
        } else if (next === "λ") {
            const [inputs, body] = splitOnFirst(s, ".")
            s = ""

            let abstraction = parseExpression(body)

            inputs.split("").reverse().forEach(input => {
                abstraction = {
                    input,
                    body: abstraction,
                }
            })

            subExpr = abstraction
        } else {
            subExpr = next
        }

        if (e === undefined) {
            e = subExpr
        } else {
            e = {
                left: e,
                right: subExpr,
            }
        }

    }

    return e || ""
}

export type Scope = Record<Identifier, Expression>;

export function parseScript(s: string): [Scope, Expression] {
    const lines = s.split("\n").map(l => l.replaceAll(/\s/g, ""))
    const scope: Scope = {}

    lines.slice(0, -1).forEach(l => {
        if (l.trim().length == 0)
            return

        const [expressionName, expressionString] = splitOnFirst(l, "=")
        scope[expressionName] = parseExpression(expressionString)
    })

    const loose = parseExpression(lines.at(-1) || "")

    return [scope, loose]
}