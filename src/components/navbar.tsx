import {cn} from "@/lib/utils";
import React from "react";

export function MainNavBar({ className, ...props}: React.HtmlHTMLAttributes<HTMLElement>) {
    return (
        <div className="flex">
            <nav className={cn('flex items-center justify-start space-x-4 lg:space-x-6', className)} {...props}>
                <a className="text-white text-sm font-medium transition-colors hover:text-gray-300" href="#">Home</a>
                <a className="text-white text-sm font-medium transition-colors hover:text-gray-300" href="#">Vault</a>
            </nav>
            <div className="ml-auto">
                <a className="text-white text-sm font-medium transition-colors hover:text-gray-300" href="#">Login</a>
            </div>
        </div>
    )
}