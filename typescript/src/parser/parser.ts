import { Assign, Binary, Call, Expr, Grouping, Literal, Logical, Unary, Variable } from "@/expression/expr";
import { Lox } from "@/main";
import { Stmt, StmtBlock, StmtExpression, StmtFunction, StmtIf, StmtPrint, StmtReturn, StmtVar, StmtWhile } from "@/statement/Stmt";
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
        while (!this.isAtEnd()) {
            const newStatement = this.declaration();
            if (newStatement) statements.push(newStatement);
        }
        return statements;
    }

    private declaration(): Stmt | null {
        try {
            if (this.match(TokenType.FUN)) return this.function("function");
            if (this.match(TokenType.VAR)) return this.varDeclaration();
            return this.statement();
        } catch (error) {
            if (error instanceof ParseError) {
                this.synchronize();
            } else {
                console.debug("something is wrong with my implementation");
            }
            return null;
        }
    }

    private function(kind: string): StmtFunction {
        const name: Token = this.consume(TokenType.IDENTIFIER, "Expect " + kind + " name.");
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");
        const parameters: Token[] = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.");
                }
                parameters.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");

        this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + " body.");
        const body: Stmt[] = this.block();
        return new StmtFunction(name, parameters, body);
    }

    private varDeclaration(): Stmt {
        const name: Token = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
        let initializer: Expr | null = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new StmtVar(name, initializer);
    }

    private expression(): Expr {
        return this.assignment();
    }

    private assignment(): Expr {
        let expr: Expr = this.or();
        if (this.match(TokenType.EQUAL)) {
            const equals: Token = this.previous();
            let value: Expr = this.assignment();
            if (expr instanceof Variable) {
                const name: Token = expr.name;
                return new Assign(name, value);
            }
            Lox.error(equals, "Invalid assignment target.");
        }
        return expr;
    }

    private or(): Expr {
        let expr: Expr = this.and();
        while (this.match(TokenType.OR)) {
            const operator: Token = this.previous();
            const right: Expr = this.and();
            expr = new Logical(expr, operator, right);
        }
        return expr;
    }

    private and(): Expr {
        let expr: Expr = this.equality();
        while (this.match(TokenType.AND)) {
            const operator: Token = this.previous();
            const right: Expr = this.equality();
            expr = new Logical(expr, operator, right);
        }
        return expr;
    }

    private statement(): Stmt {
        if (this.match(TokenType.FOR)) return this.forStatement();
        if (this.match(TokenType.IF)) return this.ifStatement();
        if (this.match(TokenType.PRINT)) return this.printStatement();
        if (this.match(TokenType.RETURN)) return this.returnStatement();
        if (this.match(TokenType.WHILE)) return this.whileStatement();
        if (this.match(TokenType.LEFT_BRACE)) return new StmtBlock(this.block());
        return this.expressionStatement();
    }

    private returnStatement(): Stmt {
        const keyword: Token = this.previous();
        let value: Expr | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            value = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
        return new StmtReturn(keyword, value);
    }

    private forStatement(): Stmt {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
        let initializer: Stmt | null;
        if (this.match(TokenType.SEMICOLON)) {
            initializer = null;
        } else if (this.match(TokenType.VAR)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition: Expr | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

        let increment: Expr | null = null;
        if (!this.check(TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

        let body = this.statement();

        if (increment !== null) {
            body = new StmtBlock([body, new StmtExpression(increment)]);
        }

        if (condition === null) condition = new Literal(true);
        body = new StmtWhile(condition, body);

        if (initializer != null) {
            body = new StmtBlock([initializer, body]);
        }

        return body;
    }

    private whileStatement(): Stmt {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
        const body = this.statement();
        return new StmtWhile(condition, body);
    }

    private block(): Stmt[] {
        const statements: Stmt[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            const statement = this.declaration();
            if (statement) statements.push(statement);
        }
        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }

    private ifStatement(): Stmt {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after 'if' condition.");
        const thenBranch = this.statement();
        let elseBranch: Stmt | undefined = undefined;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }
        return new StmtIf(condition, thenBranch, elseBranch);
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
        return this.call();
    }

    private call(): Expr {
        let expr = this.primary();
        while (true) {
            if (this.match(TokenType.LEFT_PAREN)) {
                expr = this.finishCall(expr);
            } else {
                break;
            }
        }
        return expr;
    }

    private finishCall(callee: Expr): Expr {
        const args: Expr[] = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    Lox.error(this.peek(), "Can't have more than 255 arguments.");
                }
                args.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }

        const paren = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");
        return new Call(callee, paren, args);
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Literal(false);
        if (this.match(TokenType.TRUE)) return new Literal(true);
        if (this.match(TokenType.NIL)) return new Literal(null);
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().getLiteral());
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new Variable(this.previous());
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

    private synchronize(): void {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().getType() === TokenType.SEMICOLON) return;

            switch (this.peek().getType()) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.IF:
                case TokenType.FOR:
                case TokenType.WHILE:
                case TokenType.RETURN:
                case TokenType.IDENTIFIER:
                case TokenType.VAR:
                case TokenType.PRINT:
                    return;
            }
            this.advance();
        }
    }
}
