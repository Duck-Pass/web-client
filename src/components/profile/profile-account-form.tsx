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
	newEmail: z
		.string()
		.email({
			message: "Invalid email address",
		})
		.trim(),
	currentPassword: z.string().min(1, {
		message: "Password is required",
	}),
});

export default function ProfileAccountForm() {
	const { updateEmail } = useContext(AuthContext);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newEmail: "",
			currentPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		updateEmail({
			newEmail: values.newEmail,
			currentPassword: values.currentPassword,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				<FormField
					control={form.control}
					name="newEmail"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="john@doe.ch" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col w-full mt-2">
					<Button type="submit">Change email</Button>
				</div>
			</form>
		</Form>
	);
}
