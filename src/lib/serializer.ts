import { Expression, isAbstraction, isApplication, isIdentifier } from "./abstraction"

export function serializeExpression(e: Expression, reprNumbers: boolean): string {
    if (isIdentifier(e))
        return e

    if (isApplication(e)) {
        const leftPart = serializeExpression(e.left, reprNumbers)
        let rightPart = serializeExpression(e.right, reprNumbers)

        if (!isIdentifier(e.right) && !(rightPart.charAt(0) === "(")) {
            // If the right part is anything more complicated than an identifier
            // it'll need brackets to be understood by a greedy parser
            rightPart = `(${rightPart})`
        }

        return `${leftPart} ${rightPart}`
    }

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
        if (inputs.length == 2 && reprNumbers) {
            const maybeF = inputs[0]
            const maybeA = inputs[1]

            const recursivelyCheckIsNumber = (e: Expression): [boolean, number] => {
                if (isIdentifier(e) && e == maybeA)
                    return [true, 0]

                if (!isApplication(e))
                    return [false, 0]

                if (e.left != maybeF)
                    return [false, 0]

                if (e.right == maybeA)
                    return [true, 1]

                const [result, depth] = recursivelyCheckIsNumber(e.right)
                return [result, depth + 1]
            }

            const [isNumber, depth] = recursivelyCheckIsNumber(body)
            if (isNumber)
                return `${depth}`
        }

        return `(λ${inputs}.${serializeExpression(body, reprNumbers)})`
    }

    return ""
}