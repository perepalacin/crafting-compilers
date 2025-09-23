"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const token_type_1 = require("tokens/token-type");
class Interpreter {
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
                return -Number(right);
        }
        return null;
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
                return Number(left) > Number(right);
            case token_type_1.TokenType.GREATER_EQUAL:
                return Number(left) >= Number(right);
            case token_type_1.TokenType.LESS:
                return Number(left) < Number(right);
            case token_type_1.TokenType.LESS_EQUAL:
                return Number(left) <= Number(right);
            case token_type_1.TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case token_type_1.TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
            case token_type_1.TokenType.MINUS:
                return Number(left) - Number(right);
            case token_type_1.TokenType.PLUS:
                if (left instanceof Number && right instanceof Number) {
                    return Number(left) + Number(right);
                }
                if (left instanceof String && right instanceof String) {
                    return String(left) + String(right);
                }
                break;
            case token_type_1.TokenType.SLASH:
                return Number(left) / Number(right);
            case token_type_1.TokenType.STAR:
                return Number(left) * Number(right);
        }
        return null;
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
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map