import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export const PublicRoute = () => {
    const {user} = useContext(AuthContext)
    return user?.email ? <Navigate to="/vault" /> : <Outlet/>
}