import { BufferUtils } from "../BufferUtils"
import { Opaque } from "type-fest";

export class EncryptedString {
    encryptedString: EncString
    data: string
    iv: string
    mac: string
    decryptedValue?: string

    constructor(
        data: string,
        iv: string,
        mac?: string,
    ) {
        // AES-256-CBC with HMAC-SHA256 if MAC is present, AES-256-CBC otherwise
        this.encryptedString = (iv + "|" + data) as EncString
        this.data = data
        this.iv = iv
        
        if (mac) {
            this.encryptedString = (this.encryptedString + "|" + mac) as EncString
            this.mac = mac
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
}

export type EncString = Opaque<string, 'EncryptedString'>;