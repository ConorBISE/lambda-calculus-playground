import { Expression, isAbstraction, isApplication, isIdentifier } from "./abstraction"

export function serializeExpression(e: Expression): string {
    if (isIdentifier(e))
        return e

    if (isApplication(e))
        return `${serializeExpression(e.left)} ${serializeExpression(e.right)}`

    if (isAbstraction(e)) {
        // For the sake of brevity: tunnel down, and collapse consecutive abstractions into one
        let inputs = e.input
        let body = e.body

        while (isAbstraction(body)) {
            inputs += body.input
            body = body.body
        }

        return `(λ${inputs}.${serializeExpression(body)})`
    }

    return ""
}