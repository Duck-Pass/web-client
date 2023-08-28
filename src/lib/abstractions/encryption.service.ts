import { SymmetricCryptoKey } from "../models/symmetric-crypto-key";
import { EncryptedString } from "../models/encrypted-string";

export abstract class EncryptionService {
    abstract encrypt(plain: string | Uint8Array, key: SymmetricCryptoKey): Promise<EncryptedString>;
    abstract decrypt(encrypted: EncryptedString, key: SymmetricCryptoKey): Promise<string>;
}