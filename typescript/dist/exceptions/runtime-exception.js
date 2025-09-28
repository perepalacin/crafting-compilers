"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = void 0;
class RuntimeError extends Error {
    token;
    constructor(token, message) {
        super(message);
        this.token = token;
    }
    getToken() {
        return this.token;
    }
    getMessage() {
        return this.message;
    }
}
exports.RuntimeError = RuntimeError;
//# sourceMappingURL=runtime-exception.js.map