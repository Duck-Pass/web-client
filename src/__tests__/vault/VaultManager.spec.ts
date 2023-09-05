import { VaultManager } from "../../lib/models/vault";
import { spyOn } from "jest-mock";
import * as uuid from "uuid";
jest.mock("uuid");

describe("VaultManager", () => {
	const exampleVaultJson = `[{"id":"00000000-0000-0000-0000-000000000000","name":"name","username":"username","password":"password","website":"https://www.duckpass.ch","authKey":"authKey","note":"note","favorite":false,"breached":false}]`;

	const exampleVaultCredential = {
		id: "00000000-0000-0000-0000-000000000000",
		name: "name",
		username: "username",
		password: "password",
		website: "https://www.duckpass.ch",
		authKey: "authKey",
		note: "note",
		favorite: false,
		breached: false,
	};

	describe("constructor", () => {
		const getItem = spyOn(Storage.prototype, "getItem");

		beforeEach(() => {
			getItem.mockClear();
			VaultManager.reset();
		});

		it("should be a singleton", () => {
			getItem.mockReturnValueOnce(null);
			getItem.mockReturnValueOnce("{}");
			const vaultManager1 = VaultManager.getInstance();
			const vaultManager2 = VaultManager.getInstance();
			expect(vaultManager1).toBe(vaultManager2);
		});

		it("should initialize an empty vault if none is found", () => {
			getItem.mockReturnValueOnce(null);
			getItem.mockReturnValueOnce("{}");
			const manager = VaultManager.getInstance();
			expect(manager.getVault()).toEqual([]);
		});

		it("should initialize a vault if one is found", () => {
			getItem.mockReturnValueOnce(exampleVaultJson);
			getItem.mockReturnValueOnce("{}");
			const manager = VaultManager.getInstance();
			expect(manager.getVault()).toEqual([exampleVaultCredential]);
		});
	});

	describe("Vault Management", () => {
		const getItem = spyOn(Storage.prototype, "getItem");
		jest.spyOn(uuid, "v4").mockImplementation(
			() => "00000000-0000-0000-0000-000000000000",
		);
		beforeEach(() => {
			getItem.mockClear();
			VaultManager.reset();
		});

		it("should add a credential to the vault", () => {
			getItem.mockReturnValueOnce(null);
			getItem.mockReturnValueOnce("{}");
			const manager = VaultManager.getInstance();
			manager.addItem(exampleVaultCredential);
			expect(manager.getVault()).toEqual([exampleVaultCredential]);
		});

		it("should remove a credential from the vault", () => {
			getItem.mockReturnValueOnce(exampleVaultJson);
			getItem.mockReturnValueOnce("{}");
			const manager = VaultManager.getInstance();
			manager.removeItem(exampleVaultCredential.id);
			expect(manager.getVault()).toEqual([]);
		});

		it("should update a credential in the vault", () => {
			getItem.mockReturnValueOnce(exampleVaultJson);
			getItem.mockReturnValueOnce("{}");
			const manager = VaultManager.getInstance();
			const updatedCredential = {
				...exampleVaultCredential,
				name: "new name",
			};
			manager.editItem(updatedCredential);
			expect(manager.getVault()).toEqual([updatedCredential]);
		});

		it("should get all credentials from the vault", () => {
			getItem.mockReturnValueOnce(exampleVaultJson);
			getItem.mockReturnValueOnce("{}");
			const manager = VaultManager.getInstance();
			expect(manager.getVault()).toEqual([exampleVaultCredential]);
		});
	});
});
