import { RuntimeError } from "@/exceptions/runtime-exception";
import { Token } from "@/tokens/token";

export class Environment {
    private readonly enclosing: Environment | null;
    private values: Record<string, unknown> = {};

    constructor(enclosing?: Environment) {
        if (enclosing) {
            this.enclosing = enclosing;
            return;
        }
        this.enclosing = null;
    }

    public define(name: string, value: unknown): void {
        this.values[name] = value;
    }

    public assign(name: Token, value: unknown): void {
        if (Object.prototype.hasOwnProperty.call(this.values, name)) {
            this.values[name.getLexeme()] = value;
            return;
        }
        if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
            return;
        }
        throw new RuntimeError(name, "Undefined variable '" + name + "'.");
    }

    public get(name: Token): unknown {
        const lexeme = name.getLexeme();

        if (Object.prototype.hasOwnProperty.call(this.values, lexeme)) {
            return this.values[lexeme];
        }
        if (this.enclosing !== null) return this.enclosing.get(name);
        throw new RuntimeError(name, "Undefined variable '" + name.getLexeme() + "'.");
    }
}
