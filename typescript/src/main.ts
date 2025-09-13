import fs from "node:fs";
import process from "node:process";
import * as readline from "node:readline/promises";
import { Token } from "tokens/token";

export class Lox {
    private static hadError: boolean = false;

    private static runFile(path: string): void {
        const bytes: Buffer = fs.readFileSync(path);
        Lox.run(bytes.toString());
        if (Lox.hadError) {
            return process.exit(65);
        }
    }

    private static async runPrompt(): Promise<void> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        for (;;) {
            const line = await rl.question("> ");
            if (line === null) break;
            Lox.run(line);
            Lox.hadError = true;
        }
    }

    private static scanTokens(_source: string): Token[] {
        return [];
        // const tokens = source.split(/\s+/).filter(token => token.length > 0);
        // return tokens.map(lexeme => new Token());
    }

    private static run(source: string): void {
        const tokens: Token[] = Lox.scanTokens(source);

        for (const token of tokens) {
            console.log(token);
        }
    }

    public static error(line: number, message: string): void {
        Lox.report(line, "", message);
    }

    private static report(line: number, where: string, message: string): void {
        console.error("[line " + line + "] Error " + where + ": " + message);
        Lox.hadError = true;
    }

    public static main(args: string[]): void {
        if (!args) return process.exit(0);
        if (args.length > 1) {
            console.log("Usage: jlox [script]");
            return process.exit(64);
        } else if (args.length == 1) {
            this.runFile(args[0]);
        } else {
            this.runPrompt();
        }
    }
}

const args = process.argv.slice(2);
Lox.main(args);
