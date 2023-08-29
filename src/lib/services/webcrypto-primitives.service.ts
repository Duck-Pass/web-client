import * as forge from "node-forge";
import { PrimitiveService } from "../abstractions/primitives.service";
import { DecryptParameters } from "../models/decrypt-parameters";
import { SymmetricCryptoKey } from "../models/symmetric-crypto-key";
import { CsprngArray } from "../types/csprng";


export class WebCryptoPrimitivesService implements PrimitiveService {
    private subtle: SubtleCrypto;
    private crypto: Crypto;

    constructor(win: Window | typeof global) {
            this.subtle = win.crypto.subtle;
            this.crypto = win.crypto;
    }

    async pbkdf2(
        password: string | Uint8Array,
        salt: string | Uint8Array,
        iterations: number,
    ): Promise<Uint8Array> {
        const passwordBuf = typeof password === 'string' ? new TextEncoder().encode(password) : password;
        const saltBuf = typeof salt === 'string' ? new TextEncoder().encode(salt) : salt;

        const params = {
            name: 'PBKDF2',
            salt: saltBuf,
            iterations: iterations,
            hash: 'SHA-256',
        }

        const impKey = await this.subtle.importKey('raw', passwordBuf, {name: "PBKDF2"}, false, ['deriveBits']);
        const buffer = await this.subtle.deriveBits(params, impKey, 256);

        return new Uint8Array(buffer);
    }

    async hkdf(ikm: Uint8Array, salt: string, info: string, outputByteSize: number) : Promise<Uint8Array> {
        const saltArray = new TextEncoder().encode(salt);
        const infoArray = new TextEncoder().encode(info);
        const hdkfParams: HkdfParams = {
            name: "HKDF",
            hash: "SHA-256",
            salt: saltArray,
            info: infoArray,
        }
        const impKey = await this.subtle.importKey("raw", ikm, {name: 'HKDF'}, false, ['deriveBits']);
        const buffer = await this.subtle.deriveBits(hdkfParams, impKey, outputByteSize * 8);
        return new Uint8Array(buffer);
    }

    async hkdfExpand(prk: Uint8Array, info: string, outputByteSize: number) : Promise<Uint8Array> {
        const hashLen = 32;
        if (outputByteSize > 255 * hashLen) {
          throw new Error("outputByteSize is too large.");
        }
        const prkArr = new Uint8Array(prk);
        if (prkArr.length < hashLen) {
          throw new Error("prk is too small.");
        }
        const infoBuf = new TextEncoder().encode(info);
        const infoArr = new Uint8Array(infoBuf);
        let runningOkmLength = 0;
        let previousT = new Uint8Array(0);
        const n = Math.ceil(outputByteSize / hashLen);
        const okm = new Uint8Array(n * hashLen);
        for (let i = 0; i < n; i++) {
          const t = new Uint8Array(previousT.length + infoArr.length + 1);
          t.set(previousT);
          t.set(infoArr, previousT.length);
          t.set([i + 1], t.length - 1);
          previousT = new Uint8Array(await this.hmac(t, prk));
          okm.set(previousT, runningOkmLength);
          runningOkmLength += previousT.length;
          if (runningOkmLength >= outputByteSize) {
            break;
          }
        }
        return okm.slice(0, outputByteSize);
    }

    async hash(value: string | Uint8Array) : Promise<Uint8Array> {
        const valueBuf = typeof value === 'string' ? new TextEncoder().encode(value) : value;
        const buffer = await this.subtle.digest('SHA-256', valueBuf);
        return new Uint8Array(buffer);
    }
    async compareBytes(a: Uint8Array, b: Uint8Array) : Promise<boolean> {
        const macKey = await this.randomBytes(32);
        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const impKey = await this.subtle.importKey('raw', macKey, algorithm, false, ['sign']);
        const mac1 = await this.subtle.sign(algorithm, impKey, a);
        const mac2 = await this.subtle.sign(algorithm, impKey, b);
        if (mac1.byteLength !== mac2.byteLength) {
            return false;
        }
        const arr1 = new Uint8Array(mac1);
        const arr2 = new Uint8Array(mac2);
        for (let i = 0; i < arr2.length; i++) {
            if (arr1[i] !== arr2[i]) {
            return false;
            }
        }
        return true;
    }

