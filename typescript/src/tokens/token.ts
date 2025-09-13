import { TokenType } from "./TokenType";

export class Token {
    private type: TokenType;
    private lexeme: string;
    private literal: object | null;
    // private line: number;

    public constructor(type: TokenType, lexeme: string, literal: object | null, _line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        // this.line = line;
    }

    public toString(): string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}
