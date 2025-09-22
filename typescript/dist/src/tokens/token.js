"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    type;
    lexeme;
    literal;
    line;
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
    toString() {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
    getLexeme() {
        return this.lexeme;
    }
    getType() {
        return this.type;
    }
    getLiteral() {
        return this.literal;
    }
    getLine() {
        return this.line;
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map