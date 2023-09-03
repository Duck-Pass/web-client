import { makeByteArray } from "../../lib/TestsUtils";
import { SymmetricCryptoKey } from "../../lib/models/symmetric-crypto-key";

/**
 * @jest-environment jsdom
 */
describe("SymmetricCryptoKey", () => {
	describe("guess encrypted key from key length", () => {
		it("should be AesCbc256", () => {
			const key = makeByteArray(32);
			const cryptoKey = new SymmetricCryptoKey(key);
			expect(cryptoKey).toEqual({
				encKey: key,
				b64encKey: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=",
				key: key,
				b64key: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=",
				macKey: undefined,
			});
		});
		it("should be AesCbc256HmacSha256", () => {
			const key = makeByteArray(32);
			const cryptoKey = new SymmetricCryptoKey(key, true);
			expect(cryptoKey).toEqual({
				encKey: key.slice(0, 16),
				b64encKey: "AAECAwQFBgcICQoLDA0ODw==",
				key: key,
				b64key: "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=",
				macKey: key.slice(16, 32),
				b64macKey: "EBESExQVFhcYGRobHB0eHw==",
			});
		});

		it("shoud throw an error with unknown length when given an invalid key", () => {
			const key = makeByteArray(31);
			expect(() => new SymmetricCryptoKey(key)).toThrowError(
				"Invalid key length.",
			);
		});
	});
});
