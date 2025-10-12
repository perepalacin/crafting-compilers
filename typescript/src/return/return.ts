export class Return extends Error {
    private readonly value: unknown;

    constructor(value: unknown) {
        super();
        this.value = value;
    }

    public getValue(): unknown {
        return this.value;
    }
}
