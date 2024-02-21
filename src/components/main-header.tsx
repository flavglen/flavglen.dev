import { TopMenu } from "@/components/top-menu";
import { Logo } from "@/components/logo";

export const MainHeader  = () => {
    return (
        <header className="w-full flex justify-between sticky top-0 z-50 bg-white">
            <Logo />
            <TopMenu />
        </header>
    )
}


