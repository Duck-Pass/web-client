import { BufferUtils } from "../BufferUtils";
import { Jsonify, Opaque } from "type-fest";
import { SymmetricCryptoKey } from "./symmetric-crypto-key";
import { EncryptionService } from "../abstractions/encryption.service";

/**
 * @description this class describe an Encrypted String.
 * An encrypted string if formed as follow: iv|data|mac or iv|data
 * @property encryptedString the encrypted string as an EncString
 * @property data the encrypted data
 * @property iv the initialization vector used for encryption
 * @property mac the MAC
 * @property decryptedValue the decrypted value as a string
 */
export class EncryptedString {
	encryptedString: EncString;
	data: string;
	iv: string;
	mac: string;
	decryptedValue?: string;

	/**
	 * @description create an EncryptedString
	 * @param data data to encrypt or an encrypted string (copy constructor)
	 * @param iv the initialization vector used for encryption
	 * @param mac the MAC
	 * @throws if the encrypted string is invalid
	 */
	constructor(data: string | EncString, iv?: string, mac?: string) {
		if (data && !iv && !mac) {
			this.encryptedString = data as EncString;
			const { authenticated, encPieces } =
				EncryptedString.parseEncryptedString(this.encryptedString);
			this.iv = encPieces[0];
			this.data = encPieces[1];
			if (authenticated) {
				this.mac = encPieces[2];
			}
		} else {
			this.encryptedString = (iv + "|" + data) as EncString;

			if (!iv) {
				throw new Error("Invalid encrypted string.");
			}

			this.data = data;
			this.iv = iv;

			if (mac) {
				this.encryptedString = (this.encryptedString +
					"|" +
					mac) as EncString;
				this.mac = mac;
			}
		}
	}

	/**
	 * @description get the iv as a Uint8Array
	 * @returns the iv as a Uint8Array
	 */
	get ivBytes(): Uint8Array {
		return BufferUtils.fromBase64ToByteArray(this.iv);
	}

	/**
	 * @description get the mac as a Uint8Array
	 * @returns the mac as a Uint8Array
	 */
	get macBytes(): Uint8Array | null {
		if (!this.mac) {
			return null;
		}
		return BufferUtils.fromBase64ToByteArray(this.mac);
	}
	/**
	 * @description get the data as a Uint8Array
	 * @returns the data as a Uint8Array
	 */
	get dataBytes(): Uint8Array {
		return BufferUtils.fromBase64ToByteArray(this.data);
	}
	/**
	 * @description get the encrypted string as a string
	 * @returns the encrypted string as a string
	 */
	toJSON() {
		return this.encryptedString;
	}

	/**
	 * @description parse a json object to an EncryptedString
	 * @param obj json object to parse
	 * @returns an EncryptedString or null if the object is null
	 */
	static fromJSON(obj: Jsonify<EncryptedString>): EncryptedString | null {
		if (obj == null) {
			return null;
		}
		return new EncryptedString(obj);
	}

	/**
	 * @description parse an encrypted string to an object containing the authenticated flag and the encrypted string pieces
	 * @param s string to parse
	 * @returns an object containing the authenticated flag and the encrypted string pieces
	 */
	static parseEncryptedString(s: EncString): {
		authenticated: boolean;
		encPieces: string[];
	} {
		let authenticated: boolean;
		const encPieces = s.split("|");
		if (encPieces.length === 2) {
			authenticated = false;
		} else if (encPieces.length === 3) {
			authenticated = true;
		} else {
			throw new Error("Invalid encrypted string.");
		}
		return {
			authenticated,
			encPieces,
		};
	}

	/**
	 * @description Decrypt the encrypted string
	 * @param key key to use for decryption
	 * @param svc encryption service to use for decryption
	 * @returns the decrypted value as a string
	 */
	async decrypt(
		key: SymmetricCryptoKey,
		svc: EncryptionService,
	): Promise<string> {
		if (this.decryptedValue) {
			return this.decryptedValue;
		}
		this.decryptedValue = await svc.decrypt(this, key);
		return this.decryptedValue;
	}
}

export type EncString = Opaque<string, "EncryptedString">;
