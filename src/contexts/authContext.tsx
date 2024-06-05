import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext<IUser>({
    id: 0,
    firstName: "",
    lastName: "",
    email: ""
});

type IUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

const AuthProvider = ({ children }: { children: any }) => {
    const { getUser } = useAuth();
    const user = getUser();

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };
