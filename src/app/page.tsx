"use client"

import { useEffect, useState } from "react"

import { Abstraction, Application, Identifier, evaluate } from "@/lib/abstraction"

export default function Home() {
    const [text, setText] = useState("")

    useEffect(() => {
        console.log(text)
    }, [text])

    // Identity - returns a value unchanged
    const I: Abstraction = {
        input: "x",
        body: "x",
    }

    // Mockingbird - applies a function to itself
    const M: Abstraction = {
        input: "f",
        body: {
            left: "f",
            right: "f",
        },
    }

    // Kestrel - returns the first argument passed to it
    const K: Abstraction = {
        input: "x",
        body: {
            input: "y",
            body: "x",
        },
    }

    // Kite - returns the second argument passed to it
    const KI: Abstraction = {
        input: "x",
        body: {
            input: "y",
            body: "y",
        },
    }

    // Cardinal - takes a function, and two arguments
    // Evaluates the function with the order of the arguments flipped
    const C: Abstraction = {
        input: "f",
        body: {
            input: "y",
            body: {
                input: "z",
                body: {
                    left: {
                        left: "f",
                        right: "z",
                    },
                    right: "y",
                },
            },
        },
    }

    const ap: Application = {
        left: {
            left: {
                left: C,
                right: K,
            },
            right: "a",
        },
        right: "b",
    }

    const r = evaluate(ap)

    return (
        <main>
            {/*<textarea
        className="block border border-gray-300"
        onChange={(e) => setText(e.target.value.replace("L", "λ"))}
        value={text}
  ></textarea>*/}

            <pre style={{ "whiteSpace": "none" }}>
                {JSON.stringify(r, null, 2)}
            </pre>
        </main>
    )
}
