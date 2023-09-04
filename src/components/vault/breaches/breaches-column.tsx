import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Breach = {
	Name: string;
	Title: string;
	Domain: string;
	BreachDate: string;
	AddedDate: string;
	ModifiedDate: string;
	PwnCount: number;
	Description: string;
	LogoPath: string;
	DataClasses: string[];
	IsVerified: boolean;
	IsFabricated: boolean;
	IsSensitive: boolean;
	IsRetired: boolean;
	IsSpamList: boolean;
	IsMalware: boolean;
};

export const columns: ColumnDef<Breach>[] = [
	{
		accessorKey: "Name",
		header: "Name",
	},
	{
		accessorKey: "Title",
		header: "Title",
	},
	{
		accessorKey: "Domain",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Domain
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "BreachDate",
		header: "Breach date",
	},
	{
		accessorKey: "AddedDate",
		header: "Added date",
	},
	{
		accessorKey: "ModifiedDate",
		header: "Modified date",
	},
	{
		accessorKey: "PwnCount",
		header: "PWN Count",
	},
	{
		accessorKey: "Description",
		header: "Description",
	},
	{
		accessorKey: "LogoPath",
		header: "Logo Path",
	},
	{
		accessorKey: "DataClasses",
		header: "Breached information",
	},
	{
		accessorKey: "IsVerified",
		header: "Is verified",
	},
	{
		accessorKey: "IsFabricated",
		header: "Is fabricated",
	},
	{
		accessorKey: "IsSensitive",
		header: "Is sensitive",
	},
	{
		accessorKey: "IsRetired",
		header: "Is retired",
	},
	{
		accessorKey: "IsSpamList",
		header: "Is spam list",
	},
	{
		accessorKey: "IsMalware",
		header: "Is malware",
	},
];
