import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { QRCodeSVG } from "qrcode.react";
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
import copy from "copy-to-clipboard";
import { Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";
import Logo from "@/assets/ducky-round.png";

const formSchema = z.object({
	totp: z
		.string()
		.trim()
		.regex(/^([0-9]){6}$/, {
			message: "Your TOTP code must be a combination of 6 digits.",
		}),
});

export function Enable2FAForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			totp: "",
		},
	});
	const { error, authKey, user, enable2FA, disable2FA } =
		useContext(AuthContext);

	function handleEnableButton(values: z.infer<typeof formSchema>) {
		enable2FA({ authKey: authKey.authKey, totp: values.totp });
	}

	function handleDisableButton() {
		disable2FA();
	}

	return (
		<>
			<div className="flex flex-col justify-center">
				<p className="text-center text-md text-green-400 font-semibold mb-4">
					{user.has_two_factor_auth
						? "Two-factor authentication is enabled"
						: ""}
				</p>

				{user.has_two_factor_auth ? (
					<Button
						type="button"
						variant="destructive"
						onClick={() => handleDisableButton()}
					>
						Disable 2FA
					</Button>
				) : (
					<div>
						<div className="flex flex-col justify-center items-center my-2">
							<QRCodeSVG
								value={authKey.url}
								size={256}
								fgColor="#022837"
								imageSettings={{
									src: { Logo }.Logo,
									x: undefined,
									y: undefined,
									height: 50,
									width: 50,
									excavate: true,
								}}
							/>
							<p className="mt-2 text-lg font-semibold">
								Authenticator key
							</p>
							<div className="my-2 flex h-10 items-center w-full space-x-2">
								<Input
									disabled
									value={
										authKey.authKey === ""
											? "Loading ..."
											: authKey.authKey
									}
									id="authKey"
									autoComplete="auth-key"
									className="text-sm w-full text-black"
								/>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											type="button"
											onClick={() =>
												copy(authKey.authKey)
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
						</div>

						<p className="text-center text-md text-red-400 font-semibold">
							{error}
						</p>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleEnableButton)}
								className="space-y-2"
							>
								<FormField
									control={form.control}
									name="totp"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Verification code
											</FormLabel>
											<FormControl>
												<Input
													placeholder="XXXXXX"
													{...field}
												/>
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
				)}
			</div>
		</>
	);
}
