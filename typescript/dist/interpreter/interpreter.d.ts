import { Binary, Grouping, Literal, Unary, Visitor } from "../expression/expr";
export declare class Interpreter implements Visitor<unknown> {
    visitLiteralExpr(expr: Literal): unknown;
    visitGroupingExpr(expr: Grouping): unknown;
    private evaluate;
    visitUnaryExpr(expr: Unary): unknown;
    private isTruthy;
    visitBinaryExpr(expr: Binary): unknown;
    private isEqual;
}
