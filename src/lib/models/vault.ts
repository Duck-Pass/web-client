export type Credential = {
    id: string,
    name: string
    username: string
    password: string
    authKey: string
    note: string
    favorite?: boolean
}

import { BufferUtils } from '../BufferUtils'
import { WebCryptoEncryptionService } from '../services/webcrypto-encryption.service'
import { WebCryptoPrimitivesService } from '../services/webcrypto-primitives.service'
import { SymmetricCryptoKey, UserKey } from './symmetric-crypto-key'
import { v4 as uuid } from 'uuid';

export type Vault = Credential[]

export class VaultManager {
    private static vault: Vault
    private static instance : VaultManager | null
    private static key: UserKey | null
    private constructor() {}

    public static instanceExists(): boolean {
        return VaultManager.instance !== null
    }

    public static destroyInstance() {
        VaultManager.instance = null
    }

    public static getInstance(): VaultManager {
        if (!VaultManager.instance) {
            VaultManager.instance = new VaultManager()

            const vaultJson = localStorage.getItem('vault')
            const userProfile = JSON.parse(localStorage.getItem('userProfile') ?? "{}");
            const userKey = userProfile.symmetric_key?.b64key ?? "";
            if (userKey) {
                VaultManager.key = new SymmetricCryptoKey(BufferUtils.fromBase64ToByteArray(userKey)) as UserKey;
            }
            if (vaultJson) {
                const vault = JSON.parse(vaultJson)
                VaultManager.vault = vault
            } else {
                VaultManager.vault = []
                localStorage.setItem('vault', JSON.stringify(VaultManager.vault))
            }
        }
        return VaultManager.instance
    }

    public static async reset() {
        VaultManager.vault = []
        VaultManager.key = null
        VaultManager.instance = null
        localStorage.removeItem('vault')
    }

    public async lock() {
        const jsonVault = JSON.stringify(VaultManager.vault)
        if (jsonVault && VaultManager.key) {
            const primitives = new WebCryptoPrimitivesService(window);
            const encryptionService = new WebCryptoEncryptionService(primitives);
            const encryptedVault = await encryptionService.encrypt(jsonVault, VaultManager.key);
            localStorage.setItem('vault', encryptedVault.toJSON());
            VaultManager.vault = []
        }
    }

    public getVault(): Vault {
        return VaultManager.vault
    }

    public async editItem(item: Credential) {
        VaultManager.vault = VaultManager.vault.map((i) => {
            if (i.id === item.id) {
                if (!i.favorite && !item.favorite) {
                    item.favorite = false
                }
                return item
            }
            return i
        });
        this.sync()
    }

    public async addItem(item: Credential) {
        item.id = uuid()
        VaultManager.vault.push(item)
        await this.sync()
    }

    public async removeItem(id: string) {
        VaultManager.vault = VaultManager.vault.filter((i) => i.id !== id)
        await this.sync()
    }

    public async sync() {
        const jsonVault = JSON.stringify(VaultManager.vault)
        if (jsonVault && VaultManager.key) {
            const primitives = new WebCryptoPrimitivesService(window);
            const encryptionService = new WebCryptoEncryptionService(primitives);
            const encryptedVault = await encryptionService.encrypt(jsonVault, VaultManager.key);
            await fetch('https://api-staging.duckpass.ch/update_vault', {
                method: 'PUT',
                body: JSON.stringify({
                    vault: encryptedVault.toJSON()
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            localStorage.setItem('vault', jsonVault);
        }
    }

    public scheduleLock(timeout: number) {
        setTimeout(() => {
            this.lock()
        }, timeout)
    }
}