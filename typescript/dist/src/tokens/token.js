"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    type;
    lexeme;
    literal;
    constructor(type, lexeme, literal, _line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
    }
    toString() {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map