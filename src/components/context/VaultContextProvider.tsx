import { useState } from "react";
import { VaultContext } from "./VaultContext";
import { Vault, VaultManager } from "@/lib/models/vault";
import env from "@/env.json";
import { sha1 } from "crypto-hash";

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

	const checkBreach = async (payload: { password: string }) => {
		const token = localStorage.getItem("token");
		const passwordHash = (await sha1(payload.password)).toUpperCase();
		const params = {
			// Send 5 first characters of the SHA-1 hash of the password
			hash_begin: passwordHash.substring(0, 5),
		};
		const response = await fetch(
			env.api + "/hibp_password?" + new URLSearchParams(params),
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		).catch(() => {
			return;
		});

		if (!response) {
			return;
		}

		if (!response.ok) {
			return;
		}

		const data = await response.json();
		const index = data.indexOf(passwordHash.substring(5));
		const endLineIndex = data.indexOf("\r\n", index);
		// Set the number of exposition of the password
		const numberExposition =
			index !== -1
				? data.substring(index, endLineIndex).split(":")[1]
				: 0;
		setBreachLimit(true);

		// Cannot use Verify button before waiting 6 seconds
		setTimeout(() => {
			setBreachLimit(false);
		}, 6000);

		return numberExposition;
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
