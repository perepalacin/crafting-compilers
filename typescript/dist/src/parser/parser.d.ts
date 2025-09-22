import { Token } from "tokens/token";
import { Expr } from "../expression/expr";
export declare class Parser {
    private tokens;
    private current;
    constructor(tokens: Token[]);
    parse(): Expr | null;
    private expression;
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
