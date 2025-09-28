import { Binary, ExprVisitor, Grouping, Literal, Unary } from "../expression/expr";
import { Stmt, StmtExpression, StmtPrint, StmtVisitor } from "../statement/Stmt";
export declare class Interpreter implements ExprVisitor<unknown>, StmtVisitor<void> {
    interpret(statements: Stmt[]): void;
    private execute;
    visitLiteralExpr(expr: Literal): unknown;
    visitGroupingExpr(expr: Grouping): unknown;
    private evaluate;
    visitUnaryExpr(expr: Unary): unknown;
    private checkNumberOperand;
    private isTruthy;
    visitBinaryExpr(expr: Binary): unknown;
    private checkNumberOperands;
    private isEqual;
    private stringify;
    visitExpressionStmt(stmt: StmtExpression): void;
    visitPrintStmt(stmt: StmtPrint): void;
}
