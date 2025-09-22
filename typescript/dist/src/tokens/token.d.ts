import { TokenType } from "./token-type";
export declare class Token {
    private type;
    private lexeme;
    private literal;
    private line;
    constructor(type: TokenType, lexeme: string, literal: object | null, line: number);
    toString(): string;
    getLexeme(): string;
    getType(): TokenType;
    getLiteral(): object | null;
    getLine(): number;
}
