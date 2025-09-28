import { Stmt } from "../statement/Stmt";
import { Token } from "../tokens/token";
export declare class Parser {
    private tokens;
    private current;
    constructor(tokens: Token[]);
    parse(): Stmt[];
    private expression;
    private statement;
    private printStatement;
    private expressionStatement;
    private equality;
    private comparison;
    private term;
    private factor;
    private unary;
    private primary;
    private match;
    private consume;
    private advance;
    private check;
    private isAtEnd;
    private peek;
    private previous;
    private error;
}
