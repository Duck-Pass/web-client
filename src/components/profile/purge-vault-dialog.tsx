import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { VaultContext } from "../context/VaultContext";
import { useContext } from "react";
import { VaultManager } from "@/lib/models/vault";

export default function PurgeVaultDialog() {
	const { updateVault } = useContext(VaultContext);
	return (
		<div className="w-full">
			<AlertDialog>
				<AlertDialogTrigger className="w-full" asChild>
					<Button variant="destructive">Purge Vault</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure to purge your vault?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete your vault and remove your data from our
							servers.{" "}
							<span className="font-bold">
								We won't be able to recover your data
							</span>
							. You'll lose all your saved credentials.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								VaultManager.reset();
								updateVault(
									VaultManager.getInstance().getVault(),
								);
								VaultManager.getInstance().sync();
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
