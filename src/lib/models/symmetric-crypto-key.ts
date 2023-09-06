import { Opaque } from "type-fest";
import { BufferUtils } from "../BufferUtils";

// Encrypted Key using AES-256-CBC with HMAC-SHA256

/**
 * @description this class describe a Symmetric Crypto Key.
 * @property key the key as a Uint8Array
 * @property encKey the encryption key as a Uint8Array
 * @property macKey the MAC key as a Uint8Array
 * @property b64key the key as a base64 string
 * @property b64encKey the encryption key as a base64 string
 * @property b64macKey the MAC key as a base64 string
 * @property meta the meta data
 */
export class SymmetricCryptoKey {
	key: Uint8Array;
	encKey: Uint8Array;
	macKey?: Uint8Array;

	b64key: string;
	b64encKey: string;
	b64macKey: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	meta: any;

	/**
	 * @description create a SymmetricCryptoKey
	 * @param key random bytes to use as a key
	 * @param authenticated if true, the key will be split in two parts: the first 16 bytes will be used as encryption key, the last 16 bytes will be used as MAC key
	 */
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

	/**
	 * @description create a SymmetricCryptoKey from a base64 string
	 * @returns the key as a JSON object
	 */
	toJSON() {
		return { b64key: this.b64key };
	}
}

export type MasterKey = Opaque<SymmetricCryptoKey, "MasterKey">;
export type UserKey = Opaque<SymmetricCryptoKey, "UserKey">;
