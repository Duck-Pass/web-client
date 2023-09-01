import { EncryptedString, EncString } from "@/lib/models/encrypted-string";
import { CryptoService } from "@/lib/services/crypto.service";
import { WebCryptoEncryptionService } from "@/lib/services/webcrypto-encryption.service";
import { WebCryptoPrimitivesService } from "@/lib/services/webcrypto-primitives.service";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

type Props = {
    children: ReactNode;
}

export const AuthContextProvider = ({children} : Props)  => {
    const [user, setUser] = useState(() => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : {};
    })

    const [error, setError] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.hasTwoFactorAuth ? user.hasTwoFactorAuth : false);
    const [authKey, setAuthKey] = useState({authKey:"", url:""});

    const navigate = useNavigate();

    const login = async (payload: {username: string, password: string, totp?: number}) => {
        const primitives = new WebCryptoPrimitivesService(window);
        const encryptionService = new WebCryptoEncryptionService(primitives);
        const cryptoService = new CryptoService(primitives, encryptionService);
        const masterKey = await cryptoService.makeMasterKey(payload.password, payload.username);
        const hashMasterKey = await cryptoService.hashMasterKey(payload.password, masterKey, 1);

        setError("");
        const authUrl = payload.totp ? "https://api-staging.duckpass.ch/check_two_factor_auth" : "https://api-staging.duckpass.ch/token";

        let credentials:{username: string, password: string, totp_code?: string} = {
            username: payload.username,
            password: hashMasterKey,
        }

        if (payload.totp) {
            credentials.totp_code = payload.totp.toString();
        }

        const responseToken = await fetch(authUrl, {
            method: "POST",
            headers: {
                "Content-Type": payload.totp ? "application/json" : "application/x-www-form-urlencoded",
            },
            body: payload.totp ? JSON.stringify(credentials) : new URLSearchParams(credentials),
        }).catch((error) => {
            setError(error.message)
        });


        if (!responseToken) {
            return;
        }

        const tokenData = await responseToken.json();

        if (responseToken.ok && tokenData?.detail !== "Two-factor authentication is enabled") {
            // probably the least secure way to store the token
            // we should use httpOnly cookies in a future improvement
            localStorage.setItem("token", tokenData.access_token);
            setError("");
        } else if (responseToken.status === 404 || responseToken.status === 401) {
            setError("Invalid credentials");
            return;
        } else if (responseToken.status === 200 && tokenData?.detail === "Two-factor authentication is enabled") {
            if (!payload.totp) {
                navigate("/2fa-login", {
                    state: {
                        username: payload.username,
                        password: payload.password,
                    }
                });
                return;
            }
            return;
        } else if (responseToken.status >= 400 && responseToken.status < 500) {
            setError("There was an error. " + tokenData?.detail);
            return;
        } else if (responseToken.status >= 500) {
            setError("There was an error on the server. Please try again later.");
            return;
        }

        const response = await fetch("https://api-staging.duckpass.ch/get_user", {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${tokenData.access_token}`,
            }
        })

        const data = await response.json();

        if (response.ok) {
            const encryptedKey = new EncryptedString(data.symmetricKeyEncrypted as EncString)
            const userKey = await cryptoService.decryptUserKey(masterKey, encryptedKey);
            localStorage.setItem("userProfile", JSON.stringify({
                id: data.id,
                email: data.email,
                symmetric_key: userKey.toJSON(),
            }));

            if (data.vault) {
                const encryptedVault = new EncryptedString(data.vault as EncString);
                const vault = await encryptionService.decrypt(encryptedVault, userKey);
                localStorage.setItem("vault", JSON.stringify(vault));
            } else {
                // create vault and sync with the server                
            }

            setUser(data);
    
            navigate("/vault");
        } else {
            console.error(data);
        }

    }

    const logout = async () => {};
    const genAuthKey = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api-staging.duckpass.ch/generate_auth_key", {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
        const data = await response.json();
        console.log(data.url)
        setError("");
        setAuthKey(data);
    };
    const enable2FA = async (payload: {authKey: string, totp: number}) => {
        const token = localStorage.getItem("token");
        const twoFactorParams = {
            auth_key: payload.authKey,
            totp_code: payload.totp.toString(),
        };
        setError("");
        const response = await fetch("https://api-staging.duckpass.ch/enable_two_factor_auth?" + new URLSearchParams(twoFactorParams), {
            method: "POST",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).catch((error) => {
            setError(error.message)
        });

        if (!response) {
            setError("Something went wrong. Please try again later.");
            return;
        }

        if (response.status === 200) {
            setTwoFactorEnabled(true);
            return;
        }

        setError("Validation failed.");
    };
    const disable2FA = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api-staging.duckpass.ch/disable_two_factor_auth", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).catch((error) => {
            setError(error.message)
        });

        if (!response) {
            setError("Something went wrong. Please try again later.");
            return;
        }

        if (response.status === 200) {
            setError("");
            setTwoFactorEnabled(false);
            return;
        }
    }

    return (
        <>
            <AuthContext.Provider value={{user, error, twoFactorEnabled, authKey, login, logout, genAuthKey, enable2FA, disable2FA}}>
                {children}
            </AuthContext.Provider>
        </>
    );

}