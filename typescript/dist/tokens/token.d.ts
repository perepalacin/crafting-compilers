import { TokenType } from "./TokenType";
export declare class Token {
    private type;
    private lexeme;
    private literal;
    constructor(type: TokenType, lexeme: string, literal: object | null, _line: number);
    toString(): string;
}
