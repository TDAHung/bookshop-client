import { gql, useMutation } from "@apollo/client";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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
            setCookie("accessToken", accessToken, { path: "/", maxAge: 3600 * 8, secure: true, sameSite: "strict" });
            setCookie("user", JSON.stringify(user), { path: "/", maxAge: 3600 * 8, secure: true, sameSite: "strict" });
            navigate('/')
        } catch (err) {
            throw err;
        }
    }

    const getUser = () => {
        const user = cookies.user ?? null;
        return user;
    };

    return {
        login,
        getUser
    }
}
