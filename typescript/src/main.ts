import { RuntimeError } from "@/exceptions/runtime-exception";
import { Interpreter } from "@/interpreter/interpreter";
import { Parser } from "@/parser/parser";
import { Scanner } from "@/scanner/scanner";
import { Stmt } from "@/statement/Stmt";
import { Token } from "@/tokens/token";
import { TokenType } from "@/tokens/token-type";
import fs from "node:fs";
import process from "node:process";
import * as readline from "node:readline/promises";

export class Lox {
    private static hadError: boolean = false;
    private static hadRuntimeError: boolean = false;

    private static runFile(path: string): void {
        const bytes: Buffer = fs.readFileSync(path);
        Lox.run(bytes.toString());
        if (Lox.hadError) {
            return process.exit(65);
        } else if (Lox.hadRuntimeError) {
            return process.exit(70);
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

    private static run(source: string): void {
        const scanner = new Scanner(source);
        const tokens: Token[] = scanner.scanTokens();
        const parser: Parser = new Parser(tokens);
        const interpreter = new Interpreter();
        const statements: Stmt[] = parser.parse();
        if (this.hadError || statements === null) return;
        interpreter.interpret(statements);
    }

    public static error(lineOrToken: number | Token, message: string): void {
        if (typeof lineOrToken === "number") {
            this.report(lineOrToken, "", message);
        } else {
            if (lineOrToken.getType() === TokenType.EOF) {
                this.report(lineOrToken.getLine(), " at end", message);
            } else {
                this.report(lineOrToken.getLine(), " at '" + lineOrToken.getLexeme() + "'", message);
            }
        }
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

    public static runtimeError(error: RuntimeError): void {
        console.error(error.getMessage() + "\n[line " + error.getToken().getLine() + "]");
        Lox.hadRuntimeError = true;
    }
}

const args = process.argv.slice(2);
Lox.main(args);