    async compare(a: string, b: string) : Promise<boolean> {
        const rand = await this.randomBytes(32);
        const bytes = new Uint32Array(rand);
        const buffer = forge.util.createBuffer();

        for (let i = 0; i < bytes.length; i++) {
          buffer.putInt32(bytes[i]);
        }
        
        const macKey = buffer.getBytes();
    
        const hmac = forge.hmac.create();
        hmac.start("sha256", macKey);
        hmac.update(a);
        const mac1 = hmac.digest().getBytes();
    
        hmac.start("sha256", null);
        hmac.update(b);
        const mac2 = hmac.digest().getBytes();
    
        const equals = mac1 === mac2;
        return equals;
    }
    
    async hmac(value: Uint8Array, key: Uint8Array) : Promise<Uint8Array> {
        const algorithm = {
            name: 'HMAC',
            hash: 'SHA-256',
        }
        const impKey = await this.subtle.importKey('raw', key, algorithm, false, ['sign']);
        const buffer = await this.subtle.sign(algorithm, impKey, value);
        return new Uint8Array(buffer);
    }

    hmacUtf8(value: string, key: string) : Promise<string> {
        const hmac = forge.hmac.create();
        hmac.start('sha256', key);
        hmac.update(value);
        const bytes = hmac.digest().getBytes();
        return Promise.resolve(bytes);
    }

    async aesEncrypt(data: Uint8Array, iv: Uint8Array, key: Uint8Array) : Promise<Uint8Array> {
        const impKey = await this.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']);
        const buffer = await this.subtle.encrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
        return new Uint8Array(buffer);
    }

    async aesDecryptToBytes(data: Uint8Array, iv: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
        const impKey = await this.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
        const buffer = await this.subtle.decrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
        return new Uint8Array(buffer);
    }

    aesDecrypt(parameters: DecryptParameters<string>) {
        const dataBuffer = forge.util.createBuffer(parameters.data);
        const decipher = forge.cipher.createDecipher('AES-CBC', parameters.encKey);
        decipher.start({ iv: parameters.iv });
        decipher.update(dataBuffer);
        decipher.finish();
        const result = decipher.output.toString();
        return Promise.resolve(result);
    }

    aesDecryptParameters(data: string, iv: string, mac: string, key: SymmetricCryptoKey): DecryptParameters<string> {
        const p = new DecryptParameters<string>();
        if (key.meta != null) {
            p.encKey = key.meta.encKeyByteString;
            p.macKey = key.meta.macKeyByteString;
        }

        if (p.encKey == null) {
            p.encKey = forge.util.decode64(key.b64encKey)
        }
        p.data = forge.util.decode64(data);
        p.iv = forge.util.decode64(iv);
        p.macData = p.iv + p.data;
        if (p.macKey == null && key.b64macKey != null) {
            p.macKey = forge.util.decode64(key.b64macKey);
        }

        if (p.macKey == null) {
            p.mac = forge.util.decode64(mac);
        }

        if (key.meta == null) {
            key.meta = {};
        }

        if (key.meta.encKeyByteString == null) {
            key.meta.encKeyByteString = p.encKey;
        }

        if (p.macKey != null && key.meta.macKeyByteString == null) {
            key.meta.macKeyByteString = p.macKey;
        }

        return p;
    }

    randomBytes(length: number): Promise<CsprngArray> {
        const arr = new Uint8Array(length);
        this.crypto.getRandomValues(arr);
        return Promise.resolve(arr as CsprngArray);
    }

}