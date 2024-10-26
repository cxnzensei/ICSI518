import Image from 'next/image';
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { FamilyMember } from '@/types';

type FamilyMembers = {
    members: FamilyMember[] | null;
    setMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>
}

const FamilyMembers: React.FC<FamilyMembers> = ({ members, setMembers }) => {

    const removeUserFromFamily = (id: string) => {
        const updatedFamily = members?.filter(member => member.id !== id) || []
        setMembers(updatedFamily);
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
                        <TableCell>
                            <button onClick={() => removeUserFromFamily(member?.id)} className='bg-red-500 px-4 py-2 rounded-md text-white'>Remove</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default FamilyMembers;
