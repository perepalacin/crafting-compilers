export declare class Lox {
    private static hadError;
    private static runFile;
    private static runPrompt;
    private static scanTokens;
    private static run;
    static error(line: number, message: string): void;
    private static report;
    static main(args: string[]): void;
}
