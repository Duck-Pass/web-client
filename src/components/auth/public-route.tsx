import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export const PublicRoute = () => {
    const {user, isTokenExpired, clearState} = useContext(AuthContext)
    if (user?.email && isTokenExpired()) {
        clearState()
    }
    return (user?.email && !isTokenExpired()) ? <Navigate to="/vault" /> : <Outlet/>
}