import { createContext } from "react";

type User = {
	id: number;
	email: string;
	symmetric_key: string;
	has_two_factor_auth: boolean;
	hash_master_key: string;
};

// 2FA auth key type
type AuthKey = {
	// Auth Key
	authKey: string;
	// URL for QR code
	url: string;
};

type IAuthContext = {
	// Store User data
	user: User;
	// Error message for the view
	error: string;
	// Auth key for enable 2FA form
	authKey: AuthKey;
	// Login function (with or without 2FA code)
	login: (payload: {
		username: string;
		password: string;
		totp?: string;
	}) => void;
	// Check if token is expired
	isTokenExpired(): boolean;
	// Logout function (doSync is used to sync the Vault with the server)
	logout: (doSync?: boolean) => void;
	// Generate new 2FA auth key
	genAuthKey: () => void;
	// Enable 2FA
	enable2FA: (payload: { authKey: string; totp: string }) => void;
	// Disable 2FA
	disable2FA: () => void;
	// Update email information
	updateEmail: (payload: {
		newEmail: string;
		currentPassword: string;
	}) => void;
	// Update password information
	updatePassword: (payload: {
		oldPassword: string;
		newPassword: string;
		verifyPassword: string;
	}) => void;
	// Clear the auth state of the local session
	clearState: () => void;
};

const defaultValues = {
	error: "",
	user: {
		id: 0,
		email: "",
		symmetric_key: "",
		has_two_factor_auth: false,
		hash_master_key: "",
	},
	authKey: {
		authKey: "",
		url: "",
	},
	isTokenExpired: () => true,
	clearState: () => {},
	login: async () => {},
	logout: async () => {},
	genAuthKey: async () => {},
	enable2FA: async () => {},
	disable2FA: async () => {},
	updateEmail: async () => {},
	updatePassword: async () => {},
};

export const AuthContext = createContext<IAuthContext>(defaultValues);
