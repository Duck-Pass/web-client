import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import PasswordStrengthMeter from "@/components/vault/password-strength-meter";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WebCryptoPrimitivesService } from "@/lib/services/webcrypto-primitives.service";
import { WebCryptoEncryptionService } from "@/lib/services/webcrypto-encryption.service";
import { CryptoService } from "@/lib/services/crypto.service";
import env from "@/env.json";

const formSchema = z
	.object({
		email: z
			.string()
			.email({
				message: "Invalid email address",
			})
			.trim()
			.toLowerCase(),
		password: z
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
	.superRefine(({ password, verifyPassword }, ctx) => {
		if (password !== verifyPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "The password did not match",
				path: ["verifyPassword"],
			});
		}
	});

export function RegisterAuthForm({
	handleSubmit,
	handleError,
}: {
	handleSubmit: (submitted: boolean) => void;
	handleError: (error: string) => void;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			verifyPassword: "",
		},
	});

	const [type, setType] = useState<string>("password");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const primitives = new WebCryptoPrimitivesService(window);
		const encryptionService = new WebCryptoEncryptionService(primitives);
		const cryptoService = new CryptoService(primitives, encryptionService);
		const masterKey1 = await cryptoService.makeMasterKey(
			values.password,
			values.email,
		);
		const masterKey2 = await cryptoService.makeMasterKey(
			values.verifyPassword,
			values.email,
		);
		const hashMasterKey1 = await cryptoService.hashMasterKey(
			values.password,
			masterKey1,
			1,
		);
		const hashMasterKey2 = await cryptoService.hashMasterKey(
			values.verifyPassword,
			masterKey2,
			1,
		);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, encryptedKey] = await cryptoService.makeUserKey(masterKey1);
		const payload = {
			email: values.email,
			key_hash: hashMasterKey1,
			key_hash_conf: hashMasterKey2,
			symmetric_key_encrypted: encryptedKey.toJSON(),
		};

		const response = await fetch(env.api + "/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			const data = await response.json();
			if (data.message == "User created successfully") {
				handleSubmit(true);
				handleError("");
			}
		} else {
			const data = await response.json();
			handleError(
				"Your account registration failed, detail: " + data.detail,
			);
			handleSubmit(true);
		}
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
					name="email"
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
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<div className="flex w-full items-center space-x-2">
									<Input type={type} {...field} />
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
							<PasswordStrengthMeter
								password={form.getValues().password}
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
							<FormLabel>Verify password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col w-full mt-2">
					<Button type="submit">Create my account</Button>
				</div>
			</form>
		</Form>
	);
}
