"use client"

import { useState } from "react"

import { evaluate } from "@/lib/abstraction"
import { parseScript } from "@/lib/parser"
import { serializeExpression } from "@/lib/serializer"

export default function Home() {
    const [text, setText] = useState("(λx.xx)(λx.xx)")

    const parsed = parseScript(text)
    const evaluated = evaluate(parsed)

    return (
        <main className="flex flex-col p-10 align-middle">
            <textarea
                className="block h-1/3 content-center border border-gray-300"
                onChange={e => setText(e.target.value.replace("L", "λ"))}
                value={text}
            ></textarea>

            {/*Parsed:
            <pre style={{ whiteSpace: "none" }}>
                {JSON.stringify(parsed, null, 2)}
            </pre>*/}

            Evaluated:
            <pre style={{ whiteSpace: "none" }}>
                {serializeExpression(evaluated)}
            </pre>

        </main>
    )
}
