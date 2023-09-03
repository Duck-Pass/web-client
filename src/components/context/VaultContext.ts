import { createContext } from "react";
import { Vault } from "@/lib/models/vault";

type IVaultContext = {
    vault: Vault,
    updateVault: (data: Vault) => void
}

const defaultValues = {
    vault: [],
    updateVault: async () => {}
}

export const VaultContext = createContext<IVaultContext>(defaultValues)