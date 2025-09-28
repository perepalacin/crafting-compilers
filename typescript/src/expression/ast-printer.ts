import { Binary, Expr, ExprVisitor, Grouping, Literal, Unary } from "@/expression/expr";

export class AstPrinter implements ExprVisitor<string> {
    public print(expr: Expr): string {
        return expr.accept(this);
    }

    public visitBinaryExpr(expr: Binary): string {
        return this.parenthesize(expr.operator.getLexeme(), expr.left, expr.right);
    }

    public visitGroupingExpr(expr: Grouping): string {
        return this.parenthesize("group", expr.expression);
    }

    public visitLiteralExpr(expr: Literal): string {
        if (expr.value === null) return "nil";
        return expr.value.toString();
    }

    public visitUnaryExpr(expr: Unary): string {
        return this.parenthesize(expr.operator.toString(), expr.right);
    }

    private parenthesize(name: string, ...exprs: Expr[]): string {
        let newExpr = "(" + name;
        exprs.forEach((expr) => {
            newExpr += " " + expr.accept(this);
        });

        newExpr += ")";
        return newExpr;
    }
}
