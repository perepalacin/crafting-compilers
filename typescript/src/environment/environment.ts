import { RuntimeError } from "@/exceptions/runtime-exception";
import { Token } from "@/tokens/token";

export class Environment {
    private values: Record<string, unknown> = {};

    public define(name: string, value: unknown): void {
        this.values[name] = value;
    }

    public assign(name: Token, value: unknown): void {
        if (Object.prototype.hasOwnProperty.call(this.values, name)) {
            this.values[name.getLexeme()] = value;
            return;
        }
        throw new RuntimeError(name, "Undefined variable '" + name + "'.");
    }

    public get(name: Token): unknown {
        const lexeme = name.getLexeme();

        if (Object.prototype.hasOwnProperty.call(this.values, lexeme)) {
            return this.values[lexeme];
        }
        throw new RuntimeError(name, "Undefined variable '" + name.getLexeme() + "'.");
    }
}
