/**
 * Vault model
 */

import { BufferUtils } from "../BufferUtils";
import { WebCryptoEncryptionService } from "../services/webcrypto-encryption.service";
import { WebCryptoPrimitivesService } from "../services/webcrypto-primitives.service";
import { SymmetricCryptoKey, UserKey } from "./symmetric-crypto-key";
import { v4 as uuid } from "uuid";
import env from "../../env.json";
import { EncryptedString } from "./encrypted-string";

/**
 * @description Credential model
 * @property id id of the credential
 * @property name name of the credential
 * @property username username of the credential
 * @property password password of the credential
 * @property authKey auth key of the credential
 * @property note note of the credential
 * @property website website of the credential
 * @property favorite favorite status of the credential
 */
export type Credential = {
	id: string;
	name: string;
	username: string;
	password: string;
	authKey: string;
	note: string;
	website: string;
	favorite: boolean;
	breached: boolean;
};

/**
 * @description Vault model
 */
export type Vault = Credential[];

/**
 * @description Singleton class to manage the vault
 * @property vault the vault
 * @property instance the instance of the vault
 * @property key the key used to encrypt the vault
 */
export class VaultManager {
	private static vault: Vault;
	private static instance: VaultManager | null;
	private static key: UserKey | null;
	private constructor() {}
	/**
	 * @description check if the instance exists
	 * @returns true if the instance exists
	 */
	public static instanceExists(): boolean {
		return VaultManager.instance !== null;
	}
	/**
	 * @description destroy the instance
	 * @returns void
	 */
	public static destroyInstance() {
		VaultManager.instance = null;
	}
	/**
	 * @description get the instance of the vault
	 * @returns the instance of the vault
	 */
	public static getInstance(): VaultManager {
		if (!VaultManager.instance) {
			VaultManager.instance = new VaultManager();

			const vaultJson = localStorage.getItem("vault");
			const userProfile = JSON.parse(
				localStorage.getItem("userProfile") ?? "{}",
			);
			const userKey = userProfile.symmetric_key?.b64key ?? "";
			if (userKey) {
				VaultManager.key = new SymmetricCryptoKey(
					BufferUtils.fromBase64ToByteArray(userKey),
				) as UserKey;
			}
			if (vaultJson) {
				const vault = JSON.parse(vaultJson);
				VaultManager.vault = vault;
			} else {
				VaultManager.vault = [];
				localStorage.setItem(
					"vault",
					JSON.stringify(VaultManager.vault),
				);
			}
		}
		return VaultManager.instance;
	}
	/**
	 * @description reset the vault and the instance
	 * @returns void
	 */
	public static async reset() {
		VaultManager.vault = [];
		VaultManager.key = null;
		VaultManager.instance = null;
		localStorage.removeItem("vault");
	}
	/**
	 * @description Lock the vault
	 * @returns void
	 */
	public async lock() {
		const jsonVault = JSON.stringify(VaultManager.vault);
		if (jsonVault && VaultManager.key) {
			const primitives = new WebCryptoPrimitivesService(window);
			const encryptionService = new WebCryptoEncryptionService(
				primitives,
			);
			const encryptedVault = await encryptionService.encrypt(
				jsonVault,
				VaultManager.key,
			);
			localStorage.setItem("vault", encryptedVault.toJSON());
			VaultManager.vault = [];
		}
	}
	/**
	 * @description Get the vault
	 * @returns the vault
	 */
	public getVault(): Vault {
		return VaultManager.vault;
	}
	/**
	 * @description Edit an item in the vault
	 * @param item item edited
	 */
	public async editItem(item: Credential) {
		VaultManager.vault = VaultManager.vault.map(i => {
			if (i.id === item.id) {
				return item;
			}
			return i;
		});
		this.sync();
	}
	/**
	 * @description Add an item to the vault
	 * @param item item added
	 */
	public async addItem(item: Credential) {
		item.id = uuid();
		VaultManager.vault.push(item);
		await this.sync();
	}
	/**
	 * @description Remove an item from the vault
	 * @param id id of the item to remove
	 */
	public async removeItem(id: string) {
		VaultManager.vault = VaultManager.vault.filter(i => i.id !== id);
		await this.sync();
	}
	/**
	 * @description Sync the vault with the server
	 * @returns void
	 */
	public async sync() {
		const jsonVault = JSON.stringify(VaultManager.vault);
		if (jsonVault && VaultManager.key) {
			const primitives = new WebCryptoPrimitivesService(window);
			const encryptionService = new WebCryptoEncryptionService(
				primitives,
			);
			const encryptedVault = await encryptionService.encrypt(
				jsonVault,
				VaultManager.key,
			);
			await fetch(env.api + "/update_vault", {
				method: "PUT",
				body: JSON.stringify({
					vault: encryptedVault.toJSON(),
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			});
			localStorage.setItem("vault", jsonVault);
		}
	}
	/**
	 * @description Encrypt the vault
	 * @param userKey User key to encrypt the vault
	 * @returns encrypted vault
	 */
	public async encrypt(userKey: UserKey): Promise<EncryptedString | null> {
		const jsonVault = JSON.stringify(VaultManager.vault);
		if (jsonVault && VaultManager.key) {
			const primitives = new WebCryptoPrimitivesService(window);
			const encryptionService = new WebCryptoEncryptionService(
				primitives,
			);
			const encryptedVault = await encryptionService.encrypt(
				jsonVault,
				userKey,
			);
			return encryptedVault;
		}
		return null;
	}
	/**
	 * @description Decrypt the vault
	 * @param timeout time before locking the vault
	 */
	public scheduleLock(timeout: number) {
		setTimeout(() => {
			this.lock();
		}, timeout);
	}
}
