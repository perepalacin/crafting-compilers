import { TokenType } from "./token-type";
export declare class Token {
    private type;
    private lexeme;
    private literal;
    private line;
    constructor(type: TokenType, lexeme: string, literal: unknown, line: number);
    toString(): string;
    getLexeme(): string;
    getType(): TokenType;
    getLiteral(): unknown;
    getLine(): number;
}
