import { WebCryptoEncryptionService } from "../../lib/services/webcrypto-encryption.service";
import { PrimitiveService } from "../../lib/abstractions/primitives.service";
import { EncryptionService } from "../../lib/abstractions/encryption.service";
import { makeByteArray } from "../../lib/TestsUtils";
import { SymmetricCryptoKey } from "@/lib/models/symmetric-crypto-key";
import { mock, mockReset } from "jest-mock-extended";
import { CsprngArray } from "@/lib/types/csprng";

describe("EncryptionService", () => {
    const primitivesService = mock<PrimitiveService>();
    let encryptionService: EncryptionService;

    beforeEach(() => {
        mockReset(primitivesService);
        encryptionService = new WebCryptoEncryptionService(primitivesService)
    });

    describe("encrypts to bytes", () => {
        const plaintext = makeByteArray(16);
        const iv = makeByteArray(16, 30);
        const mac = makeByteArray(32, 40);
        const encryptedData = makeByteArray(20, 50);
        describe("encrypts data", () => {
            beforeEach(() => {
                primitivesService.randomBytes.calledWith(16).mockResolvedValue(iv as CsprngArray);
                primitivesService.aesEncrypt.mockResolvedValue(encryptedData);
            })

            it("with mac", async () => {
                const key = mock<SymmetricCryptoKey>();
                key.macKey = makeByteArray(16, 20);

                primitivesService.hmac.mockResolvedValue(mac);

                const actual = await encryptionService.encrypt(plaintext, key);

                expect(actual.ivBytes).toEqual(iv)
                expect(actual.macBytes).toEqual(mac)
                expect(actual.dataBytes).toEqual(encryptedData)
            });

            it("without mac", async () => {
                const key = mock<SymmetricCryptoKey>();
                key.macKey = undefined;

                const actual = await encryptionService.encrypt(plaintext, key);

                expect(actual.ivBytes).toEqual(iv)
                expect(actual.macBytes).toBeNull()
                expect(actual.dataBytes).toEqual(encryptedData)
            });
        });
    })
});