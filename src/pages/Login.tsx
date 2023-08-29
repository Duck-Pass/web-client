import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Logo from "@/assets/ducky-round.png"
import { LoginAuthForm } from "@/components/auth/login-auth-form"

export default function LoginPage() {
  return (
    <>
      <div className="container h-screen flex flex-col items-center justify-center">
        <Link to="/">
          <img className="w-32 h-32 p-2 -mt-10 mb-2 rounded-full" src={Logo} alt="" />
        </Link>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>By logging in you will access to your personal vault.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginAuthForm />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-gray-700">
              Don't have an account? {" "}
              <Link to="/register" className=" text-blue-600 hover:underline">Sign up</Link>
              <br />
              Password forgotten? {" "}
              <Link to="/reset-password" className=" text-blue-600 hover:underline">Click here</Link>!
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
