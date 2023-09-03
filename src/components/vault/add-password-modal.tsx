import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AddPasswordForm } from "./add-password-form";
import { useState } from "react";

export default function AddPasswordModal() {
	const [open, setOpen] = useState<boolean>();
	return (
		<div className="w-full">
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger asChild className="w-full">
					<Button>Add password</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="sm:max-w-[425px]">
					<AlertDialogHeader>
						<AlertDialogTitle>Add a new password</AlertDialogTitle>
						<AlertDialogDescription>
							Type a new password here. Click save when you're
							done.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AddPasswordForm
						openOnChange={(open: boolean) => setOpen(open)}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
