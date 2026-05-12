export class ReactiveArray extends Array {
    constructor(notifyCallback, ...args) {
        super(...args);
        this.notifyCallback = notifyCallback;
    }

    push(...args) {
        const result = super.push(...args);
        this.notifyCallback(this);
        return result;
    }
}
