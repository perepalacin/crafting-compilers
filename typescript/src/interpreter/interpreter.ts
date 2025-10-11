import { Environment } from "@/environment/environment";
import { RuntimeError } from "@/exceptions/runtime-exception";
import { Assign, Binary, Expr, ExprVisitor, Grouping, Literal, Unary, Variable } from "@/expression/expr";
import { Lox } from "@/main";
import { Stmt, StmtBlock, StmtExpression, StmtPrint, StmtVar, StmtVisitor } from "@/statement/Stmt";
import { Token } from "@/tokens/token";
import { TokenType } from "@/tokens/token-type";

export class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
    private environment: Environment = new Environment();

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
        if (operand instanceof Number) return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }

    private isTruthy(object: unknown): boolean {
        if (object == null) return false;
        if (object instanceof Boolean) return Boolean(object);
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
                if (left instanceof Number && right instanceof Number) {
                    return Number(left) + Number(right);
                }
                if (left instanceof String && right instanceof String) {
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

    private checkNumberOperands(operator: Token, left: unknown, right: unknown): void {
        if (left instanceof Number || right instanceof Number) return;
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
        if (object instanceof Number) {
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
        this.environment.assign(expr.name, expr.value);
        return value;
    }

    private executeBlock(statements: Stmt[], environment: Environment): void {
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
}
