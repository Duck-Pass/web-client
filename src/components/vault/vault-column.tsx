import { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	MoreHorizontal,
	User,
	Lock,
	Clock,
	Trash,
	Pen,
	Star,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import copy from "copy-to-clipboard";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { EditPasswordForm } from "./edit-password-form";
import { Credential, VaultManager } from "@/lib/models/vault";
import { VaultContext } from "../context/VaultContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import totp from "totp-generator";

export const columns: ColumnDef<Credential>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "username",
		header: "Username",
	},
	{
		accessorKey: "password",
		header: "Password",
	},
	{
		accessorKey: "authKey",
		header: "Authenticator Key (TOTP)",
	},
	{
		accessorKey: "website",
		header: "Website",
	},
	{
		accessorKey: "note",
		header: "Note",
	},
	{
		accessorKey: "favorite",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Favorite
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			let fav: boolean = row.getValue("favorite") ?? false;
			const { updateVault } = useContext(VaultContext);
			return (
				<Star
					onClick={() => {
						fav = !fav;
						const id: string = row.getValue("id");
						const manager = VaultManager.getInstance();
						manager.editItem({
							id: id,
							name: row.getValue("name"),
							username: row.getValue("username"),
							password: row.getValue("password"),
							website: row.getValue("website"),
							authKey: row.getValue("authKey"),
							note: row.getValue("note"),
							favorite: fav,
							breached: row.getValue("breached"),
						});
						updateVault(manager.getVault());
					}}
					className="mx-4 font-medium hover:cursor-pointer"
					fill={`${fav ? "primary" : "none"}`}
				/>
			);
		},
	},
	{
		accessorKey: "breached",
		header: "Breached",
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const cred = row.original;
			const { updateVault, checkBreach, breachLimit } =
				useContext(VaultContext);
			const { toast } = useToast();

			async function checkForBreach(password: string) {
				// Check the breach limit rate to avoid spamming HIBP API
				if (!breachLimit) {
					const numberExposition = await checkBreach({
						password: password,
					});

					let breached = false;

					if (numberExposition !== 0) {
						breached = true;
						toast({
							title: "Warning",
							variant: "destructive",
							description:
								"Your password was exposed " +
								numberExposition +
								" times. Maybe change it!",
						});
					} else {
						toast({
							description:
								"Your password doesn't seem to be exposed.",
						});
					}

					// Update the password properties
					const id: string = row.getValue("id");
					const manager = VaultManager.getInstance();
					manager.editItem({
						id: id,
						name: row.getValue("name"),
						username: row.getValue("username"),
						password: row.getValue("password"),
						website: row.getValue("website"),
						authKey: row.getValue("authKey"),
						note: row.getValue("note"),
						favorite: row.getValue("favorite"),
						breached: breached,
					});
					updateVault(manager.getVault());
				}
			}

			return (
				<>
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem className="hover:cursor-pointer p-0">
									<DialogTrigger
										asChild
										className="w-full text-left"
									>
										<Button variant="ghost">
											<Pen className="text-gray-500 mr-2 w-4" />
											Edit
										</Button>
									</DialogTrigger>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="hover:cursor-pointer"
									onClick={() =>
										checkForBreach(cred.password)
									}
									disabled={breachLimit}
								>
									<CheckCircle className="text-gray-500 mr-2 w-4" />
									Verify
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="hover:cursor-pointer"
									onClick={() => copy(cred.username)}
								>
									<User className="text-gray-500 mr-2 w-4" />
									Copy username
								</DropdownMenuItem>
								<DropdownMenuItem
									className="hover:cursor-pointer"
									onClick={() => copy(cred.password)}
								>
									<Lock className="text-gray-500 mr-2 w-4" />
									Copy password
								</DropdownMenuItem>
								<DropdownMenuItem
									className="hover:cursor-pointer"
									onClick={() => {
										if (!cred.authKey) return;
										copy(totp(cred.authKey));
									}}
								>
									<Clock className="text-gray-500 mr-2 w-4" />
									Copy TOTP
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="hover:cursor-pointer"
									onClick={async () => {
										const id = cred.id;
										await VaultManager.getInstance().removeItem(
											id,
										);
										updateVault(
											VaultManager.getInstance().getVault(),
										);
									}}
								>
									<Trash className="text-red-500 mr-2 w-4" />
									<span className="text-red-500">Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit your password</DialogTitle>
							</DialogHeader>
							<EditPasswordForm cred={cred} />
						</DialogContent>
					</Dialog>
				</>
			);
		},
	},
];
