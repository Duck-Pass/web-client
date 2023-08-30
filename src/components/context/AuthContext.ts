import { createContext } from "react";

type User = {
    id: number;
    email: string;
    symmetric_key: string;
    two_factor_auth_enabled: boolean;
    vault?: string;
}


type IAuthContext = {
    user: User;
    error: string;
    login: (payload: {username: string, password: string}) => void;
    logout: () => void;
    renew: () => void;
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
    login: async () => {},
    logout: async () => {},
    renew: async () => {},
};


export const AuthContext = createContext<IAuthContext>(defaultValues);