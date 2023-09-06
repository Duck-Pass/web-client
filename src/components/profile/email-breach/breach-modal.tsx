import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BreachesDataTable } from "@/components/profile/email-breach/breach-data-table";
import { columns } from "@/components/profile/email-breach/breach-column";
import { useState } from "react";
import env from "@/env.json";

export default function BreachesModal() {
	const [data, setData] = useState(null);

	async function handleClick() {
		const token = localStorage.getItem("token");
		const response = await fetch(env.api + "/hibp_breaches?", {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		}).catch(() => {
			return;
		});

		if (!response) {
			return;
		}

		if (!response.ok) {
			return;
		}

		const breaches = await response.json();
		setData(breaches);
	}

	return (
		<div className="w-full">
			<Dialog>
				<DialogTrigger asChild className="w-full">
					<Button
						onClick={() => {
							handleClick();
						}}
					>
						Check for master email breaches
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-5xl">
					{data ? (
						<BreachesDataTable columns={columns} data={data} />
					) : (
						"Loading ..."
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
