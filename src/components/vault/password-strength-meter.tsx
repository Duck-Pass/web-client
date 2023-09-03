import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type PasswordProps = {
	password: string;
};

export default function PasswordStrengthMeter({ password }: PasswordProps) {
	const [result, setResult] = useState<zxcvbn.ZXCVBNResult>(zxcvbn(password));

	const getPasswordScore = (password: string) => {
		return zxcvbn(password);
	};

	const getSuggestion = (suggestions: string[]) => {
		return suggestions.map(sugg => <p key={sugg}>{sugg}</p>);
	};

	useEffect(() => {
		setResult(getPasswordScore(password));
	}, [password]);

	const passwordProps = () => {
		switch (result.score) {
			case 0:
				return {
					color: ["#94a3b8", "#64748b"],
					label: "Please don't use it",
				};
			case 1:
				return {
					color: ["#f87171", "#dc2626"],
					label: "Queak...",
				};
			case 2:
				return {
					color: ["#facc15", "#f59e0b"],
					label: "Not that terrible",
				};
			case 3:
				return {
					color: ["#a3e635", "#10b981"],
					label: "You'll make it",
				};
			case 4:
				return {
					color: ["#10b981", "#059669"],
					label: "Unbreakable!",
				};
			default: {
				return {
					color: ["#e2e8f0", "#e2e8f0"],
					label: "-",
				};
			}
		}
	};

	return (
		<>
			<div className="grid grid-cols-5 items-center">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Info className="col-span-1 hover:cursor-pointer justify-self-center" />
						</TooltipTrigger>
						<TooltipContent>
							<span>
								{result.feedback.suggestions.length > 0
									? getSuggestion(result.feedback.suggestions)
									: "No advice!"}
							</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<div className="h-2 col-span-4 rounded-full bg-slate-200">
					<div
						className="h-full rounded-full transition-all"
						style={{
							width: `${(result.score * 100) / 4}%`,
							background: `linear-gradient(to right, ${
								passwordProps().color[0]
							}, ${passwordProps().color[1]})`,
						}}
					></div>
					<p
						className="text-right text-sm"
						style={{ color: passwordProps().color[1] }}
					>
						{passwordProps().label}
					</p>
				</div>
			</div>
		</>
	);
}
