import { Token } from "../tokens/token";
export interface ExprVisitor<R> {
    visitBinaryExpr(expr: Binary): R;
    visitGroupingExpr(expr: Grouping): R;
    visitLiteralExpr(expr: Literal): R;
    visitUnaryExpr(expr: Unary): R;
}
export declare abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
}
export declare class Binary extends Expr {
    readonly left: Expr;
    readonly operator: Token;
    readonly right: Expr;
    constructor(left: Expr, operator: Token, right: Expr);
    accept<R>(visitor: ExprVisitor<R>): R;
}
export declare class Grouping extends Expr {
    readonly expression: Expr;
    constructor(expression: Expr);
    accept<R>(visitor: ExprVisitor<R>): R;
}
export declare class Literal extends Expr {
    readonly value: any;
    constructor(value: any);
    accept<R>(visitor: ExprVisitor<R>): R;
}
export declare class Unary extends Expr {
    readonly operator: Token;
    readonly right: Expr;
    constructor(operator: Token, right: Expr);
    accept<R>(visitor: ExprVisitor<R>): R;
}
