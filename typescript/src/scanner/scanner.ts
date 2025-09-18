import { Lox } from "main";
import { Token } from "tokens/token";
import { TokenType } from "tokens/token-type";

export class Scanner {
    private source: string;
    private tokens: Token[];
    private start: number = 0;
    private current: number = 0;
    private line: number = 0;

    private static keywords: Record<string, TokenType>;

    static {
        Scanner.keywords = {};
        Scanner.keywords.and = TokenType.AND;
        Scanner.keywords.class = TokenType.CLASS;
        Scanner.keywords.else = TokenType.ELSE;
        Scanner.keywords.false = TokenType.FALSE;
        Scanner.keywords.for = TokenType.FOR;
        Scanner.keywords.fun = TokenType.FUN;
        Scanner.keywords.if = TokenType.IF;
        Scanner.keywords.nil = TokenType.NIL;
        Scanner.keywords.or = TokenType.OR;
        Scanner.keywords.print = TokenType.PRINT;
        Scanner.keywords.return = TokenType.RETURN;
        Scanner.keywords.super = TokenType.SUPER;
        Scanner.keywords.this = TokenType.THIS;
        Scanner.keywords.true = TokenType.TRUE;
        Scanner.keywords.var = TokenType.VAR;
        Scanner.keywords.while = TokenType.WHILE;
    }

    public constructor(source: string) {
        this.source = source;
        this.tokens = [];
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private advance(): string {
        this.current++;
        return this.source.charAt(this.current - 1);
    }

    private addToken(type: TokenType, literal?: object): void {
        const text: string = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal ? literal : null, this.line));
    }

    private scanToken(): void {
        const c: string = this.advance();
        switch (c) {
            case "(":
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ")":
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case "{":
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case "}":
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ",":
                this.addToken(TokenType.COMMA);
                break;
            case ".":
                this.addToken(TokenType.DOT);
                break;
            case "-":
                this.addToken(TokenType.MINUS);
                break;
            case "+":
                this.addToken(TokenType.PLUS);
                break;
            case ";":
                this.addToken(TokenType.SEMICOLON);
                break;
            case "*":
                this.addToken(TokenType.STAR);
                break;
            case "!":
                this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case "=":
                this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case "<":
                this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case ">":
                this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case "/":
                if (this.match("/")) {
                    while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;
            case " ":
            case "\r":
            case "\t":
                break;
            case "\n":
                this.line++;
                break;
            case '"':
                this.handleStringToken();
                break;
            default:
                if (this.isDigit(c)) {
                    this.handleNumberToken();
                } else if (this.isAlpha(c)) {
                    this.handleIdentifier();
                } else {
                    Lox.error(this.line, "Unexpected character.");
                }
                break;
        }
    }

    private isAlpha(c: string): boolean {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
    }

    private isDigit(c: string): boolean {
        const num = Number(c);
        return !Number.isNaN(num) && num >= 0 && num <= 9;
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private handleIdentifier(): void {
        while (this.isAlphaNumeric(this.peek())) this.advance();
        const text: string = this.source.substring(this.start, this.current);
        this.addToken(TokenType.IDENTIFIER);
        let type: TokenType = Scanner.keywords[text];
        if (type == null) type = TokenType.IDENTIFIER;
        this.addToken(type);
    }

    private handleNumberToken(): void {
        while (this.isDigit(this.peek())) this.advance();
        if (this.peek() == "." && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) this.advance();
        }
        this.addToken(TokenType.NUMBER, Object(Number(this.source.substring(this.start, this.current))));
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return "\0";
        return this.source.charAt(this.current + 1);
    }

    private handleStringToken(): void {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n") this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            Lox.error(this.line, "Unterminated string literal");
            return;
        }

        this.advance();

        const result: string = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, Object(result));
    }

    private match(expectedChar: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) != expectedChar) return false;
        this.current++;
        return true;
    }

    private peek(): string {
        if (this.isAtEnd()) return "\0";
        return this.source.charAt(this.current);
    }

    public scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }
}
