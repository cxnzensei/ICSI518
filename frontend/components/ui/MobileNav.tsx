"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer";

const MobileNav = ({ user }: MobileNavProps) => {

    const pathName = usePathname()

    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <Image
                        src="/icons/hamburger.svg"
                        width={30}
                        height={30}
                        alt="menu"
                        className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
                    <Link className="cursor-pointer flex items-center gap-1 px-4" href="/">
                        <Image
                            src="/icons/logo.svg"
                            width={72}
                            height={72}
                            alt="WealthWise logo"
                        />
                        <h1 className="text-26 font-bold text-black-1">WealthWise</h1>
                    </Link>
                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-4 flex-col gap-6 pt-16 text-white">
                                {sidebarLinks.map((item) => {
                                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
                                    return (
                                        <SheetClose asChild key={item.route}>
                                            <Link
                                                className={cn('mobilenav-sheet_close w-full', {
                                                    'bg-bankGradient': isActive
                                                })}
                                                href={item.route}
                                                key={item.label}
                                            >
                                                <Image
                                                    src={item.imgURL}
                                                    alt={item.label}
                                                    width={20}
                                                    height={20}
                                                    className={cn({
                                                        'brightness-[3] invert-0': isActive
                                                    })}
                                                />
                                                <p className={cn
                                                    ("text-16 font-semibold text-black-2", {
                                                        "!text-white": isActive
                                                    })}>
                                                    {item.label}
                                                </p>
                                            </Link>
                                        </SheetClose>
                                    )
                                })}
                                USER
                            </nav>
                        </SheetClose>
                        <Footer user={user} type='mobile'/>
                    </div>
                </SheetContent>
            </Sheet>

        </section>
    )
}

export default MobileNav