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

        // Identify numbers
        // Numbers repeat a function n times
        if (inputs.length == 2) {
            // This is horrible
            // TODO: generalize to some sort of middleware-based system?
            const bodyString = serializeExpression(body).replaceAll(" ", "")
            const f = bodyString.slice(0, bodyString.length - 1)
            const last = bodyString.charAt(bodyString.length - 1)

            const isNumber = f.split("").every(c => c === f[0]) && last != f[0]

            if (isNumber)
                return `${f.length}`
        }

        return `(λ${inputs}.${serializeExpression(body)})`
    }

    return ""
}