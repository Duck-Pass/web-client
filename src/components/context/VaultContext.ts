import { createContext } from "react";
import { Vault } from "@/lib/models/vault";

type IVaultContext = {
	vault: Vault;
	breachLimit: boolean;
	updateVault: (data: Vault) => void;
	checkBreach: (payload: {
		email: string;
		domain: string;
	}) => Promise<string | null>;
};

const defaultValues = {
	vault: [],
	breachLimit: false,
	updateVault: async () => {},
	checkBreach: async () => "",
};

export const VaultContext = createContext<IVaultContext>(defaultValues);
