import { Token } from "tokens/token";
export declare class Lox {
    private static hadError;
    private static runFile;
    private static runPrompt;
    private static scanTokens;
    private static run;
    static error(lineOrToken: number | Token, message: string): void;
    private static report;
    static main(args: string[]): void;
}
