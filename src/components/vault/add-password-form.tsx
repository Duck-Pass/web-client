import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Input } from "@/components/ui/input";
import PasswordStrengthMeter from "./password-strength-meter";
import { Copy } from "lucide-react";
import PasswordGeneratorPopover from "./password-generator-popover";
import { VaultManager } from "@/lib/models/vault";
import { VaultContext } from "../context/VaultContext";
import { useContext } from "react";

const formSchema = z.object({
	name: z.string().trim().min(1),
	username: z.string().trim(),
	password: z.string().min(8),
	note: z.string().optional(),
	authKey: z.string().optional(),
	website: z.string().url().optional().or(z.literal("")),
});

export function AddPasswordForm({
	openOnChange,
}: {
	openOnChange: (open: boolean) => void;
}) {
	const { updateVault } = useContext(VaultContext);
	const [type, setType] = useState<string>("password");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			username: "",
			password: "",
			note: "",
			authKey: "",
			website: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const manager = VaultManager.getInstance();

		if (!values.name || !values.username || !values.username) {
			return;
		}

		await manager.addItem({
			id: "",
			name: values.name,
			username: values.username,
			password: values.password,
			authKey: values.authKey ?? "",
			note: values.note ?? "",
			website: values.website ?? "",
			favorite: false,
			breached: false,
		});

		openOnChange(false);

		updateVault(manager.getVault());
	}

	async function handleToggleVisibility() {
		if (type === "password") {
			setType("text");
			return;
		}
		setType("password");
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Google Account"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="john.doe@gmail.com"
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
								<div className="flex w-full items-center space-x-1">
									<Input
										type={type}
										autoComplete="current-password"
										{...field}
									/>
									{type === "password" ? (
										<Eye
											className="hover:cursor-pointer h-10 w-10"
											onClick={() => {
												handleToggleVisibility();
											}}
										/>
									) : (
										<EyeOff
											className="hover:cursor-pointer h-10 w-10"
											onClick={() => {
												handleToggleVisibility();
											}}
										/>
									)}
									<PasswordGeneratorPopover />
									<Popover>
										<PopoverTrigger asChild>
											<Button
												type="button"
												onClick={() =>
													navigator.clipboard.writeText(
														form.getValues()
															.password,
													)
												}
											>
												<Copy />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto">
											Copied!
										</PopoverContent>
									</Popover>
								</div>
							</FormControl>
							<PasswordStrengthMeter
								password={form.getValues().password}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="website"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Website</FormLabel>
							<FormControl>
								<Input
									placeholder="https://www.duckpass.ch"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="note"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Note</FormLabel>
							<FormControl>
								<Input placeholder="Optional" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="authKey"
					render={({ field }) => (
						<FormItem>
							<FormLabel>TOTP key</FormLabel>
							<FormControl>
								<Input placeholder="Optional" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button type="submit">Add new password</Button>
				</AlertDialogFooter>
			</form>
		</Form>
	);
}
