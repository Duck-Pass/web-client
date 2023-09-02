import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export const PrivateRoute = () => {
    const {user} = useContext(AuthContext)
    return user?.email ? <Outlet/> : <Navigate to="/login" />
}