import { EncryptionService } from "../abstractions/encryption.service";
import { EncryptedString } from "../models/encrypted-string";
import { SymmetricCryptoKey } from "../models/symmetric-crypto-key";
import { PrimitiveService } from "../abstractions/primitives.service";
import { EncryptedObject } from "../models/encrypted-object";
import { BufferUtils } from "../BufferUtils"


export class WebCryptoEncryptionService implements EncryptionService {
    constructor(protected primitiveService: PrimitiveService) {}

    async encrypt(plain: string | Uint8Array, key: SymmetricCryptoKey): Promise<EncryptedString> {
        if (key == null) {
            throw new Error("Key is null.");
        }

        if (plain == null) {
            throw new Error("Plain is null.");
        }

        let buffer: Uint8Array;
        if (typeof plain === "string") {
            buffer = new TextEncoder().encode(plain);
        } else {
            buffer = plain;
        }

        const encObj = await this.aesEncrypt(buffer, key);
        const iv = BufferUtils.fromBufferToBase64(encObj.iv);
        const data = BufferUtils.fromBufferToBase64(encObj.data);
        let mac = null;
        if (encObj.mac != null) {
            mac = encObj.mac.length > 0 ? BufferUtils.fromBufferToBase64(encObj.mac) : null;
        }

        if (mac != null) {
            return new EncryptedString(data, iv, mac)
        }

        return new EncryptedString(data, iv);

    }
    async decrypt(encrypted: EncryptedString, key: SymmetricCryptoKey): Promise<string> {
        if (key == null) {
            throw new Error("Key is null.");
        }

        if (key.macKey != null && encrypted.mac == null) {
            throw new Error("MAC is null.");
        }

        const params = this.primitiveService.aesDecryptParameters(encrypted.data, encrypted.iv, encrypted.mac, key);

        if (params.macKey != null && params.mac != null) {
            const computedMacs = await this.primitiveService.hmacUtf8(params.macData, params.macKey);
            const macsEqual = await this.primitiveService.compare(params.mac, computedMacs);
            if (!macsEqual) {
                throw new Error("MACs are not equal.");
            }

        }

        return await this.primitiveService.aesDecrypt(params);
    }

    private async aesEncrypt(data: Uint8Array, key: SymmetricCryptoKey): Promise<EncryptedObject> {
        const obj = new EncryptedObject();

        obj.key = key;
        obj.iv = await this.primitiveService.randomBytes(16);
        obj.data = await this.primitiveService.aesEncrypt(data, obj.iv, obj.key.encKey);

        if (obj.key.macKey != null) {
            const macData = new Uint8Array(obj.iv.byteLength + obj.data.byteLength);
            macData.set(new Uint8Array(obj.iv), 0);
            macData.set(new Uint8Array(obj.data), obj.iv.byteLength);
            obj.mac = await this.primitiveService.hmac(macData, obj.key.macKey);
        }

        return obj;
    }
    
}