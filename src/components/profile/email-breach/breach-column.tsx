import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Breach = {
	Name: string;
	Domain: string;
	BreachDate: string;
	DataClasses: string[];
};

export const columns: ColumnDef<Breach>[] = [
	{
		accessorKey: "Name",
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
		cell: ({ row }) => {
			return (
				<a
					href={"https://www." + row.getValue("Domain")}
					target="_blank"
					className="text-right font-medium"
				>
					{row.getValue("Name")}
				</a>
			);
		},
	},
	{
		accessorKey: "Domain",
		header: "Domain",
	},
	{
		accessorKey: "DataClasses",
		header: "Breached information",
	},
	{
		accessorKey: "BreachDate",
		header: "Breach date",
	},
];
