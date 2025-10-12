import { Interpreter } from "@/interpreter/interpreter";

export interface LoxCallable {
    arity: () => number;
    call(interpreter: Interpreter, args: unknown[]): unknown;
    toString: () => string;
}

export function isLoxCallable(callee: any): callee is LoxCallable {
    return typeof callee === "object" && callee !== null && typeof (callee as LoxCallable).call === "function";
}
