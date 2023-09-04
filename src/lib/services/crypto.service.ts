import { CryptoService as CryptoServiceAbstract } from "../abstractions/crypto.service";
import { PrimitiveService } from "../abstractions/primitives.service";
import { EncryptionService } from "../abstractions/encryption.service";
import {
	UserKey,
	MasterKey,
	SymmetricCryptoKey,
} from "../models/symmetric-crypto-key";
import { EncryptedString } from "../models/encrypted-string";
import { BufferUtils } from "../BufferUtils";

export class CryptoService implements CryptoServiceAbstract {
	constructor(
		protected primitiveService: PrimitiveService,
		protected encryptionService: EncryptionService,
	) {}

	async makeMasterKey(password: string, email: string): Promise<MasterKey> {
		const iterations = 600_000;
		const key = await this.primitiveService.pbkdf2(
			password,
			email,
			iterations,
		);
		return new SymmetricCryptoKey(key) as MasterKey;
	}

	async hashMasterKey(
		password: string,
		key: MasterKey,
		iterations: number,
	): Promise<string> {
		const hash = await this.primitiveService.pbkdf2(
			key.key,
			password,
			iterations,
		);
		return BufferUtils.fromBufferToBase64(hash);
	}

	async makeUserKey(
		masterKey: MasterKey,
	): Promise<[UserKey, EncryptedString]> {
		const newUserKey = await this.primitiveService.randomBytes(64);
		return await this.makeProtectedSymmetricKey(masterKey, newUserKey);
	}

	async decryptUserKey(
		masterKey: MasterKey,
		userKey: EncryptedString,
	): Promise<UserKey> {
		const newKey = await this.stretchMasterKey(masterKey);
		const decUserKey =
			(await this.encryptionService.decryptToBytes(userKey, newKey)) ??
			new Uint8Array(0);

		if (decUserKey.length === 0) {
			throw new Error("Decrypted key is null");
		}

		return new SymmetricCryptoKey(decUserKey) as UserKey;
	}

	private async makeProtectedSymmetricKey<T extends SymmetricCryptoKey>(
		encKey: SymmetricCryptoKey,
		newSymkey: Uint8Array,
	): Promise<[T, EncryptedString]> {
		let psk: EncryptedString;

		if (encKey.key.byteLength === 32) {
			const stretchedEncryptionKey = await this.stretchMasterKey(encKey);
			psk = await this.encryptionService.encrypt(
				newSymkey,
				stretchedEncryptionKey,
			);
		} else if (encKey.key.byteLength === 64) {
			psk = await this.encryptionService.encrypt(newSymkey, encKey);
		} else {
			throw new Error("Invalid key size.");
		}
		return [new SymmetricCryptoKey(newSymkey) as T, psk];
	}

	private async stretchMasterKey(
		key: SymmetricCryptoKey,
	): Promise<SymmetricCryptoKey> {
		const newKey = new Uint8Array(64);
		const encKey = await this.primitiveService.hkdfExpand(
			key.key,
			"enc",
			32,
		);
		const macKey = await this.primitiveService.hkdfExpand(
			key.key,
			"mac",
			32,
		);
		newKey.set(encKey);
		newKey.set(macKey, 32);
		return new SymmetricCryptoKey(newKey);
	}
}
