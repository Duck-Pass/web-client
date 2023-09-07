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
		// Compute master key hash
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

		// Send the payload to the API
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

		// Treat the response
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
			setError(
				"Invalid credentials. Reminder: You must validate your mail to login.",
			);
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

		// Get the user data from the API after fetching the access token
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
			data.hash_master_key = hashMasterKey;

			// Store the user data in the localStorage
			localStorage.setItem(
				"userProfile",
				JSON.stringify({
					id: data.id,
					email: data.email,
					symmetric_key: userKey.toJSON(),
					has_two_factor_auth: data.has_two_factor_auth,
					hash_master_key: data.hash_master_key,
				}),
			);

			// Decrypt the user vault locally
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

	const logout = async (doSync = true) => {
		if (doSync) {
			await VaultManager.getInstance().sync();
		}
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
		// Setup the payload
		const token = localStorage.getItem("token");
		const twoFactorParams = {
			auth_key: payload.authKey,
			totp_code: payload.totp.toString(),
		};
		setError("");
		// Send the payload to the API
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

		// Treat the response
		if (!response) {
			setError("Something went wrong. Please try again later.");
			return;
		}

		if (response.status === 200) {
			// Set the has_two_factor_auth to true in the local storage
			localStorage.setItem(
				"userProfile",
				JSON.stringify({
					...user,
					has_two_factor_auth: true,
				}),
			);
			// Update the user state for the view
			setUser({
				...user,
				has_two_factor_auth: true,
			});
			return;
		}

		setError("Validation failed.");
	};

	const disable2FA = async () => {
		// Setup the payload
		setError("");
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

		// Treat the response
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
					...user,
					has_two_factor_auth: false,
				}),
			);
			// Update the user state for the view
			setUser({
				...user,
				has_two_factor_auth: false,
			});
			return;
		}
	};

	const updateEmail = async (payload: {
		newEmail: string;
		currentPassword: string;
	}) => {
		setError("");
		// Verify currentPassword hash
		const primitives = new WebCryptoPrimitivesService(window);
		const encryptionService = new WebCryptoEncryptionService(primitives);
		const cryptoService = new CryptoService(primitives, encryptionService);

		const masterKey = await cryptoService.makeMasterKey(
			payload.currentPassword,
			user.email,
		);

		const hashMasterKey = await cryptoService.hashMasterKey(
			payload.currentPassword,
			masterKey,
			1,
		);

		if (hashMasterKey !== user.hash_master_key) {
			setError("Invalid password");
			return;
		}

		// Update master key with new email
		const newMasterKey = await cryptoService.makeMasterKey(
			payload.currentPassword,
			payload.newEmail,
		);

		const newHashMasterKey = await cryptoService.hashMasterKey(
			payload.currentPassword,
			newMasterKey,
			1,
		);
		const [userKey, encryptedUserKey] = await cryptoService.makeUserKey(
			newMasterKey,
		);

		// Update Vault with new master key
		const encryptedVault = await VaultManager.getInstance().encrypt(
			userKey,
		);

		if (!encryptedVault) {
			return;
		}

		// Send the new information (new vault encrypted + new key + new email) to the API
		const response = await fetch(env.api + "/update_email", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				user_auth: {
					email: payload.newEmail,
					key_hash: newHashMasterKey,
					key_hash_conf: newHashMasterKey,
					symmetric_key_encrypted: encryptedUserKey.toJSON(),
				},
				vault: {
					vault: encryptedVault.toJSON(),
				},
			}),
		}).catch(error => {
			setError(error);
		});

		// Treat the response
		if (!response) {
			setError("Something went wrong. Please try again later.");
			return;
		}

		const data = await response.json();

		if (response.status >= 400 && response.status < 500) {
			setError(
				data?.detail ?? "There was an error. Please try again later.",
			);
			return;
		} else if (response.status >= 500) {
			setError(
				data?.detail ??
					"There was an error on the server. Please try again later.",
			);
			return;
		} else if (response.status == 200) {
			logout(false);
			return;
		}
	};

	const updatePassword = async (payload: {
		oldPassword: string;
		newPassword: string;
		verifyPassword: string;
	}) => {
		setError("");
		const primitives = new WebCryptoPrimitivesService(window);
		const encryptionService = new WebCryptoEncryptionService(primitives);
		const cryptoService = new CryptoService(primitives, encryptionService);

		// Verif currentPassword is correct
		const masterKey = await cryptoService.makeMasterKey(
			payload.oldPassword,
			user.email,
		);
		const hashMasterKey = await cryptoService.hashMasterKey(
			payload.oldPassword,
			masterKey,
			1,
		);
		if (hashMasterKey !== user.hash_master_key) {
			setError("Invalid password");
			return;
		}

		// Update new password locally
		const newMasterKey = await cryptoService.makeMasterKey(
			payload.newPassword,
			user.email,
		);
		const newHashMasterKey = await cryptoService.hashMasterKey(
			payload.newPassword,
			newMasterKey,
			1,
		);
		const [userKey, encryptedUserKey] = await cryptoService.makeUserKey(
			newMasterKey,
		);

		// Update Vault with new master key
		const verifyMasterKey = await cryptoService.makeMasterKey(
			payload.verifyPassword,
			user.email,
		);
		const verifyHashMasterKey = await cryptoService.hashMasterKey(
			payload.verifyPassword,
			verifyMasterKey,
			1,
		);
		VaultManager.destroyInstance();
		const encryptedVault = await VaultManager.getInstance().encrypt(
			userKey,
		);

		if (!encryptedVault) {
			return;
		}

		// Prepare the payload for the API
		const params = {
			user_auth: {
				email: user.email,
				key_hash: newHashMasterKey,
				key_hash_conf: verifyHashMasterKey,
				symmetric_key_encrypted: encryptedUserKey.toJSON(),
			},
			vault: {
				vault: encryptedVault?.toJSON(),
			},
		};
		// Send the new information to the API
		const token = localStorage.getItem("token");
		const response = await fetch(env.api + "/update_password", {
			method: "PUT",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		}).catch(error => {
			setError(error.message);
		});

		// Treat the response
		if (!response) {
			setError("Something went wrong. Please try again later.");
			return;
		}

		if (response.status >= 400 && response.status < 500) {
			setError("There was an error. Please try again later.");
			return;
		} else if (response.status >= 500) {
			setError(
				"There was an error on the server. Please try again later.",
			);
			return;
		} else if (response.status == 200) {
			logout(false);
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
					updateEmail,
					updatePassword,
					isTokenExpired,
					clearState,
				}}
			>
				{children}
			</AuthContext.Provider>
		</>
	);
};
