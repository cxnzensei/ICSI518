"use client";

import HeaderBox from "@/components/HeaderBox"
import FamilyMembers from "@/components/FamilyMembers";
import { useEffect, useState } from "react";
import { getLoggedInUser, setLoggedInUser, request, convertToFamilyMember } from "@/lib/utils";
import { FamilyMember, loginResponse } from "@/types";

const Family = () => {

    const [user, setUser] = useState<loginResponse>({
        emailId: "",
        firstName: "",
        id: "",
        lastName: "",
        membershipStatus: "",
        role: "",
        familyId: ""
    });
    const [family, setFamily] = useState<FamilyMember[]>([]);
    const [createdFamily, setCreatedFamily] = useState({ name: "", createdOn: "" });
    const [emailSearch, setEmailSearch] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [createAFamilyBoolean, setcreateAFamilyBoolean] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            const loggedInUser = getLoggedInUser();
            setUser(getLoggedInUser)

            const userResponse = await request("GET", `/api/v1/users/${loggedInUser?.id}`);
            setLoggedInUser(userResponse?.data)

            if (loggedInUser?.familyId) {
                const response = (await request('GET', `/api/v1/families/${loggedInUser?.familyId}`)).data;
                setCreatedFamily({ name: response?.familyName, createdOn: response?.creationDate });
                setFamily(response?.members)
            }
        }
        initialize()
    }, [])

    const createAFamily = async (familyName: string) => {
        try {
            const res = await request("POST", "/api/v1/families/create", { "familyName": familyName });
            setCreatedFamily({ name: res?.data?.familyName, createdOn: res?.data?.creationDate });
            const userRes = await request("GET", `/api/v1/users/${user.id}`);
            setUser(userRes?.data)
            setLoggedInUser(userRes?.data)
            setFamily([...family, convertToFamilyMember(userRes?.data)])
            setFamilyName('')
        } catch (error: any) {
            console.error(error);
        }
    }

    const addUserToFamily = async (userEmail: string) => {
        try {
            const res = await request("POST", "/api/v1/families/add-user-to-family", { "userEmail": userEmail, "familyId": user?.familyId });
            const updatedFamily = [...family, res?.data]
            updatedFamily.sort((a, b) => a.firstName.localeCompare(b.firstName));
            setFamily(updatedFamily);
            setEmailSearch('')
        } catch (error: any) {
            console.error(error)
        }
    }

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome to your family page,"
                        user={user?.firstName || 'Guest'}
                        subtext="Manage your family here. Add users by entering their email ID."
                    />
                    {user.familyId ? (
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="bold text-xl uppercase">
                                    {createdFamily.name},
                                </div>
                                <div className="italic">
                                    since {new Date(createdFamily.createdOn).toDateString()}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input type="search" value={emailSearch} onChange={(e) => setEmailSearch(e.target.value)} placeholder="Enter email ID here" className="border p-2 rounded-lg outline-none"></input>
                                <button onClick={() => addUserToFamily(emailSearch)} disabled={emailSearch.length < 7} className={`${emailSearch.length < 7 ? "bg-gray-500" : "bg-bankGradient hover:scale-105 duration-300 ease-out hover:text-black-1 cursor-pointer"} w-fit px-4 py-2 text-white rounded-lg`}>
                                    Request
                                </button>
                            </div>
                            <hr />
                        </div>
                    ) : (
                        <div>
                            <div>
                                <span>
                                    You are not a part of any family.&nbsp;
                                </span>
                                <span onClick={() => setcreateAFamilyBoolean(true)} className="font-bold hover:underline duration-300 ease-out cursor-pointer">
                                    Create one
                                </span>
                            </div>
                            {createAFamilyBoolean && (
                                <div className="flex gap-2 mt-5">
                                    <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Enter the name" className="border p-2 rounded-lg outline-none" />
                                    <button onClick={() => createAFamily(familyName)} disabled={familyName.length < 3} className={`${familyName.length < 3 ? "bg-gray-500" : "bg-bankGradient hover:scale-105 duration-300 ease-out hover:text-black-1 cursor-pointer"} w-fit px-4 py-2 text-white rounded-lg`}>
                                        Create
                                    </button>
                                    <button onClick={() => setcreateAFamilyBoolean(false)}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <FamilyMembers members={family} setMembers={setFamily} setCreatedFamily={setCreatedFamily} user={user} setUser={setUser} />
                </header>
            </div>
        </section>
    )
}

export default Family