import { SymmetricCryptoKey } from "../models/symmetric-crypto-key";
import { DecryptParameters } from "../models/decrypt-parameters";
import { CsprngArray } from "../types/csprng";

/**
 * @description this class describe the interface of the primitive service.
 * Used to abstract the cryptographic primitive service from the rest of the application. (which could be different from a browser environment to a node environment)
 */
export abstract class PrimitiveService {
	/**
	 * @description this function is used to derive a key from a password and a salt using the PBKDF2 algorithm
	 * @param password the password to use for key derivation
	 * @param salt the salt to use for key derivation
	 * @param iterations the number of iterations to use for key derivation
	 * @returns the derived key
	 */
	pbkdf2: (
		password: string | Uint8Array,
		salt: string | Uint8Array,
		iterations: number,
	) => Promise<Uint8Array>;
	/**
	 * @description this function is used to derive a key from a password and a salt using the HKDF algorithm
	 * @param ikm the input keying material to use for key derivation
	 * @param salt the salt to use for key derivation
	 * @param info the info to use for key derivation
	 * @param outputByteSize the size of the output key
	 * @returns the derived key
	 */
	hkdf: (
		ikm: Uint8Array,
		salt: string,
		info: string,
		outputByteSize: number,
	) => Promise<Uint8Array>;
	/**
	 * @description Expand a key using the HKDF algorithm
	 * @param prk the pseudo-random key to use for key derivation
	 * @param info the info to use for key derivation
	 * @param outputByteSize the size of the output key
	 * @returns the derived key
	 */
	hkdfExpand: (
		prk: Uint8Array,
		info: string,
		outputByteSize: number,
	) => Promise<Uint8Array>;
	/**
	 * @description Generate a random salt using SHA-256
	 * @param length the length of the salt to generate
	 * @returns the generated salt
	 */
	hash: (value: string) => Promise<Uint8Array>;
	/**
	 * @description Compare two MACs
	 * @param a the first MAC
	 * @param b the second MAC
	 * @returns true if the MACs are equal, false otherwise
	 */
	compare: (a: string, b: string) => Promise<boolean>;
	/**
	 * @description Generate a HMAC using SHA-256
	 * @param value the value to generate the HMAC from
	 * @param key the key to use for HMAC generation
	 */
	hmac: (value: Uint8Array, key: Uint8Array) => Promise<Uint8Array>;
	/**
	 * @description Compare two MACs as byte arrays
	 * @param a the first MAC byte array
	 * @param b the second MAC byte array
	 * @returns true if the MACs are equal, false otherwise
	 */
	compareBytes: (a: Uint8Array, b: Uint8Array) => Promise<boolean>;
	/**
	 * @description Generate a HMAC using SHA-256 with parameters as strings
	 * @param value the value to generate the HMAC from
	 * @param key the key to use for HMAC generation
	 * @returns the generated HMAC
	 */
	hmacUtf8: (value: string, key: string) => Promise<string>;
	/**
	 * @description Encrypt a plaintext with a key using AES-256-CBC
	 * @param data the plaintext to encrypt
	 * @param iv the initialization vector to use for encryption
	 * @param key the key to use for encryption
	 * @returns the encrypted string as a byte array
	 */
	aesEncrypt: (
		data: Uint8Array,
		iv: Uint8Array,
		key: Uint8Array,
	) => Promise<Uint8Array>;
	/**
	 * @description Decrypt a ciphertext with a key using AES-256-CBC
	 * @param parameters the parameters to use for decryption
	 * @returns the decrypted string
	 */
	aesDecrypt: (parameters: DecryptParameters<string>) => Promise<string>;
	/**
	 * @description Decrypt a ciphertext with a key using AES-256-CBC and return the result as a Uint8Array
	 * @param data the ciphertext to decrypt
	 * @param iv the initialization vector to use for decryption
	 * @param key the key to use for decryption
	 * @returns the decrypted string as a Uint8Array
	 */
	aesDecryptToBytes: (
		data: Uint8Array,
		iv: Uint8Array,
		key: Uint8Array,
	) => Promise<Uint8Array>;
	/**
	 * @description Create an object to use for decryption with AES-256-CBC
	 * @param data the ciphertext to decrypt
	 * @param iv the initialization vector to use for decryption
	 * @param mac the MAC to use for decryption
	 * @param key the key to use for decryption
	 * @returns the decrypt parameters
	 */
	aesDecryptParameters: (
		data: string,
		iv: string,
		mac: string,
		key: SymmetricCryptoKey,
	) => DecryptParameters<string>;
	/**
	 * @description Generate a random number of bytes using a CSPRNG
	 * @param length the length of the random bytes to generate
	 */
	randomBytes: (length: number) => Promise<CsprngArray>;
}
