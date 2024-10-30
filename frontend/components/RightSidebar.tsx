import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BankCard from './BankCard'
import { RightSidebarProps } from '@/types'
import { request } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
 } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
  

const RightSidebar = ({ user, banks, onBankAccountAdded }: RightSidebarProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [appwriteItemId, setAppwriteItemId] = useState('');
    const [availableBalance, setAvailableBalance] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');
    const [officialName, setOfficialName] = useState('');
    const [mask, setMask] = useState('1111');
    const [institutionId, setInstitutionId] = useState('');
    const [type, setType] = useState('');
    const [subtype, setSubtype] = useState('');
    const [sharableId, setSharableId] = useState('');

    const addBankAccount = async () => {
        const bankAccountDetails = {
            name,
            appwriteItemId,
            availableBalance,
            currentBalance,
            officialName,
            mask,
            institutionId,
            type,
            subtype,
            sharableId
        }
        try {
            const response = await request('POST', `/api/v1/accounts/${user?.userId}`, bankAccountDetails);
            onBankAccountAdded();
          } catch (error) {
            console.error('Failed to add account:', error);
        }
        setOpen(false);
    }

    return (
        <aside className='right-sidebar'>
            <section className='flex flex-col pb-8'>
                <div className='profile-banner' />
                <div className='profile'>
                    <div className='profile-img'>
                        <span className='text-5xl font-bold text-green-500'>{user?.firstName[0]}</span>
                    </div>
                    <div className='profile-details'>
                        <h1 className='profile-name'>
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className='profile-email'>
                            {user?.emailId}
                        </p>
                    </div>
                </div>
            </section>
            <section className='banks'>
                <div className='flex w-full justify-between'>
                    <h2 className='header-2'>My Banks</h2>
                    <Link href={'/'} className='flex gap-2'>
                        <Image
                            src={'/icons/plus.svg'}
                            width={20}
                            height={20}
                            alt='plus'
                        />
                        
                        
                        <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                        <h2 className='text-14 font-semibold text-gray-600' onClick={() => setOpen(true)}>
                            Add Bank
                        </h2>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                            <DialogTitle>Enter Bank Account Details</DialogTitle>
                            <DialogDescription>
                                Add an account
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="accountName" className="text-right">
                                Account Name
                                </Label>
                                <Input
                                id="name"
                                value={name} onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="appwriteItemId" className="text-right">
                                appwrite Item ID
                                </Label>
                                <Input
                                id="appwriteItemId"
                                value={appwriteItemId} onChange={(e) => setAppwriteItemId(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="availableBalance" className="text-right">
                                Available Balance
                                </Label>
                                <Input
                                id="availableBalance"
                                value={availableBalance} onChange={(e) => setAvailableBalance(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="currentBalance" className="text-right">
                                Current Balance
                                </Label>
                                <Input
                                id="currentBalance"
                                value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="officialName" className="text-right">
                                Official Name
                                </Label>
                                <Input
                                id="officialName"
                                value={officialName} onChange={(e) => setOfficialName(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="mask" className="text-right">
                                Mask
                                </Label>
                                <Input
                                id="mask"
                                value={mask} onChange={(e) => setMask(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="institutionId" className="text-right">
                                Institution Id
                                </Label>
                                <Input
                                id="institutionId"
                                value={institutionId} onChange={(e) => setInstitutionId(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                Type
                                </Label>
                                <Input
                                id="type"
                                value={type} onChange={(e) => setType(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subtype" className="text-right">
                                Subtype
                                </Label>
                                <Input
                                id="subtype"
                                value={subtype} onChange={(e) => setSubtype(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sharableId" className="text-right">
                                Sharable ID
                                </Label>
                                <Input
                                id="sharableId"
                                value={sharableId} onChange={(e) => setSharableId(e.target.value)}
                                className="col-span-3"
                                />
                            </div>
                            </div>
                            <DialogFooter>
                            <Button onClick={() => addBankAccount()}>Add Bank Account</Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    </Link>
                </div>

                {banks?.length > 0 && (
                    <div className='relative flex flex-1 flex-col items-center justify-center gap-5'>
                        <div className='relative z-10'>
                            <BankCard
                                key={banks[0].mask}
                                account={banks[0]}
                                userName={`${user?.firstName} ${user?.lastName}`}
                                showBalance={false}
                            />
                        </div>
                        {banks[1] && (
                            <div className='absolute right-0 top-8 z-0 w-[90%]'>
                                <BankCard
                                    key={banks[1].mask}
                                    account={banks[1]}
                                    userName={`${user?.firstName} ${user?.lastName}`}
                                    showBalance={false}
                                />
                            </div>
                        )}
                    </div>
                )}
            </section>
        </aside>
    )
}

export default RightSidebar