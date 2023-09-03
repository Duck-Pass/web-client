import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRoute = () => {
    const {user, isTokenExpired} = useContext(AuthContext)
    return (user?.email && !isTokenExpired()) ? <Outlet/> : <Navigate to="/login" />
}