import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

const formSchema = z.object({
  totp: z.coerce.number().min(100000).max(999999),
})

export function Login2FAAuthForm({username, password} : {username?: string, password?: string}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !password) {
      navigate("/login");
    }
    return;
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const { login } = useContext(AuthContext);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (username && password && values.totp) {
      login({
        username: username,
        password: password,
        totp: values.totp,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="totp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication code</FormLabel>
              <FormControl>
                <Input placeholder="XXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full mt-2">
          <Button type="submit">Login</Button>
        </div>
      </form>
    </Form>
  )
}
