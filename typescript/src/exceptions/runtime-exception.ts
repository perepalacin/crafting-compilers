import { Token } from "@/tokens/token";

export class RuntimeError extends Error {
    private token: Token;

    public constructor(token: Token, message: string) {
        super(message);
        this.token = token;
    }

    public getToken(): Token {
        return this.token;
    }

    public getMessage(): string {
        return this.message;
    }
}
