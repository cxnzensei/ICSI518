"use client";

import HeaderBox from "@/components/HeaderBox"
import FamilyMembers from "@/components/FamilyMembers";
import { useEffect, useState } from "react";
import { getLoggedInUser, request } from "@/lib/utils";
import { CustomJwtPayload, loginResponse } from "@/types";
import { jwtDecode } from "jwt-decode";

const Family = () => {

    const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);
    const [role, setRole] = useState("USER");
    // const [family, setFamily] = useState<FamilyMember[]>([]);

    const [userMessage, setUserMessage] = useState("nothing")
    const [adminMessage, setAdminMessage] = useState("nothing")

    useEffect(() => {
        const user = getLoggedInUser();
        setLoggedInUser(user);

        request('GET', '/messages', {}).then((response) => {
            setUserMessage(response.data)
        }).catch((e) => {
            console.error(e)
        })

        request('GET', '/admin', {}).then((response) => {
            setAdminMessage(response.data)
        }).catch((e) => {
            console.error(e.response.data.message)
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
                <div>{userMessage}</div>
                {role === 'ADMIN' && <div>{adminMessage}</div>}
            </div>
        </section>
    )
}

export default Family