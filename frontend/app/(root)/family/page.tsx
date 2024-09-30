"use client";

import HeaderBox from "@/components/HeaderBox"
import FamilyMembers from "@/components/FamilyMembers";
import { useEffect, useState } from "react";
import { getLoggedInUser, request } from "@/lib/utils";

const Family = () => {

    const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);
    const [family, setFamily] = useState<FamilyMember[]>([]);

    useEffect(() => {
        const user = getLoggedInUser()
        setLoggedInUser(user);

        request("GET", "https://randomuser.me/api/?results=7&inc=name,email,picture&noinfo")
            .then(res => {
                setFamily(res.data.results)
            }).catch(error => {
                console.error(error)
            })

    }, [])

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome to your family page,"
                        user={loggedInUser?.firstName || 'Guest'}
                        subtext="Manage your family here. Add users by entering their email ID."
                    />
                    <div className="bg-bankGradient w-fit px-4 py-2 text-white cursor-pointer 
                                    hover:scale-105 duration-300 ease-out hover:text-black-1 
                                    rounded-lg">
                        + Add a Member
                    </div>
                    <hr />
                    <FamilyMembers members={family} setMembers={setFamily} />
                </header>
            </div>
        </section>
    )
}

export default Family