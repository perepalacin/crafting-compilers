import { TokenType } from "./token-type";

export class Token {
    private type: TokenType;
    private lexeme: string;
    private literal: object | null;
    private line: number;

    public constructor(type: TokenType, lexeme: string, literal: object | null, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public toString(): string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }

    public getLexeme(): string {
        return this.lexeme;
    }

    public getType(): TokenType {
        return this.type;
    }

    public getLiteral(): object | null {
        return this.literal;
    }

    public getLine(): number {
        return this.line;
    }
}
