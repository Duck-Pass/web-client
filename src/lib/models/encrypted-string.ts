import { BufferUtils } from "../BufferUtils"
import { Jsonify, Opaque } from "type-fest";
import { SymmetricCryptoKey } from "./symmetric-crypto-key";
import { EncryptionService } from "../abstractions/encryption.service";

export class EncryptedString {
    encryptedString: EncString
    data: string
    iv: string
    mac: string
    decryptedValue?: string

    constructor(
        data: string | EncString,
        iv?: string,
        mac?: string,
    ) {
        if (data && !iv && !mac) {
            this.encryptedString = data as EncString
            const {authenticated, encPieces} = EncryptedString.parseEncryptedString(this.encryptedString)
            this.iv = encPieces[0]
            this.data = encPieces[1]
            if (authenticated) {
                this.mac = encPieces[2]
            }
        } else {
            this.encryptedString = (iv + "|" + data) as EncString
            
            if (!iv) {
                throw new Error("Invalid encrypted string.")
            }
            
            this.data = data
            this.iv = iv
            
            if (mac) {
                this.encryptedString = (this.encryptedString + "|" + mac) as EncString
                this.mac = mac
            }
        }
    }

    get ivBytes(): Uint8Array {
        return BufferUtils.fromBase64ToByteArray(this.iv)
    }

    get macBytes(): Uint8Array | null {
        if (!this.mac) {
            return null
        }
        return BufferUtils.fromBase64ToByteArray(this.mac)
    }

    get dataBytes(): Uint8Array {
        return BufferUtils.fromBase64ToByteArray(this.data)
    }

    toJSON() {
        return this.encryptedString
    }

    static fromJSON(obj: Jsonify<EncryptedString>): EncryptedString | null {
        if (obj == null) {
            return null
        }
        return new EncryptedString(obj)
    }

    static parseEncryptedString(s: EncString): {authenticated: boolean, encPieces: string[]} {
        let authenticated: boolean;
        const encPieces = s.split("|")
        if (encPieces.length === 2) {
            authenticated = false
        } else if (encPieces.length === 3) {
            authenticated = true
        } else {
            throw new Error("Invalid encrypted string.")
        }
        return {
            authenticated,
            encPieces
        }
    }

    async decrypt(key: SymmetricCryptoKey, svc: EncryptionService): Promise<string> {
        if (this.decryptedValue) {
            return this.decryptedValue
        }
        this.decryptedValue = await svc.decrypt(this, key)
        return this.decryptedValue
    }
}

export type EncString = Opaque<string, 'EncryptedString'>;