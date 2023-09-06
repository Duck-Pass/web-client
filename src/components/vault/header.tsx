import Logo from "@/assets/ducky-round.png";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DuckUserIcon from "@/assets/duck-user-icon.png";

export default function Header() {
	const { logout } = useContext(AuthContext);
	return (
		<header className="w-full z-30 transition duration-300 ease-in-out bg-[#022837] shadow-lg mb-5">
			<div className="max-w-6xl mx-auto px-5">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Site branding */}
					<div className="flex items-center shrink-0 mr- space-x-4">
						<Link to="/">
							{/* <Logo /> */}
							<img
								className="w-12 h-12"
								src={Logo}
								alt="DuckPass Logo"
							/>
						</Link>
						<Link to="/vault">
							<Button
								variant="ghost"
								className="text-white font-semibold hover:text-gray-800 hover:cursor-pointer"
							>
								Vault
							</Button>
						</Link>
					</div>

					{/* Desktop navigation */}
					<nav className="flex grow justify-end items-center">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar>
									<AvatarImage src={DuckUserIcon} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<Link to="/profile">
									<DropdownMenuItem className="hover:cursor-pointer">
										Profile
									</DropdownMenuItem>
								</Link>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="hover:cursor-pointer"
									onClick={() => logout()}
								>
									<LogOut className="text-red-500 w-4 mr-2" />
									<span className="text-red-500">
										Log out
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>
			</div>
		</header>
	);
}
