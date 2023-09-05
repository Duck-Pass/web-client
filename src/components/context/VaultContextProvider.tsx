import { useState } from "react";
import { VaultContext } from "./VaultContext";
import { Vault, VaultManager } from "@/lib/models/vault";
import env from "@/env.json";

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
	const [breachLimit, setBreachLimit] = useState<boolean>(false);

	const updateVault = async (v: Vault) => {
		// we need to deep copy the object
		setVault(JSON.parse(JSON.stringify(v)));
	};

	const checkBreach = async (payload: { email: string; domain: string }) => {
		setBreachLimit(true);
		const token = localStorage.getItem("token");
		const params = {
			email: payload.email,
			domain: payload.domain,
		};
		const response = await fetch(
			env.api + "/hibp_breaches?" + new URLSearchParams(params),
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!response) {
			setBreachLimit(false);
			return;
		}

		if (!response.ok) {
			setBreachLimit(false);
			return;
		}

		const data = await response.json();

		setTimeout(() => {
			setBreachLimit(false);
		}, 6000);

		return data.message;
	};

	return (
		<>
			<VaultContext.Provider
				value={{ updateVault, checkBreach, vault, breachLimit }}
			>
				{children}
			</VaultContext.Provider>
		</>
	);
};
