"use client";

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer";
import { SidebarProps } from "@/types";

const Sidebar = ({ user }: SidebarProps) => {

    const pathName = usePathname()

    return (
        <section className="sidebar">
            <nav className="flex flex-col gap-4">
                <Link className="mb-12 sm:mx-3 xl:mx-0 cursor-pointer flex items-center gap-2" href="/">
                    <Image
                        src="/icons/logo.svg"
                        width={72}
                        height={72}
                        alt="WealthWise logo"
                        className="size-[50px] max-xl:size-14"
                    />
                    <h1 className="sidebar-logo">WealthWise</h1>
                </Link>
                {sidebarLinks.map((item) => {
                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
                    return (
                        <Link
                            className={cn('sidebar-link', {
                                'bg-bankGradient': isActive
                            })}
                            href={item.route}
                            key={item.label}
                        >
                            <div className="relative size-6">
                                <Image
                                    src={item.imgURL}
                                    alt={item.label}
                                    fill
                                    className={cn({
                                        'brightness-[3] invert-0': isActive
                                    })}
                                />
                            </div>
                            <p className={cn
                                ("sidebar-label", {
                                    "!text-white": isActive
                                })}>
                                {item.label}
                            </p>
                        </Link>
                    )
                })}
                USER
            </nav>
            <Footer user={user} />
        </section>
    )
}

export default Sidebar