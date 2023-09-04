import { createContext } from "react";

type User = {
	id: number;
	email: string;
	symmetric_key: string;
	has_two_factor_auth: boolean;
	vault?: string;
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
	logout: () => void;
	genAuthKey: () => void;
	enable2FA: (payload: { authKey: string; totp: string }) => void;
	disable2FA: () => void;
	clearState: () => void;
};

const defaultValues = {
	error: "",
	user: {
		id: 0,
		email: "",
		symmetric_key: "",
		has_two_factor_auth: false,
		vault: "",
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
};

export const AuthContext = createContext<IAuthContext>(defaultValues);
