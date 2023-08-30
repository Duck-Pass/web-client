import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Logo from "@/assets/ducky-round.png"
import { Login2FAAuthForm } from "@/components/auth/login-2fa-auth-form"

export default function Login2FA() {
  return (
    <>
      <div className="container h-screen flex flex-col items-center justify-center">
        <Link to="/">
          <img className="w-32 h-32 p-2 -mt-10 mb-2 rounded-full" src={Logo} alt="" />
        </Link>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Two-factor Authentication</CardTitle>
            <CardDescription>
                Open your two-factor authentication (TOTP) app or browser extension to view your authentication code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Login2FAAuthForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}