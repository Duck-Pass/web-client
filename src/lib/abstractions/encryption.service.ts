import { SymmetricCryptoKey } from "../models/symmetric-crypto-key";
import { EncryptedString } from "../models/encrypted-string";

/**
 * @description this class describe the interface of the encryption service.
 * Used to abstract the encryption service from the rest of the application. (which could be different from a browser environment to a node environment)
 */
export abstract class EncryptionService {
	/**
	 * Encrypt a plaintext with a key using a symmetric encryption algorithm
	 * @param plain the plaintext to encrypt
	 * @param key the key to use for encryption
	 * @returns the encrypted string
	 */
	abstract encrypt(
		plain: string | Uint8Array,
		key: SymmetricCryptoKey,
	): Promise<EncryptedString>;
	/**
	 * Decrypt a ciphertext with a key using a symmetric encryption algorithm
	 * @param encrypted The encrypted string to decrypt
	 * @param key The key to use for decryption
	 * @returns the decrypted string
	 */
	abstract decrypt(
		encrypted: EncryptedString,
		key: SymmetricCryptoKey,
	): Promise<string>;
	/**
	 * Decrypt a ciphertext with a key using a symmetric encryption algorithm and return the result as a Uint8Array
	 * @param encrypted The encrypted string to decrypt
	 * @param key The key to use for decryption
	 * @returns the decrypted string as a Uint8Array
	 */
	abstract decryptToBytes(
		encrypted: EncryptedString,
		key: SymmetricCryptoKey,
	): Promise<Uint8Array | undefined>;
}
