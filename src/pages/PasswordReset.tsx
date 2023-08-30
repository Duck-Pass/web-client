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
import { useState } from "react"
import { ResetPasswordRequestForm } from "@/components/auth/reset-pass-request-form"

export default function PasswordReset() {

  const [submitted, setSubmitted] = useState<boolean>(false)


  return (
    <>
      <div className="container h-screen flex flex-col items-center justify-center">
        <Link to="/">
          <img className="w-32 h-32 p-2 -mt-10 mb-2 rounded-full" src={Logo} alt="" />
        </Link>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>{submitted ? 'We received your request!' : 'Enter your account\'s email address to reset your password.'}</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? <p className="text-sm text-left">If there's an account associated to this e-mail, we've sent you an email, check your mailbox!</p> : <ResetPasswordRequestForm handleSubmit={(submitted: boolean) => setSubmitted(submitted)} />}
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-gray-700">
              <Link to="/login" className=" text-blue-600 hover:underline">Go back to login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}