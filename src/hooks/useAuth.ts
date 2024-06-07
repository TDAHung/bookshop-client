import { gql, useMutation } from "@apollo/client";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
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

const REGISTER = gql`
mutation SignUp($input: SignUpInput!){
    signUp(signUpInput: $input){
        accessToken,
        refreshToken,
        user{
            email
            username
        }
    }
}
`;

export const useAuth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken", "user"]);
    const [signUp] = useMutation(REGISTER);
    const [signIn] = useMutation(LOGIN);
    const navigate = useNavigate();
    const [cookieAge, setCookieMaxAge] = useState<number>();

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
            setCookieMaxAge(maxAge);
            setCookie("accessToken", accessToken, { path: "/", maxAge, secure: true, sameSite: "strict" });
            setCookie("user", JSON.stringify(user), { path: "/", maxAge, secure: true, sameSite: "strict" });
            navigate('/');
        } catch (err) {
            throw err;
        }
    }

    const register = async (email: string, username: string, password: string, firstName: string, lastName: string) => {
        try {
            const response = await signUp({
                variables: {
                    input: {
                        email,
                        password,
                        username,
                        firstName,
                        lastName
                    }
                }
            });
            const { accessToken, user } = response.data.signUp;
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
        } catch (error) {
            throw error;
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
        register,
        cookieAge,
        getUser,
        logout
    }
}
