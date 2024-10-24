"use client";

import HeaderBox from "@/components/HeaderBox"
import FamilyMembers from "@/components/FamilyMembers";
import { useEffect, useState } from "react";
import { getLoggedInUser, request } from "@/lib/utils";

const Family = () => {

    const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);
    // const [family, setFamily] = useState<FamilyMember[]>([]);

    const [message, setMessage] = useState("nothing")

    useEffect(() => {
        const user = getLoggedInUser()
        setLoggedInUser(user);

        request('GET', '/messages', {}).then((response) => {
            console.log(response)
            setMessage(response.data)
        }).catch((e) => {
            console.error(e)
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
                </header>
                <div>{message}</div>
            </div>
        </section>
    )
}

export default Family