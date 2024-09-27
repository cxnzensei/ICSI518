import Image from 'next/image';

type FamilyMembers = {
    members: FamilyMember[];
}

const FamilyMembers = ({ members }: FamilyMembers) => {
    return (
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
            {members.map((member: FamilyMember) => (
                <div key={member.email} className=' flex flex-col justify-between gap-3 border rounded-md p-2'>
                    <div className='flex items-center gap-2'>
                        <Image className='rounded-full p-1 border hover:scale-105 duration-300 ease-out bg-gray-400 hover:bg-white hover:border-black-1' src={member.picture.large} alt={member.email} width={100} height={100} />
                        <div className='flex flex-col text-sm'>
                            <div className='text-sm'>{member.name.title} {member.name.first} {member.name.last}</div>
                            <div className='text-xs'>{member.email}</div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default FamilyMembers;
