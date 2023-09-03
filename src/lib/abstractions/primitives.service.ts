import { SymmetricCryptoKey } from "../models/symmetric-crypto-key";
import { DecryptParameters } from "../models/decrypt-parameters";
import { CsprngArray } from "../types/csprng";

export abstract class PrimitiveService {
	pbkdf2: (
		password: string | Uint8Array,
		salt: string | Uint8Array,
		iterations: number,
	) => Promise<Uint8Array>;
	hkdf: (
		ikm: Uint8Array,
		salt: string,
		info: string,
		outputByteSize: number,
	) => Promise<Uint8Array>;
	hkdfExpand: (
		prk: Uint8Array,
		info: string,
		outputByteSize: number,
	) => Promise<Uint8Array>;
	hash: (value: string) => Promise<Uint8Array>;
	compare: (a: string, b: string) => Promise<boolean>;
	hmac: (value: Uint8Array, key: Uint8Array) => Promise<Uint8Array>;
	compareBytes: (a: Uint8Array, b: Uint8Array) => Promise<boolean>;
	hmacUtf8: (value: string, key: string) => Promise<string>;
	aesEncrypt: (
		data: Uint8Array,
		iv: Uint8Array,
		key: Uint8Array,
	) => Promise<Uint8Array>;
	aesDecrypt: (parameters: DecryptParameters<string>) => Promise<string>;
	aesDecryptToBytes: (
		data: Uint8Array,
		iv: Uint8Array,
		key: Uint8Array,
	) => Promise<Uint8Array>;
	aesDecryptParameters: (
		data: string,
		iv: string,
		mac: string,
		key: SymmetricCryptoKey,
	) => DecryptParameters<string>;
	randomBytes: (length: number) => Promise<CsprngArray>;
}
