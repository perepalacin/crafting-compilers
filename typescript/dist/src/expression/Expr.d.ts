import { Token } from "tokens/token";
export declare abstract class Expr {
}
export interface Visitor<R> {
    visitBinaryExpr(expr: Binary): R;
    visitGroupingExpr(expr: Grouping): R;
    visitLiteralExpr(expr: Literal): R;
    visitUnaryExpr(expr: Unary): R;
}
export declare class Binary extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr);
    accept<R>(visitor: Visitor<R>): R;
}
export declare class Grouping extends Expr {
    expression: Expr;
    constructor(expression: Expr);
    accept<R>(visitor: Visitor<R>): R;
}
export declare class Literal extends Expr {
    value: object;
    constructor(value: object);
    accept<R>(visitor: Visitor<R>): R;
}
export declare class Unary extends Expr {
    operator: Token;
    right: Expr;
    constructor(operator: Token, right: Expr);
    accept<R>(visitor: Visitor<R>): R;
}
