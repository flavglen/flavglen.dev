"use client"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu"
import LoginButton from "./login"
import Link from "next/link"

export const TopMenu = () => {
    return (
        <NavigationMenu className="text-black mr-5">
            <NavigationMenuList className="gap-8">
                <NavigationMenuItem className="font-bold">
                    <Link href="/" passHref>
                        Home
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="font-bold" >
                    <Link href="/view-expense" passHref>
                    View Expense
                    </Link>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                    <LoginButton />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

