import Header from "@/components/vault/header";
import Footer from "@/components/ui/footer";
import ProfileTabs from "@/components/profile/profile-tabs";
import Enable2FAModal from "@/components/profile/enable-2fa-modal";
import PurgeVaultDialog from "@/components/profile/purge-vault-dialog";
import DeleteAccountDialog from "@/components/profile/delete-account-dialog";

export default function Profile() {
	return (
		<>
			<Header />
			<main className="container p-0 flex flex-col align-center justify-center space-y-4 w-[400px] mb-4">
				<Enable2FAModal />
				<ProfileTabs />

				<div className="p-4 rounded-md border border-red-500 flex flex-col space-y-2">
					<p className="text-2xl text-red-500 font-semibold leading-none tracking-tight mb-2">
						Danger zone
					</p>
					<div className="flex flex-row space-x-4 items-center justify-center">
						<PurgeVaultDialog />
						<DeleteAccountDialog />
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
