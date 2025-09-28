import { Binary, Expr, ExprVisitor, Grouping, Literal, Unary } from "../expression/expr";
export declare class AstPrinter implements ExprVisitor<string> {
    print(expr: Expr): string;
    visitBinaryExpr(expr: Binary): string;
    visitGroupingExpr(expr: Grouping): string;
    visitLiteralExpr(expr: Literal): string;
    visitUnaryExpr(expr: Unary): string;
    private parenthesize;
}
