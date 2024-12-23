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
            const updatedFamily = members?.filter(member => member.userId !== id)
            if (action === 'DECLINE' || action === 'LEAVE') {
                setMembers([])
            } else {
                setMembers(updatedFamily)
            }
            if (id === user?.userId) {
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
            await request("PUT", `/api/v1/users/accept-invite/${id}`);
            setUser({ ...user, membershipStatus: 'ACCEPTED' });
            setLoggedInUser({ ...user, membershipStatus: 'ACCEPTED' });
            const updatedMembers = members.map(member =>
                member.userId === id ? { ...member, membershipStatus: 'ACCEPTED' } : member
            );
            setMembers(updatedMembers);
        } catch (error: any) {
            console.error(error);
        }
    };

    const toggleAdmin = async (id: string) => {
        try {
            await request("PUT", `/api/v1/families/toggle-admin/${id}`);
            const updatedFamily = members.map(member => {
                if (member.userId === id) {
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
                <div key={member.userId}>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="text-lg">
                                    {member.firstName} {member.lastName} <span className="text-sm">{(member.membershipStatus === 'PENDING' && member?.userId === user?.userId) && "(Pending Action)"}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <div>Email: {member.emailId}</div>
                                    <div>Role: {member.role}</div>
                                    <div>Membership Status: {member.membershipStatus}</div>
                                </div>
                                {(member.membershipStatus === 'PENDING' && member.userId === user?.userId) && (
                                    <div className="flex gap-2">
                                        <button onClick={() => acceptInvite(member?.userId)} className="bg-green-500 px-4 py-2 rounded-md text-white">Accept</button>
                                        <button onClick={() => removeUserFromFamily(member?.userId, 'DECLINE')} className="bg-red-500 px-4 py-2 rounded-md text-white">Decline</button>
                                    </div>
                                )}
                                {(user.role === 'ADMIN' && member.membershipStatus === 'ACCEPTED') && (
                                    <div className="flex gap-2">
                                        {member.userId !== user?.userId && (
                                            <button onClick={() => toggleAdmin(member?.userId)} className='bg-blue-500 px-4 py-2 rounded-md text-white'>{member.role === 'ADMIN' ? "Remove Admin" : "Add Admin"}</button>
                                        )}
                                        {member?.userId === user?.userId ? (
                                            <button onClick={() => removeUserFromFamily(member?.userId, 'LEAVE')} className='bg-red-500 px-4 py-2 rounded-md text-white'>Leave</button>
                                        ) : (
                                            <button onClick={() => removeUserFromFamily(member?.userId, 'REMOVE')} className='bg-red-500 px-4 py-2 rounded-md text-white'>Remove</button>
                                        )}
                                    </div>
                                )}
                                {(user.role !== 'ADMIN' && user.userId === member.userId && member.membershipStatus !== 'PENDING') && (
                                    <div>
                                        <button onClick={() => removeUserFromFamily(member?.userId, 'LEAVE')} className='bg-red-500 px-4 py-1 rounded-md text-white'>Leave</button>
                                    </div>
                                )}
                                {(user.role === 'ADMIN' && member.role === 'USER' && member.membershipStatus === 'ACCEPTED') && (
                                    <div className="italic">Financial Settings (Admin Privilege over a user)</div>
                                )}
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
