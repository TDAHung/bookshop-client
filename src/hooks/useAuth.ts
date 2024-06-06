import { gql, useMutation } from "@apollo/client";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const LOGIN = gql`
mutation SignIn($input: SignInInput!){
    signIn(signInInput: $input){
        accessToken,
        refreshToken,
        user{
            id,
            email,
            username,
            firstName,
            lastName
        }
    }
}
`;

export const useAuth = () => {
    const [signIn] = useMutation(LOGIN);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken", "user"]);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await signIn({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });
            const { accessToken, user } = response.data.signIn;
            const decodedToken = jwtDecode(accessToken);
            let maxAge;
            if (decodedToken && decodedToken.exp) {
                const expirationTime = decodedToken.exp;
                const currentTime = Math.floor(Date.now() / 1000);
                maxAge = expirationTime - currentTime;
            } else {
                maxAge = 0;
            }
            setCookie("accessToken", accessToken, { path: "/", maxAge, secure: true, sameSite: "strict" });
            setCookie("user", JSON.stringify(user), { path: "/", maxAge, secure: true, sameSite: "strict" });
            navigate('/');
        } catch (err) {
            throw err;
        }
    }

    const getUser = () => {
        const user = cookies.user ?? null;
        return user;
    };

    const logout = () => {
        removeCookie("accessToken", { path: "/" });
        removeCookie("user", { path: "/" });
        navigate('/');
    }

    return {
        login,
        getUser,
        logout
    }
}
