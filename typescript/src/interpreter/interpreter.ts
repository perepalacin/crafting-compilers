import { Environment } from "@/environment/environment";
import { RuntimeError } from "@/exceptions/runtime-exception";
import { Assign, Binary, Call, Expr, ExprVisitor, Grouping, Literal, Logical, Unary, Variable } from "@/expression/expr";
import { isLoxCallable, LoxCallable } from "@/lox-callable/lox-callable";
import { LoxFunction } from "@/lox-function.ts/lox-function";
import { Lox } from "@/main";
import { Return } from "@/return/return";
import {
    Stmt,
    StmtBlock,
    StmtExpression,
    StmtFunction,
    StmtIf,
    StmtPrint,
    StmtReturn,
    StmtVar,
    StmtVisitor,
    StmtWhile,
} from "@/statement/Stmt";
import { Token } from "@/tokens/token";
import { TokenType } from "@/tokens/token-type";

export class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
    private globals: Environment = new Environment();
    private environment: Environment = this.globals;

    constructor() {
        this.globals.define("clock", {
            arity: (): number => {
                return 0;
            },
            call: (_interpreter: Interpreter, _args: unknown[]): number => {
                return Date.now() / 1000;
            },
            toString: (): string => {
                return "<native clock fn>";
            },
        } satisfies LoxCallable);
    }
    visitReturnStmt(stmt: StmtReturn): void {
        let value: unknown = null;
        if (stmt.value !== null) value = this.evaluate(stmt.value);
        throw new Return(value);
    }

    visitFunctionStatement(stmt: StmtFunction): void {
        const func: LoxFunction = new LoxFunction(stmt);
        this.environment.define(stmt.name.getLexeme(), func);
        return;
    }

    public getGlobals(): Environment {
        return this.globals;
    }

    public interpret(statements: Stmt[]): void {
        try {
            for (const statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                Lox.runtimeError(error);
                return;
            } else {
                console.error(error);
                return;
            }
        }
    }

    private execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    public visitLiteralExpr(expr: Literal): unknown {
        return expr.value;
    }

    public visitGroupingExpr(expr: Grouping): unknown {
        return this.evaluate(expr.expression);
    }

    private evaluate(expr: Expr): unknown {
        return expr.accept(this);
    }

    public visitUnaryExpr(expr: Unary): unknown {
        const right = this.evaluate(expr.right);
        switch (expr.operator.getType()) {
            case TokenType.BANG:
                return !this.isTruthy(right);
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);
        }
        return null;
    }

    public visitVariable(expr: Variable): unknown {
        return this.environment.get(expr.name);
    }

    public visitBlockStmt(stmt: StmtBlock): void {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return;
    }

    private checkNumberOperand(operator: Token, operand: unknown): void {
        if (typeof operand === "number") return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }

    private isTruthy(object: unknown): boolean {
        if (object == null) return false;
        if (typeof object === "boolean") return Boolean(object);
        return true;
    }

    public visitBinaryExpr(expr: Binary): unknown {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.getType()) {
            case TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
            case TokenType.MINUS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) - Number(right);
            case TokenType.PLUS:
                if ((typeof left === "number" || left instanceof Number) && (typeof right === "number" || right instanceof Number)) {
                    return Number(left) + Number(right);
                }
                if ((typeof left === "string" || left instanceof String) && (typeof right === "string" || right instanceof String)) {
                    return String(left) + String(right);
                }
                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);
            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right);
        }
        // Unreachable.
        return null;
    }

    public visitLogicalExpr(expr: Logical): unknown {
        const left: unknown = this.evaluate(expr.left);
        if (expr.operator.getType() == TokenType.OR) {
            if (this.isTruthy(left)) return left;
        } else {
            if (!this.isTruthy(left)) return left;
        }
        return this.evaluate(expr.right);
    }

    public visitCallExpr(expr: Call): unknown {
        const callee = this.evaluate(expr.callee);
        const args: unknown[] = [];

        for (const argument of expr.args) {
            args.push(this.evaluate(argument));
        }

        if (!isLoxCallable(callee)) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        const func: LoxCallable = callee;

        if (args.length != func.arity()) {
            throw new RuntimeError(expr.paren, "Expected " + func.arity() + " arguments but got " + args.length + ".");
        }
        return func.call(this, args);
    }

    private checkNumberOperands(operator: Token, left: unknown, right: unknown): void {
        if ((typeof left === "number" || left instanceof Number) && (typeof right === "number" || right instanceof Number)) return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }

    private isEqual(a: unknown, b: unknown): boolean {
        if (a === b) {
            return true;
        }

        if (a == null || b == null) {
            return false;
        }

        if (
            typeof a === "object" &&
            a !== null &&
            typeof b === "object" &&
            b !== null &&
            "equals" in a &&
            typeof (a as { equals: unknown }).equals === "function"
        ) {
            return (a as { equals: (other: unknown) => boolean }).equals(b);
        }

        return false;
    }

    private stringify(object: unknown): string {
        if (object == null) return "nil";
        if (typeof object === "number") {
            let text: string = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }
        return object.toString();
    }

    public visitExpressionStmt(stmt: StmtExpression): void {
        this.evaluate(stmt.expression);
        return;
    }

    public visitPrintStmt(stmt: StmtPrint): void {
        const value: unknown = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        return;
    }

    public visitIfStmt(stmt: StmtIf): void {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return;
    }

    public visitVarStmt(stmt: StmtVar): void {
        let value: unknown = null;
        if (stmt.initializer !== null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.getLexeme(), value);
        return;
    }

    public visitAssignExpr(expr: Assign): unknown {
        const value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
    }

    public executeBlock(statements: Stmt[], environment: Environment): void {
        const previous: Environment = this.environment;
        try {
            this.environment = environment;
            for (const statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    public visitWhileStmt(stmt: StmtWhile): void {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
        return;
    }
}
