"use client";

import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/utils";
import { loginResponse } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);

  useEffect(() => {
    const user = getLoggedInUser();
    setLoggedInUser(user);
  }, [])

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedInUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src="/icons/logo.svg"
            width={50}
            height={50}
            alt="menu icon"
          />
          <div>
            <MobileNav user={loggedInUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
