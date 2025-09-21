import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "./Expr";
export declare class AstPrinter implements Visitor<string> {
    print(expr: Expr): string;
    visitBinaryExpr(expr: Binary): string;
    visitGroupingExpr(expr: Grouping): string;
    visitLiteralExpr(expr: Literal): string;
    visitUnaryExpr(expr: Unary): string;
    private parenthesize;
}
