"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstPrinter = void 0;
class AstPrinter {
    print(expr) {
        return expr.accept(this);
    }
    visitBinaryExpr(expr) {
        return this.parenthesize(expr.operator.getLexeme(), expr.left, expr.right);
    }
    visitGroupingExpr(expr) {
        return this.parenthesize("group", expr.expression);
    }
    visitLiteralExpr(expr) {
        if (expr.value === null)
            return "nil";
        return expr.value.toString();
    }
    visitUnaryExpr(expr) {
        return this.parenthesize(expr.operator.toString(), expr.right);
    }
    parenthesize(name, ...exprs) {
        let newExpr = "(" + name;
        exprs.forEach((expr) => {
            newExpr += " " + expr.accept(this);
        });
        newExpr += ")";
        return newExpr;
    }
}
exports.AstPrinter = AstPrinter;
//# sourceMappingURL=ast-printer.js.map