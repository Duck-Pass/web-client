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
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

const formSchema = z
	.object({
		oldPassword: z.string().min(1, {
			message: "Password is required.",
		}),
		newPassword: z
			.string()
			.min(8, {
				message: "Password must be at least 8 characters.",
			})
			.regex(/.*[A-Z].*/, {
				message: "Password must contain at least one uppercase letter.",
			})
			.regex(/.*[\d].*/, {
				message: "Password must contain at least one number.",
			})
			.regex(/.*[\W_].*/, {
				message: "Password must contain at least one symbol.",
			}),
		verifyPassword: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
	})
	.superRefine(({ newPassword, verifyPassword }, ctx) => {
		if (newPassword !== verifyPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "The password did not match",
				path: ["verifyPassword"],
			});
		}
	});

export default function ProfilePasswordForm() {
	const { updatePassword } = useContext(AuthContext);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			verifyPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		updatePassword({
			oldPassword: values.oldPassword,
			newPassword: values.newPassword,
			verifyPassword: values.verifyPassword,
		});
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
