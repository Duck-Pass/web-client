/**
 * Decryption parameters
 * @template T the type of the parameters
 * @property encKey the encryption key
 * @property data the data to decrypt
 * @property iv the initialization vector
 * @property macKey the MAC key
 * @property mac the MAC
 * @property macData the MAC data
 */
export class DecryptParameters<T> {
	encKey: T;
	data: T;
	iv: T;
	macKey: T;
	mac: T;
	macData: T;
}
