import { EncryptedString, EncString } from "@/lib/models/encrypted-string";
import { CryptoService } from "@/lib/services/crypto.service";
import { WebCryptoEncryptionService } from "@/lib/services/webcrypto-encryption.service";
import { WebCryptoPrimitivesService } from "@/lib/services/webcrypto-primitives.service";
import { ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { VaultManager } from "@/lib/models/vault";
import { VaultContext } from "./VaultContext";
import env from "@/env.json";

type Props = {
	children: ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
	const [user, setUser] = useState(() => {
		const user = localStorage.getItem("userProfile");
		return user ? JSON.parse(user) : {};
	});

	const [error, setError] = useState("");
	const [authKey, setAuthKey] = useState({ authKey: "", url: "" });
	const { updateVault } = useContext(VaultContext);

	const navigate = useNavigate();

	const login = async (payload: {
		username: string;
		password: string;
		totp?: string;
	}) => {
		const primitives = new WebCryptoPrimitivesService(window);
		const encryptionService = new WebCryptoEncryptionService(primitives);
		const cryptoService = new CryptoService(primitives, encryptionService);
		const masterKey = await cryptoService.makeMasterKey(
			payload.password,
			payload.username,
		);
		const hashMasterKey = await cryptoService.hashMasterKey(
			payload.password,
			masterKey,
			1,
		);

		setError("");
		const authUrl = payload.totp
			? env.api + "/check_two_factor_auth"
			: env.api + "/token";

		let credentials:
			| { username: string; password: string }
			| { email: string; key_hash: string; totp_code: string };

		credentials = payload.totp
			? {
					email: payload.username,
					key_hash: hashMasterKey,
					totp_code: payload.totp,
			  }
			: { username: payload.username, password: hashMasterKey };

		const responseToken = await fetch(authUrl, {
			method: "POST",
			headers: {
				"Content-Type": payload.totp
					? "application/json"
					: "application/x-www-form-urlencoded",
			},
			body: payload.totp
				? JSON.stringify(credentials)
				: new URLSearchParams(credentials),
		}).catch(error => {
			setError(error.message);
		});

		if (!responseToken) {
			return;
		}

		const tokenData = await responseToken.json();

		if (
			responseToken.ok &&
			tokenData?.detail !== "Two-factor authentication is enabled"
		) {
			// probably the least secure way to store the token
			// we should use httpOnly cookies in a future improvement
			localStorage.setItem("token", tokenData.access_token);
			setError("");
		} else if (
			responseToken.status === 404 ||
			responseToken.status === 401
		) {
			setError("Invalid credentials");
			return;
		} else if (
			responseToken.status === 200 &&
			tokenData?.detail === "Two-factor authentication is enabled"
		) {
			if (!payload.totp) {
				navigate("/2fa-login", {
					state: {
						username: payload.username,
						password: payload.password,
					},
				});
				return;
			}
			return;
		} else if (responseToken.status >= 400 && responseToken.status < 500) {
			setError("There was an error. " + tokenData?.detail);
			return;
		} else if (responseToken.status >= 500) {
			setError(
				"There was an error on the server. Please try again later.",
			);
			return;
		}

		const response = await fetch(env.api + "/get_user", {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${tokenData.access_token}`,
			},
		});

		const data = await response.json();

		if (response.ok) {
			const encryptedKey = new EncryptedString(
				data.symmetric_key_encrypted as EncString,
			);
			const userKey = await cryptoService.decryptUserKey(
				masterKey,
				encryptedKey,
			);

			localStorage.setItem(
				"userProfile",
				JSON.stringify({
					id: data.id,
					email: data.email,
					symmetric_key: userKey.toJSON(),
					has_two_factor_auth: data.has_two_factor_auth,
				}),
			);

			if (data.vault) {
				const encryptedVault = new EncryptedString(
					data.vault as EncString,
				);
				const vault = await encryptionService.decrypt(
					encryptedVault,
					userKey,
				);
				localStorage.setItem("vault", vault);
			}
			// if an instance of VaultManager have ever been created for some reasons
			// we need to destroy it to trigger the context update
			VaultManager.destroyInstance();
			updateVault(VaultManager.getInstance().getVault());
			setUser(data);

			navigate("/vault");
		} else {
			console.error(data);
		}
	};

	const isTokenExpired = () => {
		const token = localStorage.getItem("token");
		if (!token) {
			return true;
		}

		const jwtPayload = JSON.parse(window.atob(token.split(".")[1]));
		const expirationDate = new Date(jwtPayload.exp * 1000);
		const now = new Date();
		return now >= expirationDate;
	};

	const logout = async () => {
		await VaultManager.getInstance().sync();
		await fetch(env.api + "/logout", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		clearState();
		navigate("/");
	};

	const clearState = () => {
		updateVault([]);
		localStorage.removeItem("token");
		localStorage.removeItem("userProfile");
		VaultManager.reset();
		setUser({});
		setAuthKey({ authKey: "", url: "" });
	};
	const genAuthKey = async () => {
		const token = localStorage.getItem("token");
		const response = await fetch(env.api + "/generate_auth_key", {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		setError("");
		setAuthKey({ authKey: data.auth_key, url: data.url });
	};
	const enable2FA = async (payload: { authKey: string; totp: string }) => {
		const token = localStorage.getItem("token");
		const twoFactorParams = {
			auth_key: payload.authKey,
			totp_code: payload.totp.toString(),
		};
		setError("");
		const response = await fetch(
			env.api +
				"/enable_two_factor_auth?" +
				new URLSearchParams(twoFactorParams),
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		).catch(error => {
			setError(error.message);
		});

		if (!response) {
			setError("Something went wrong. Please try again later.");
			return;
		}

		if (response.status === 200) {
			// Set the has_two_factor_auth to true in the local storage
			localStorage.setItem(
				"userProfile",
				JSON.stringify({
					id: user.id,
					email: user.email,
					symmetric_key: user.symmetric_key,
					has_two_factor_auth: true,
				}),
			);
			// Update the user state for the view
			setUser({
				id: user.id,
				email: user.email,
				symmetric_key: user.symmetric_key,
				has_two_factor_auth: true,
			});
			return;
		}

		setError("Validation failed.");
	};
	const disable2FA = async () => {
		const token = localStorage.getItem("token");
		const response = await fetch(env.api + "/disable_two_factor_auth", {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		}).catch(error => {
			setError(error.message);
		});

		if (!response) {
			setError("Something went wrong. Please try again later.");
			return;
		}

		if (response.status === 200) {
			setError("");
			// Set the has_two_factor_auth to true in the local storage
			localStorage.setItem(
				"userProfile",
				JSON.stringify({
					id: user.id,
					email: user.email,
					symmetric_key: user.symmetric_key,
					has_two_factor_auth: false,
				}),
			);
			// Update the user state for the view
			setUser({
				id: user.id,
				email: user.email,
				symmetric_key: user.symmetric_key,
				has_two_factor_auth: false,
			});
			return;
		}
	};

	return (
		<>
			<AuthContext.Provider
				value={{
					user,
					error,
					authKey,
					login,
					logout,
					genAuthKey,
					enable2FA,
					disable2FA,
					isTokenExpired,
					clearState,
				}}
			>
				{children}
			</AuthContext.Provider>
		</>
	);
};
