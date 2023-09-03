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
import PasswordStrengthMeter from "@/components/vault/password-strength-meter";

const formSchema = z.object({
	oldPassword: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
	newPassword: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
	verifyPassword: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export default function ProfilePasswordForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			verifyPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				<FormField
					control={form.control}
					name="oldPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Old password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<PasswordStrengthMeter
								password={form.getValues().newPassword}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="verifyPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Re-type new password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col w-full mt-2">
					<Button type="submit">Change password</Button>
				</div>
			</form>
		</Form>
	);
}
