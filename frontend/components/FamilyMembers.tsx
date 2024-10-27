import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import { FamilyMember, loginResponse } from '@/types';
import { convertToFamilyMember, request, setLoggedInUser } from '@/lib/utils';

type FamilyMembers = {
    members: FamilyMember[];
    setMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>
    setCreatedFamily: React.Dispatch<React.SetStateAction<{ name: string, createdOn: string }>>
    user: loginResponse,
    setUser: React.Dispatch<React.SetStateAction<loginResponse>>
}

const FamilyMembers: React.FC<FamilyMembers> = ({ members, setMembers, setCreatedFamily, user, setUser }) => {

    const removeUserFromFamily = async (id: string, action: string) => {
        try {
            await request("DELETE", "/api/v1/families/remove-user-from-family", { "userId": id });
            const updatedFamily = members?.filter(member => member.id !== id)
            if (action === 'DECLINE' || action === 'LEAVE') {
                console.log("should set to empty")
                setMembers([])
            } else {
                setMembers(updatedFamily)
            }
            if (id === user?.id) {
                setUser({ ...user, role: "USER", familyId: null, membershipStatus: 'NOT_A_MEMBER' });
                setLoggedInUser({ ...user, role: "USER", familyId: null, membershipStatus: 'NOT_A_MEMBER' });
                setCreatedFamily({ name: "", createdOn: "" });
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    const acceptInvite = async (id: string) => {
        try {
            console.log('accepting')
            const response = await request("PUT", `/api/v1/users/accept-invite/${id}`);
            console.log(response?.data)
            console.log("changing membership status")
            setUser({ ...user, membershipStatus: 'ACCEPTED' });
            setLoggedInUser({ ...user, membershipStatus: 'ACCEPTED' });
            const restFamily = members?.filter(member => member.id !== id)
            const acceptedMember = convertToFamilyMember(user);
            acceptedMember.membershipStatus = 'ACCEPTED'
            setMembers([...restFamily, acceptedMember])
        } catch (error: any) {
            console.error(error)
        }
    }

    const toggleAdmin = async (id: string) => {
        try {
            const response = await request("PUT", `/api/v1/families/toggle-admin/${id}`);
            const updatedFamily = members.map(member => {
                if (member.id === id) {
                    return { ...member, role: member.role === 'ADMIN' ? 'USER' : 'ADMIN' };
                }
                return member;
            })
            setMembers(updatedFamily);
        } catch (error: any) {
            console.error(error);
        }
    }

    return (
        <div>
            {members?.map((member: FamilyMember) => (
                <div key={member.id}>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="text-lg">
                                    {member.firstName} {member.lastName} <span className="text-sm">{(member.membershipStatus === 'PENDING' && member.id === user.id) && "(Pending Action)"}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-2">
                                <div>Email: {member.emailId}</div>
                                <div>Role: {member.role}</div>
                                <div>Membership Status: {member.membershipStatus}</div>
                                <div>
                                    {(member.membershipStatus === 'PENDING' && member.id === user.id) && (
                                        <div className="flex gap-2">
                                            <button onClick={() => acceptInvite(member?.id)} className="bg-green-500 px-4 py-2 rounded-md text-white">Accept</button>
                                            <button onClick={() => removeUserFromFamily(member?.id, 'DECLINE')} className="bg-red-500 px-4 py-2 rounded-md text-white">Decline</button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {(user.role === 'ADMIN' && member.membershipStatus === 'ACCEPTED') && (
                                        <div className="flex gap-2">
                                            {member.id !== user.id && (
                                                <button onClick={() => toggleAdmin(member?.id)} className='bg-blue-500 px-4 py-2 rounded-md text-white'>{member.role === 'ADMIN' ? "Remove Admin" : "Add Admin"}</button>
                                            )}
                                            {member?.id === user.id ? (
                                                <button onClick={() => removeUserFromFamily(member?.id, 'LEAVE')} className='bg-red-500 px-4 py-2 rounded-md text-white'>Leave</button>
                                            ) : (
                                                <button onClick={() => removeUserFromFamily(member?.id, 'REMOVE')} className='bg-red-500 px-4 py-2 rounded-md text-white'>Remove</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {(user.role !== 'ADMIN' && user.id === member.id && member.membershipStatus !== 'PENDING') && (
                                        <div>
                                            <button onClick={() => removeUserFromFamily(member?.id, 'LEAVE')} className='bg-red-500 px-4 py-1 rounded-md text-white'>Leave</button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {(user.role === 'ADMIN' && member.role === 'USER') && (
                                        <div className="italic">Financial Settings (Admin Privilege)</div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ))
            }
        </div >
    );
};

export default FamilyMembers;
