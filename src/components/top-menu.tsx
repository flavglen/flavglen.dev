"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu"

export const TopMenu = () => {
    return (
        <NavigationMenu className="text-black mr-5">
            <NavigationMenuList className="gap-8">
                <NavigationMenuItem className="font-bold">
                    Home
                </NavigationMenuItem>
                <NavigationMenuItem className="font-bold">
                    Timeline
                </NavigationMenuItem>
                <NavigationMenuItem className="font-bold">
                    Projects
                </NavigationMenuItem>
                <NavigationMenuItem className="font-bold">
                    Blog
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

