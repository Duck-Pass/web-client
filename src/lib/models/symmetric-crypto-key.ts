import { Opaque } from "type-fest";
import { BufferUtils } from "../BufferUtils";

// Encrypted Key using AES-256-CBC with HMAC-SHA256

export class SymmetricCryptoKey {
	key: Uint8Array;
	encKey: Uint8Array;
	macKey?: Uint8Array;

	b64key: string;
	b64encKey: string;
	b64macKey: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	meta: any;

	constructor(key: Uint8Array, authenticated = false) {
		this.key = key;
		if (key.byteLength === 64) {
			this.encKey = key.slice(0, 32);
			this.macKey = key.slice(32, 64);
		} else if (key.byteLength == 32 && !authenticated) {
			this.encKey = key;
		} else if (key.byteLength == 32 && authenticated) {
			this.encKey = key.slice(0, 16);
			this.macKey = key.slice(16, 32);
		} else {
			throw new Error("Invalid key length.");
		}

		this.b64key = BufferUtils.fromBufferToBase64(this.key);
		this.b64encKey = BufferUtils.fromBufferToBase64(this.encKey);

		if (this.macKey) {
			this.b64macKey = BufferUtils.fromBufferToBase64(this.macKey);
		}
	}

	toJSON() {
		return { b64key: this.b64key };
	}
}

export type MasterKey = Opaque<SymmetricCryptoKey, "MasterKey">;
export type UserKey = Opaque<SymmetricCryptoKey, "UserKey">;
