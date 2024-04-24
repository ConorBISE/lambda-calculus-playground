"use client"

import { useEffect, useState } from "react"

import { evaluate } from "@/lib/abstraction"
import { parseScript } from "@/lib/parser"
import { serializeExpression } from "@/lib/serializer"

export default function Home() {
    const [text, setText] = useState("")

    useEffect(() => {
        setText(decodeURIComponent(window.location.hash.slice(1)))
    }, [])

    const [reprNumbers, setReprNumbers] = useState(false)
    const [debugInput, setDebugInput] = useState(false)
    const [debugOutput, setDebugOutput] = useState(false)

    const setTextWrapped = (s: string) => {
        setText(s)
        window.location.hash = encodeURIComponent(s)
    }

    const [scope, parsed] = parseScript(text)
    const [evaluated, steps] = evaluate(parsed, scope)

    return (
        <main className="flex flex-col p-10 align-middle">
            <textarea
                className="block h-1/3 content-center border border-gray-300"
                onChange={e => setTextWrapped(e.target.value.replace("L", "λ"))}
                value={text}
            ></textarea>

            <label className="block md:w-2/3">
                <input className="mr-2 leading-tight" type="checkbox" checked={reprNumbers} onChange={e => setReprNumbers(e.target.checked)}/>
                <span className="text-sm">
                    Represent church numerals as numbers in output
                </span>
            </label>

            <label className="block md:w-2/3">
                <input className="mr-2 leading-tight" type="checkbox" checked={debugInput} onChange={e => setDebugInput(e.target.checked)}/>
                <span className="text-sm">
                    Show debug parsed input
                </span>
            </label>

            <label className="block md:w-2/3">
                <input className="mr-2 leading-tight" type="checkbox" checked={debugOutput} onChange={e => setDebugOutput(e.target.checked)}/>
                <span className="text-sm">
                    Show debug evaluated output
                </span>
            </label>

            {
                debugInput ?
                    <>
                Parsed:
                        <pre style={{ whiteSpace: "none" }}>
                            {JSON.stringify(parsed, null, 2)}
                        </pre>
                    </> : <></>
            }

            {
                debugOutput ?
                    <>
                Evaluated:
                        <pre style={{ whiteSpace: "none" }}>
                            {JSON.stringify(evaluated, null, 2)}
                        </pre>
                    </> : <></>
            }

            <span className="pt-5">Evaluated:</span>
            <pre style={{ whiteSpace: "none" }}>
                {serializeExpression(evaluated, reprNumbers)}
            </pre>

            <span className="pt-5">Steps:</span>

            {
                [parsed, ...steps].map((s, i) =>
                    <pre style={{ whiteSpace: "none" }} key={i}>
                        {serializeExpression(s, reprNumbers)}
                    </pre>
                )
            }
        </main>
    )
}
