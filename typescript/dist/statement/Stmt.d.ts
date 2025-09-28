import { Expr } from "../expression/expr";
export interface StmtVisitor<R> {
    visitExpressionStmt(stmt: StmtExpression): R;
    visitPrintStmt(stmt: StmtPrint): R;
}
export declare abstract class Stmt {
    abstract accept<R>(visitor: StmtVisitor<R>): R;
}
export declare class StmtExpression extends Stmt {
    readonly expression: Expr;
    constructor(expression: Expr);
    accept<R>(visitor: StmtVisitor<R>): R;
}
export declare class StmtPrint extends Stmt {
    readonly expression: Expr;
    constructor(expression: Expr);
    accept<R>(visitor: StmtVisitor<R>): R;
}
