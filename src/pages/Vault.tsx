import Header from "@/components/vault/header";
import { VaultDataTable } from "@/components/vault/vault-data-table";
import { columns } from "@/components/vault/vault-column";
import Footer from "@/components/ui/footer";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";
import { VaultContext } from "@/components/context/VaultContext";
import { Vault } from "@/lib/models/vault";

export default function Vault() {
	const { vault } = useContext(VaultContext);
	return (
		<>
			<Header />
			<main className="container">
				<div className="mb-4">
					<p className="text-2xl font-semibold leading-none tracking-tight mb-1">
						My vault
					</p>
					<p className="text-sm text-muted-foreground mb-2">
						Your personal vault is entierely encrypted. You are the
						only one able to access to it.
					</p>
					<Separator />
				</div>
				<VaultDataTable columns={columns} data={vault} />
			</main>
			<Footer />
		</>
	);
}
