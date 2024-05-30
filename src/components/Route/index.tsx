import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { pages } from "../../utils/constant";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const authenticated = sessionStorage.getItem('onLogin');
    if (!authenticated) return <Navigate to={pages.LOGIN} replace />
    return children;
}

export const PublicRoute = ({ children }: { children: ReactNode }) => {
    const authenticated = sessionStorage.getItem('onLogin');
    if (authenticated) return <Navigate to={pages.HOME} replace />
    return children;
}
