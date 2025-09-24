import { Binary, Expr, Grouping, Literal, Unary } from "@/expression/expr";
import { Lox } from "@/main";
import { Stmt, StmtExpression, StmtPrint } from "@/statement/Stmt";
import { Token } from "@/tokens/token";
import { TokenType } from "@/tokens/token-type";
import { ParseError } from "./parse-error";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    public constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Stmt[] {
        const statements: Stmt[] = [];
        try {
            while (!this.isAtEnd()) {
                statements.push(this.statement());
            }
        } catch (error) {
            console.error("There was an error parsing lox code related to its typescript implementation: ", error);
        }
        return statements;
    }

    private expression(): Expr {
        return this.equality();
    }

    private statement(): Stmt {
        if (this.match(TokenType.PRINT)) return this.printStatement();

        return this.expressionStatement();
    }

    private printStatement(): Stmt {
        const value: Expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new StmtPrint(value);
    }

    private expressionStatement(): Stmt {
        const expr: Expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new StmtExpression(expr);
    }

    private equality(): Expr {
        let expr: Expr = this.comparison();
        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    private comparison(): Expr {
        let expr: Expr = this.term();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    private term(): Expr {
        let expr = this.factor();
        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.factor();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private factor(): Expr {
        let expr: Expr = this.unary();
        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            return new Unary(operator, right);
        }
        return this.primary();
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Literal(false);
        if (this.match(TokenType.TRUE)) return new Literal(true);
        if (this.match(TokenType.NIL)) return new Literal(null);
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().getLiteral());
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr: Expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }

        throw this.error(this.peek(), "Expect expression.");
    }

    private match(...types: TokenType[]): boolean {
        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().getType() === type;
    }
    private isAtEnd(): boolean {
        return this.peek().getType() === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private error(token: Token, message: string): ParseError {
        Lox.error(token, message);
        return new ParseError();
    }

    // private synchronize(): void {
    //     this.advance();
    //     while (!this.isAtEnd()) {
    //         if (this.previous().getType() === TokenType.SEMICOLON) return;

    //         switch (this.peek().getType()) {
    //             case TokenType.CLASS:
    //             case TokenType.FUN:
    //             case TokenType.IF:
    //             case TokenType.FOR:
    //             case TokenType.WHILE:
    //             case TokenType.RETURN:
    //             case TokenType.IDENTIFIER:
    //             case TokenType.VAR:
    //             case TokenType.PRINT:
    //                 return;
    //         }
    //         this.advance();
    //     }
    // }
}
