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

const formSchema = z.object({
  verify: z.number().gte(100000).lte(999999),
})

export function Enable2FAForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
          control={form.control}
          name="verify"
          render={({ field }) => (
            <FormItem>
            <FormLabel>Verification code</FormLabel>
            <FormControl>
                <Input placeholder="XXXXXX" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
          )}
          />
          <div className="flex flex-col w-full mt-2">
            <Button type="submit">Enable 2FA</Button>
          </div>
        </form>
        </Form>
      </div>

    </>
  )
}