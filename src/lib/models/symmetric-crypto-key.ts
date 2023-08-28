import { Opaque } from 'type-fest';

// Encrypted Key using AES-256-CBC with HMAC-SHA256

export class SymmetricCryptoKey {
    key: Uint8Array;
    encKey: Uint8Array;
    macKey: Uint8Array;

    b64key: string;
    b64encKey: string;
    b64macKey: string;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;

    constructor(key: Uint8Array) {
        this.key = key;

        if (key.byteLength === 64) {
            this.encKey = key.slice(0, 32);
            this.macKey = key.slice(32, 64);   
        } else {
            throw new Error('Invalid key length');
        }

        this.b64key = Buffer.from(this.key).toString('base64');
        this.b64encKey = Buffer.from(this.encKey).toString('base64');
        this.b64macKey = Buffer.from(this.macKey).toString('base64');
    }

    toJSON() {
        return {b64key: this.b64key};
    }
} 


export type MasterKey = Opaque<SymmetricCryptoKey, 'MasterKey'>;