import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
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
            if (action === 'DECLINED' || action === 'LEAVE') {
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
        <Table>
            <TableBody>
                {members?.map((member: FamilyMember) => (
                    <TableRow key={member.id} className='border'>
                        <TableCell className='px-2'>{member.firstName} {member.lastName}</TableCell>
                        <TableCell className='px-2'>{member.emailId}</TableCell>
                        <TableCell className='px-2'>{member.role}</TableCell>
                        <TableCell className='px-2'>{member.membershipStatus}</TableCell>
                        {(member.membershipStatus === 'PENDING' && member.id === user.id) && (
                            <TableCell className="flex gap-2">
                                <button onClick={() => acceptInvite(member?.id)} className="bg-green-500 px-4 py-2 rounded-md text-white">Accept</button>
                                <button onClick={() => removeUserFromFamily(member?.id, 'DECLINE')} className="bg-red-500 px-4 py-2 rounded-md text-white">Decline</button>
                            </TableCell>
                        )}
                        {(user.role === 'ADMIN' && member.membershipStatus === 'ACCEPTED') && (
                            <TableCell className="flex gap-2">
                                {member?.id === user.id ? (
                                    <button onClick={() => removeUserFromFamily(member?.id, 'LEAVE')} className='bg-red-500 px-4 py-2 rounded-md text-white'>Leave</button>
                                ) : (
                                    <button onClick={() => removeUserFromFamily(member?.id, 'REMOVE')} className='bg-red-500 px-4 py-2 rounded-md text-white'>Remove</button>
                                )}
                                {member.id !== user.id && (
                                    <button onClick={() => toggleAdmin(member?.id)} className='bg-blue-500 px-4 py-2 rounded-md text-white'>{member.role === 'ADMIN' ? "Remove Admin" : "Add Admin"}</button>
                                )}
                            </TableCell>
                        )}
                        {(user.role !== 'ADMIN' && user.id === member.id && member.membershipStatus !== 'PENDING') && (
                            <TableCell>
                                <button onClick={() => removeUserFromFamily(member?.id, 'LEAVE')} className='bg-red-500 px-4 py-1 rounded-md text-white'>Leave</button>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default FamilyMembers;
