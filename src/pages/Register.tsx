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
import { RegisterAuthForm } from "@/components/auth/register-auth-form"

export default function Register() {
  return (
    <>
      <div className="container h-screen flex flex-col items-center justify-center">
        <Link to="/">
          <img className="w-32 h-32 p-2 -mt-10 mb-2 rounded-full" src={Logo} alt="" />
        </Link>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your account to access your personnal vault.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterAuthForm />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-gray-700">
              Already have an account? {" "}
              <Link to="/login" className=" text-blue-600 hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}