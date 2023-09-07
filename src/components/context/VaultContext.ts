import { createContext } from "react";
import { Vault } from "@/lib/models/vault";

type IVaultContext = {
	vault: Vault;
	breachLimit: boolean;
	updateVault: (data: Vault) => void;
	checkBreach: (payload: { password: string }) => Promise<number | null>;
};

const defaultValues = {
	vault: [],
	// Set a limit for password breaches to avoid spamming HIBP API
	breachLimit: false,
	updateVault: async () => {},
	checkBreach: async () => 0,
};

export const VaultContext = createContext<IVaultContext>(defaultValues);
