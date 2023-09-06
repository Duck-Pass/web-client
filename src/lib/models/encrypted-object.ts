import { SymmetricCryptoKey } from "./symmetric-crypto-key";

/**
 * @description this class describe the interface of an Encrypted Object.
 * @property iv the initialization vector used for encryption
 * @property data the encrypted data
 * @property mac the MAC
 * @property key the key used for encryption
 */
export class EncryptedObject {
	iv: Uint8Array;
	data: Uint8Array;
	mac: Uint8Array;
	key: SymmetricCryptoKey;
}
