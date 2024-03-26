export class TxError extends Error {
	constructor(reason: string) {
		super(`Couldn't complete transaction: ${reason}`);

		Object.setPrototypeOf(this, TxError.prototype);
	}
}
