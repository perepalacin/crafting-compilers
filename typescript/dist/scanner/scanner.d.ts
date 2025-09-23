import { Token } from "../tokens/token";
export declare class Scanner {
    private source;
    private tokens;
    private start;
    private current;
    private line;
    private static keywords;
    constructor(source: string);
    private isAtEnd;
    private advance;
    private addToken;
    private scanToken;
    private isAlpha;
    private isDigit;
    private isAlphaNumeric;
    private handleIdentifier;
    private handleNumberToken;
    private peekNext;
    private handleStringToken;
    private match;
    private peek;
    scanTokens(): Token[];
}
