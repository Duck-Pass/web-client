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

    const navigate = useNavigate();

    const login = async (payload: {username: string, password: string}) => {
        const primitives = new WebCryptoPrimitivesService(window);
        const encryptionService = new WebCryptoEncryptionService(primitives);
        const cryptoService = new CryptoService(primitives, encryptionService);
        const masterKey = await cryptoService.makeMasterKey(payload.password, payload.username);
        const hashMasterKey = await cryptoService.hashMasterKey(payload.password, masterKey, 1);

        const credentials = {
            username: payload.username,
            password: hashMasterKey,
        }

        const responseToken = await fetch("https://api-staging.duckpass.ch/token", {
            method: "POST",
            body: new URLSearchParams(credentials),
        }).catch((error) => {
            setError(error.message)
        });

        if (!responseToken) {
            return;
        }

        const token = await responseToken.json();

        if (responseToken.ok) {
            // probably the least secure way to store the token
            // we should use httpOnly cookies in a future improvement
            localStorage.setItem("token", token.access_token);
            setError("");
        } else if (responseToken.status === 404 || responseToken.status === 401) {
            setError("Invalid credentials");
            return;
        } else if (responseToken.status >= 500) {
            setError("There was an error on the server. Please try again later.");
            return;
        }

        const response = await fetch("https://api-staging.duckpass.ch/get_user", {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.access_token}`,
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

            const myCustomVault = "this is a very important test"
            const encryptedVault = await encryptionService.encrypt(myCustomVault, userKey);
            console.log(await encryptionService.decrypt(encryptedVault, userKey));

            if (data.vault !== "") {
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

    };

    const logout = async () => {};
    const renew = async () => {};

    return (
        <>
            <AuthContext.Provider value={{user, error, login, logout, renew}}>
                {children}
            </AuthContext.Provider>
        </>
    );

}