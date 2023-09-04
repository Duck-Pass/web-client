import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

const formSchema = z.object({
	email: z
		.string()
		.email({
			message: "Invalid email address",
		})
		.trim(),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export function LoginAuthForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const { login } = useContext(AuthContext);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		login({ username: values.email, password: values.password });
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-2"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="john@doe.ch"
										autoComplete="username"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										autoComplete="current-password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-col w-full mt-2">
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</Form>
		</>
	);
}
