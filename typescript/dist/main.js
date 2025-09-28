"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lox = void 0;
const interpreter_1 = require("./interpreter/interpreter");
const parser_1 = require("./parser/parser");
const scanner_1 = require("./scanner/scanner");
const token_type_1 = require("./tokens/token-type");
const node_fs_1 = __importDefault(require("node:fs"));
const node_process_1 = __importDefault(require("node:process"));
const readline = __importStar(require("node:readline/promises"));
class Lox {
    static hadError = false;
    static hadRuntimeError = false;
    static runFile(path) {
        const bytes = node_fs_1.default.readFileSync(path);
        Lox.run(bytes.toString());
        if (Lox.hadError) {
            return node_process_1.default.exit(65);
        }
        else if (Lox.hadRuntimeError) {
            return node_process_1.default.exit(70);
        }
    }
    static async runPrompt() {
        const rl = readline.createInterface({
            input: node_process_1.default.stdin,
            output: node_process_1.default.stdout,
        });
        for (;;) {
            const line = await rl.question("> ");
            if (line === null)
                break;
            Lox.run(line);
            Lox.hadError = true;
        }
    }
    static run(source) {
        const scanner = new scanner_1.Scanner(source);
        const tokens = scanner.scanTokens();
        const parser = new parser_1.Parser(tokens);
        console.log(parser);
        const interpreter = new interpreter_1.Interpreter();
        const statements = parser.parse();
        console.log(statements);
        if (this.hadError || statements === null)
            return;
        interpreter.interpret(statements);
    }
    static error(lineOrToken, message) {
        if (typeof lineOrToken === "number") {
            this.report(lineOrToken, "", message);
        }
        else {
            if (lineOrToken.getType() === token_type_1.TokenType.EOF) {
                this.report(lineOrToken.getLine(), " at end", message);
            }
            else {
                this.report(lineOrToken.getLine(), " at '" + lineOrToken.getLexeme() + "'", message);
            }
        }
    }
    static report(line, where, message) {
        console.error("[line " + line + "] Error " + where + ": " + message);
        Lox.hadError = true;
    }
    static main(args) {
        if (!args)
            return node_process_1.default.exit(0);
        if (args.length > 1) {
            console.log("Usage: jlox [script]");
            return node_process_1.default.exit(64);
        }
        else if (args.length == 1) {
            this.runFile(args[0]);
        }
        else {
            this.runPrompt();
        }
    }
    static runtimeError(error) {
        console.error(error.getMessage() + "\n[line " + error.getToken().getLine() + "]");
        Lox.hadRuntimeError = true;
    }
}
exports.Lox = Lox;
const args = node_process_1.default.argv.slice(2);
Lox.main(args);
//# sourceMappingURL=main.js.map