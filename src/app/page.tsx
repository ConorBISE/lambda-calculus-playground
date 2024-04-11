"use client"

import { useState } from "react"

import { evaluate } from "@/lib/abstraction"
import { parseExpression } from "@/lib/parser"
import { serializeExpression } from "@/lib/serializer"

export default function Home() {
    const [text, setText] = useState("(λx.xx)(λx.xx)")

    const parsed = parseExpression(text)
    const evaluated = evaluate(parsed)

    return (
        <main className="content-center">
            <textarea
                className="block content-center border border-gray-300"
                onChange={e => setText(e.target.value.replace("L", "λ"))}
                value={text}
            ></textarea>

            Evaluated:
            <pre style={{ whiteSpace: "none" }}>
                {serializeExpression(evaluated)}
            </pre>

        </main>
    )
}
