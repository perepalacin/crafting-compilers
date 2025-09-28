"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StmtPrint = exports.StmtExpression = exports.Stmt = void 0;
class Stmt {
}
exports.Stmt = Stmt;
class StmtExpression extends Stmt {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}
exports.StmtExpression = StmtExpression;
class StmtPrint extends Stmt {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}
exports.StmtPrint = StmtPrint;
//# sourceMappingURL=Stmt.js.map