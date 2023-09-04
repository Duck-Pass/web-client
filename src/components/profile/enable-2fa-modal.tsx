import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Enable2FAForm } from "./enable-2fa-form";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

export default function Enable2FAModal() {
	const { user, genAuthKey } = useContext(AuthContext);

	async function handleClick() {
		if (!user.has_two_factor_auth) {
			genAuthKey();
		}
	}

	return (
		<div>
			<Dialog>
				<div className="p-4 rounded-md border flex flex-col space-y-2">
					<p className="text-2xl font-semibold leading-none tracking-tight">
						{user.has_two_factor_auth ? "Disable" : "Enable"} 2FA
						authentication
					</p>
					<DialogTrigger
						onClick={() => handleClick()}
						asChild
						className="w-full"
					>
						<Button className="w-full">
							{user.has_two_factor_auth ? "Disable" : "Enable"}{" "}
							2FA
						</Button>
					</DialogTrigger>
				</div>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							Two-Factor Authentication (2FA)
						</DialogTitle>
						<DialogDescription>
							2FA is a security process in which users provide two
							different authentication factors to verify
							themselves.
						</DialogDescription>
					</DialogHeader>

					<Enable2FAForm />
				</DialogContent>
			</Dialog>
		</div>
	);
}
