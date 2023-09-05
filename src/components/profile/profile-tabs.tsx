import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileAccountForm from "./profile-account-form";
import ProfilePasswordForm from "./profile-password-form";
import { useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext";

export default function ProfileTabs() {
	const { error } = useContext(AuthContext);

	return (
		<Tabs defaultValue="account">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							{error ? (
								<span className="text-md font-semibold text-red-500">
									{error}
								</span>
							) : (
								"Make changes to your account here. Click save when you're done. After saving, you'll be logged out."
							)}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<ProfileAccountForm />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Change your password here. After saving, you'll be
							logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<ProfilePasswordForm />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
