import { createContext } from "react";

type User = {
    id: number;
    email: string;
    symmetric_key: string;
    two_factor_auth_enabled: boolean;
    vault?: string;
}

type AuthKey = {
    authKey: string,
    url: string,
}

type IAuthContext = {
    user: User;
    error: string;
    twoFactorEnabled: boolean;
    authKey: AuthKey;
    login: (payload: {username: string, password: string, totp?: number}) => void;
    isTokenExpired(): boolean;
    logout: () => void;
    genAuthKey: () => void;
    enable2FA: (payload: {authKey: string, totp: number}) => void;
    disable2FA: () => void;
    clearState: () => void;
}

const defaultValues = {
    error: "",
    user: {
        id: 0,
        email: "",
        symmetric_key: "",
        two_factor_auth_enabled: false,
        vault: "",
    },
    twoFactorEnabled: false,
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