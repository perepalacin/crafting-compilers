"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const main_1 = require("main");
const token_1 = require("tokens/token");
const token_type_1 = require("tokens/token-type");
class Scanner {
    source;
    tokens;
    start = 0;
    current = 0;
    line = 0;
    static keywords;
    static {
        Scanner.keywords = {};
        Scanner.keywords.and = token_type_1.TokenType.AND;
        Scanner.keywords.class = token_type_1.TokenType.CLASS;
        Scanner.keywords.else = token_type_1.TokenType.ELSE;
        Scanner.keywords.false = token_type_1.TokenType.FALSE;
        Scanner.keywords.for = token_type_1.TokenType.FOR;
        Scanner.keywords.fun = token_type_1.TokenType.FUN;
        Scanner.keywords.if = token_type_1.TokenType.IF;
        Scanner.keywords.nil = token_type_1.TokenType.NIL;
        Scanner.keywords.or = token_type_1.TokenType.OR;
        Scanner.keywords.print = token_type_1.TokenType.PRINT;
        Scanner.keywords.return = token_type_1.TokenType.RETURN;
        Scanner.keywords.super = token_type_1.TokenType.SUPER;
        Scanner.keywords.this = token_type_1.TokenType.THIS;
        Scanner.keywords.true = token_type_1.TokenType.TRUE;
        Scanner.keywords.var = token_type_1.TokenType.VAR;
        Scanner.keywords.while = token_type_1.TokenType.WHILE;
    }
    constructor(source) {
        this.source = source;
        this.tokens = [];
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    advance() {
        this.current++;
        return this.source.charAt(this.current - 1);
    }
    addToken(type, literal) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new token_1.Token(type, text, literal ? literal : null, this.line));
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            case "(":
                this.addToken(token_type_1.TokenType.LEFT_PAREN);
                break;
            case ")":
                this.addToken(token_type_1.TokenType.RIGHT_PAREN);
                break;
            case "{":
                this.addToken(token_type_1.TokenType.LEFT_BRACE);
                break;
            case "}":
                this.addToken(token_type_1.TokenType.RIGHT_BRACE);
                break;
            case ",":
                this.addToken(token_type_1.TokenType.COMMA);
                break;
            case ".":
                this.addToken(token_type_1.TokenType.DOT);
                break;
            case "-":
                this.addToken(token_type_1.TokenType.MINUS);
                break;
            case "+":
                this.addToken(token_type_1.TokenType.PLUS);
                break;
            case ";":
                this.addToken(token_type_1.TokenType.SEMICOLON);
                break;
            case "*":
                this.addToken(token_type_1.TokenType.STAR);
                break;
            case "!":
                this.addToken(this.match("=") ? token_type_1.TokenType.BANG_EQUAL : token_type_1.TokenType.BANG);
                break;
            case "=":
                this.addToken(this.match("=") ? token_type_1.TokenType.EQUAL_EQUAL : token_type_1.TokenType.EQUAL);
                break;
            case "<":
                this.addToken(this.match("=") ? token_type_1.TokenType.LESS_EQUAL : token_type_1.TokenType.LESS);
                break;
            case ">":
                this.addToken(this.match("=") ? token_type_1.TokenType.GREATER_EQUAL : token_type_1.TokenType.GREATER);
                break;
            case "/":
                if (this.match("/")) {
                    while (this.peek() != "\n" && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(token_type_1.TokenType.SLASH);
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
                }
                else if (this.isAlpha(c)) {
                    this.handleIdentifier();
                }
                else {
                    main_1.Lox.error(this.line, "Unexpected character.");
                }
                break;
        }
    }
    isAlpha(c) {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
    }
    isDigit(c) {
        const num = Number(c);
        return !Number.isNaN(num) && num >= 0 && num <= 9;
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
    handleIdentifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        const text = this.source.substring(this.start, this.current);
        this.addToken(token_type_1.TokenType.IDENTIFIER);
        let type = Scanner.keywords[text];
        if (type == null)
            type = token_type_1.TokenType.IDENTIFIER;
        this.addToken(type);
    }
    handleNumberToken() {
        while (this.isDigit(this.peek()))
            this.advance();
        if (this.peek() == "." && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        this.addToken(token_type_1.TokenType.NUMBER, Object(Number(this.source.substring(this.start, this.current))));
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return "\0";
        return this.source.charAt(this.current + 1);
    }
    handleStringToken() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n")
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            main_1.Lox.error(this.line, "Unterminated string literal");
            return;
        }
        this.advance();
        const result = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(token_type_1.TokenType.STRING, Object(result));
    }
    match(expectedChar) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expectedChar)
            return false;
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return "\0";
        return this.source.charAt(this.current);
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new token_1.Token(token_type_1.TokenType.EOF, "", null, this.line));
        return this.tokens;
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map