"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const runtime_exception_1 = require("../exceptions/runtime-exception");
const main_1 = require("../main");
const token_type_1 = require("../tokens/token-type");
class Interpreter {
    interpret(statements) {
        try {
            for (const statement of statements) {
                this.execute(statement);
            }
        }
        catch (error) {
            if (error instanceof runtime_exception_1.RuntimeError) {
                main_1.Lox.runtimeError(error);
            }
            else {
                console.error(error);
            }
        }
    }
    execute(stmt) {
        stmt.accept(this);
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
    }
    evaluate(expr) {
        return expr.accept(this);
    }
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.getType()) {
            case token_type_1.TokenType.BANG:
                return !this.isTruthy(right);
            case token_type_1.TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);
        }
        return null;
    }
    checkNumberOperand(operator, operand) {
        if (operand instanceof Number)
            return;
        throw new runtime_exception_1.RuntimeError(operator, "Operand must be a number.");
    }
    isTruthy(object) {
        if (object == null)
            return false;
        if (object instanceof Boolean)
            return Boolean(object);
        return true;
    }
    visitBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.getType()) {
            case token_type_1.TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case token_type_1.TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case token_type_1.TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);
            case token_type_1.TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);
            case token_type_1.TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case token_type_1.TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
            case token_type_1.TokenType.MINUS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) - Number(right);
            case token_type_1.TokenType.PLUS:
                if (left instanceof Number && right instanceof Number) {
                    return Number(left) + Number(right);
                }
                if (left instanceof String && right instanceof String) {
                    return String(left) + String(right);
                }
                throw new runtime_exception_1.RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case token_type_1.TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);
            case token_type_1.TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right);
        }
        return null;
    }
    checkNumberOperands(operator, left, right) {
        if (left instanceof Number || right instanceof Number)
            return;
        throw new runtime_exception_1.RuntimeError(operator, "Operand must be a number.");
    }
    isEqual(a, b) {
        if (a === b) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        if (typeof a === "object" &&
            a !== null &&
            typeof b === "object" &&
            b !== null &&
            "equals" in a &&
            typeof a.equals === "function") {
            return a.equals(b);
        }
        return false;
    }
    stringify(object) {
        if (object == null)
            return "nil";
        if (object instanceof Number) {
            let text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }
        return object.toString();
    }
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
        return;
    }
    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        return;
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map