import { Environment } from "@/environment/environment";
import { Interpreter } from "@/interpreter/interpreter";
import { LoxCallable } from "@/lox-callable/lox-callable";
import { StmtFunction } from "@/statement/Stmt";

export class LoxFunction implements LoxCallable {
    private readonly declaration: StmtFunction;
    constructor(declaration: StmtFunction) {
        this.declaration = declaration;
    }

    public call(interpreter: Interpreter, args: unknown[]): unknown {
        const environment = new Environment(interpreter.getGlobals());

        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].getLexeme(), args[i]);
        }

        interpreter.executeBlock(this.declaration.body, environment);
        return null;
    }

    public arity(): number {
        return this.declaration.params.length;
    }

    public toString(): string {
        return "<fn " + this.declaration.name.getLexeme() + ">";
    }
}
