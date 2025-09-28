import { Token } from "../tokens/token";
export declare class RuntimeError extends Error {
    private token;
    constructor(token: Token, message: string);
    getToken(): Token;
    getMessage(): string;
}
