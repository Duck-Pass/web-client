import { MasterKey } from "../models/symmetric-crypto-key";

export abstract class CryptoService {
	makeMasterKey: (password: string, email: string) => Promise<MasterKey>;
}
