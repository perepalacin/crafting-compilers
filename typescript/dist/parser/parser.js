"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const expr_1 = require("../expression/expr");
const main_1 = require("../main");
const token_type_1 = require("../tokens/token-type");
const parse_error_1 = require("./parse-error");
class Parser {
    tokens;
    current = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    parse() {
        try {
            return this.expression();
        }
        catch (error) {
            console.error("There was an error parsing lox code related to its typescript implementation: ", error);
            return null;
        }
    }
    expression() {
        return this.equality();
    }
    equality() {
        let expr = this.comparison();
        while (this.match(token_type_1.TokenType.BANG_EQUAL, token_type_1.TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match(token_type_1.TokenType.GREATER, token_type_1.TokenType.GREATER_EQUAL, token_type_1.TokenType.LESS, token_type_1.TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(token_type_1.TokenType.MINUS, token_type_1.TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(token_type_1.TokenType.SLASH, token_type_1.TokenType.STAR)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(token_type_1.TokenType.BANG, token_type_1.TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new expr_1.Unary(operator, right);
        }
        return this.primary();
    }
    primary() {
        if (this.match(token_type_1.TokenType.FALSE))
            return new expr_1.Literal(false);
        if (this.match(token_type_1.TokenType.TRUE))
            return new expr_1.Literal(true);
        if (this.match(token_type_1.TokenType.NIL))
            return new expr_1.Literal(null);
        if (this.match(token_type_1.TokenType.NUMBER, token_type_1.TokenType.STRING)) {
            return new expr_1.Literal(this.previous().getLiteral());
        }
        if (this.match(token_type_1.TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(token_type_1.TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new expr_1.Grouping(expr);
        }
        throw this.error(this.peek(), "Expect expression.");
    }
    match(...types) {
        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        throw this.error(this.peek(), message);
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().getType() === type;
    }
    isAtEnd() {
        return this.peek().getType() === token_type_1.TokenType.EOF;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    error(token, message) {
        main_1.Lox.error(token, message);
        return new parse_error_1.ParseError();
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map