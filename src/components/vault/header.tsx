import Logo from '@/assets/ducky-round.png'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full z-30 transition duration-300 ease-in-out bg-[#022837] shadow-lg mb-5">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Link to="/">
              {/* <Logo /> */}
              <img className="w-12 h-12" src={Logo} alt="DuckPass Logo" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="flex grow justify-end items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer">
                  <LogOut className="text-red-500 w-4 mr-2" />
                  <span className="text-red-500">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

        </div>
      </div>
    </header>
  )
}