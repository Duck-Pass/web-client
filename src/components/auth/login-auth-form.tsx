import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
	password: z.string().min(1, {
		message: "Password is required",
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
	const [type, setType] = useState<string>("password");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		login({ username: values.email, password: values.password });
	}

	async function handleToggleVisibility() {
		if (type === "password") {
			setType("text");
			return;
		}
		setType("password");
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
									<div className="flex w-full items-center space-x-2">
										<Input
											type={type}
											autoComplete="current-password"
											{...field}
										/>
										{type === "password" ? (
											<Eye
												className="hover:cursor-pointer"
												onClick={() => {
													handleToggleVisibility();
												}}
											/>
										) : (
											<EyeOff
												className="hover:cursor-pointer"
												onClick={() => {
													handleToggleVisibility();
												}}
											/>
										)}
									</div>
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
