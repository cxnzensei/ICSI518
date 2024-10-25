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
        const updatedFamily = members?.filter(member => member.email !== id) || []
        setMembers(updatedFamily);
    }

    return (
        <Table>
            <TableBody>
                {members?.map((member: FamilyMember) => (
                    <TableRow key={member.email} className='border'>
                        <TableCell className='px-2'>
                            <Image className='rounded-full p-1 border hover:scale-105 duration-300 ease-out bg-gray-400 hover:bg-white hover:border-black-1' src={member.picture.large} alt={member.email} width={100} height={100} />
                        </TableCell>
                        <TableCell className='px-2'>
                            {member.name.title} {member.name.first} {member.name.last}
                        </TableCell>
                        <TableCell className='px-2'>{member.email}</TableCell>
                        <TableCell>
                            <button onClick={() => removeUserFromFamily(member?.email)} className='bg-red-500 px-4 py-2 rounded-md text-white'>Remove</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default FamilyMembers;
