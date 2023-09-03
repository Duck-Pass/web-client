import { useState } from "react";
import { VaultContext } from "./VaultContext";
import { Vault, VaultManager } from "@/lib/models/vault";

type Props = {
	children: React.ReactNode;
};

export const VaultContextProvider = ({ children }: Props) => {
	const [vault, setVault] = useState(() => {
		if (VaultManager.instanceExists()) {
			return VaultManager.getInstance().getVault();
		}
		return [];
	});

	const updateVault = async (v: Vault) => {
		// we need to deep copy the object
		setVault(JSON.parse(JSON.stringify(v)));
	};

	return (
		<>
			<VaultContext.Provider value={{ updateVault, vault }}>
				{children}
			</VaultContext.Provider>
		</>
	);
};
