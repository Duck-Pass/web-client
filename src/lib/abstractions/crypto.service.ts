import { UserKey, MasterKey } from "../models/symmetric-crypto-key";
import { EncryptedString } from "../models/encrypted-string";

/**
 * @description this class describe the interface of the crypto service.
 * Used to abstract the crypto service from the rest of the application. (which could be different from a browser environment to a node environment)
 */
export abstract class CryptoService {
	/**
	 * @description Create the Master Key using PBKDF2-SHA256
	 * @param password the password to use for key derivation
	 * @param email the email to use for key derivation
	 */
	makeMasterKey: (password: string, email: string) => Promise<MasterKey>;
	/**
	 * @description Hash the Master Key using PBKDF2-SHA256
	 * @param password the password to use for key derivation
	 * @param key the key to hash
	 * @param iterations the number of iterations to use for key derivation
	 */
	hashMasterKey: (
		password: string,
		key: MasterKey,
		iterations: number,
	) => Promise<string>;
	/**
	 * @description Create a new User Key
	 * @param masterKey the master key to use for key derivation
	 * @returns the new User Key and the encrypted User Key
	 */
	makeUserKey: (masterKey: MasterKey) => Promise<[UserKey, EncryptedString]>;
	/**
	 * @description Decrypt a User Key
	 * @param masterKey the master key to use for key derivation
	 * @param userKey the encrypted User Key to decrypt
	 */
	decryptUserKey: (
		masterKey: MasterKey,
		userKey: EncryptedString,
	) => Promise<UserKey>;
	/**
	 * @description Create a new Protected Symmetric Key
	 * @param masterKey the master key to use for key derivation
	 * @param key the key to protect
	 */
	makeProtectedSymmetricKey: (
		masterKey: MasterKey,
		key: Uint8Array,
	) => Promise<[UserKey, EncryptedString]>;
}
