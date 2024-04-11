import { Abstraction, evaluate } from "@/lib/abstraction"

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

describe("evaluate", () => {
    it("Evaluates the bird exercises correctly", () => {
        // I KI = KI
        expect(evaluate({
            left: I,
            right: KI,
        })).toEqual(KI)

        // M I a = a
        expect(evaluate({
            left: {
                left: M,
                right: I,
            },
            right: "a",
        })).toEqual("a")

        // K I a b = b
        expect(evaluate({
            left: {
                left: {
                    left: K,
                    right: I,
                },
                right: "a",
            },
            right: "b",
        })).toEqual("b")

        // C K a b = b
        expect(evaluate({
            left: {
                left: {
                    left: C,
                    right: K,
                },
                right: "a",
            },
            right: "b",
        })).toEqual("b")
    })
})