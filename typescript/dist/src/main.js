"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lox = void 0;
const ast_printer_1 = require("expression/ast-printer");
const Expr_1 = require("expression/Expr");
const node_process_1 = __importDefault(require("node:process"));
const token_1 = require("tokens/token");
const token_type_1 = require("tokens/token-type");
class Lox {
    static hadError = false;
    static error(line, message) {
        Lox.report(line, "", message);
    }
    static report(line, where, message) {
        console.error("[line " + line + "] Error " + where + ": " + message);
        Lox.hadError = true;
    }
    static main(args) {
        console.log(args);
        const expression = new Expr_1.Binary(new Expr_1.Unary(new token_1.Token(token_type_1.TokenType.MINUS, "-", null, 1), new Expr_1.Literal(123)), new token_1.Token(token_type_1.TokenType.STAR, "*", null, 1), new Expr_1.Grouping(new Expr_1.Literal(45.67)));
        console.log(new ast_printer_1.AstPrinter().print(expression));
    }
}
exports.Lox = Lox;
const args = node_process_1.default.argv.slice(2);
Lox.main(args);
//# sourceMappingURL=main.js.map