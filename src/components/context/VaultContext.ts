import { createContext } from "react";
import { Vault, VaultManager } from "@/lib/models/vault";

type IVaultContext = {
    vault: Vault,
    updateVault: (data: Vault) => void
}

const defaultValues = {
    vault: VaultManager.getInstance().getVault(),
    updateVault: async () => {}
}

export const VaultContext = createContext<IVaultContext>(defaultValues)