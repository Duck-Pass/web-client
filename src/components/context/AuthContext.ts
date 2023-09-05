import { createContext } from "react";

type User = {
	id: number;
	email: string;
	symmetric_key: string;
	has_two_factor_auth: boolean;
	hash_master_key: string;
};

type AuthKey = {
	authKey: string;
	url: string;
};

type IAuthContext = {
	user: User;
	error: string;
	authKey: AuthKey;
	login: (payload: {
		username: string;
		password: string;
		totp?: string;
	}) => void;
	isTokenExpired(): boolean;
	logout: (doSync?: boolean) => void;
	genAuthKey: () => void;
	enable2FA: (payload: { authKey: string; totp: string }) => void;
	disable2FA: () => void;
	updateEmail: (payload: {
		newEmail: string;
		currentPassword: string;
	}) => void;
	updatePassword: (payload: {
		oldPassword: string;
		newPassword: string;
		verifyPassword: string;
	}) => void;
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
