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

export default function AccountVerified() {

  return (
    <>
      <div className="container h-screen flex flex-col items-center justify-center">
        <Link to="/">
          <img className="w-32 h-32 p-2 -mt-10 mb-2 rounded-full" src={Logo} alt="" />
        </Link>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Account verified!</CardTitle>
            <CardDescription>Account creation confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-left">Your account has been verified! You can now log in!</p>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-gray-700">
              <Link to="/login" className=" text-blue-600 hover:underline">Click here to log in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}