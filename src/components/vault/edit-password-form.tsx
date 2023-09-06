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
import { Input } from "@/components/ui/input";
import PasswordStrengthMeter from "./password-strength-meter";
import { Copy } from "lucide-react";
import PasswordGeneratorPopover from "./password-generator-popover";
import { Credential, VaultManager } from "@/lib/models/vault";
import { VaultContext } from "../context/VaultContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";

export type PasswordModalProps = {
	cred: Credential;
};

const formSchema = z.object({
	id: z.string(),
	name: z.string().trim().min(5),
	username: z.string().trim(),
	password: z.string().min(8),
	website: z.string().url().optional().or(z.literal("")),
	note: z.string().optional(),
	authKey: z.string().optional(),
});

export function EditPasswordForm(props: PasswordModalProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: props.cred.id,
			name: props.cred.name,
			username: props.cred.username,
			password: props.cred.password,
			website: props.cred.website,
			note: props.cred.note,
			authKey: props.cred.authKey,
		},
	});
	const { updateVault } = useContext(VaultContext);
	const { toast } = useToast();
	const [type, setType] = useState<string>("password");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const manager = VaultManager.getInstance();

		if (!values.name || !values.username || !values.username) {
			return;
		}

		await manager.editItem({
			id: values.id,
			name: values.name,
			username: values.username,
			password: values.password,
			website: values.website ?? "",
			authKey: values.authKey ?? "",
			note: values.note ?? "",
			favorite: props.cred.favorite,
			// Set breached to false in case of password modification
			breached:
				values.password == props.cred.password
					? props.cred.breached
					: false,
		});

		updateVault(manager.getVault());

		toast({
			title: "Information updated!",
			description: "Your credential information have been updated!",
		});
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
								<Input {...field} />
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
											className="hover:cursor-pointer w-8 h-8"
											onClick={() => {
												handleToggleVisibility();
											}}
										/>
									) : (
										<EyeOff
											className="hover:cursor-pointer w-8 h-8"
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
									placeholder="https://www.google.com"
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

				<div className="flex flex-col w-full mt-2">
					<Button type="submit">Edit password</Button>
				</div>
			</form>
		</Form>
	);
}
