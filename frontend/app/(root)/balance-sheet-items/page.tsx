"use client";

import HeaderBox from "@/components/HeaderBox"
import { useEffect, useState } from "react"
import { getLoggedInUser, request } from "@/lib/utils"
import { loginResponse } from "@/types"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

const BalanceSheetItem = () => {

    const [user, setUser] = useState<loginResponse>({
        emailId: "",
        firstName: "",
        userId: "",
        lastName: "",
        membershipStatus: "",
        role: "",
        familyId: ""
    });

    const [name, setName] = useState('');
    const [type, setType] = useState('ASSET');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [frequencyNumber, setFrequencyNumber] = useState('');
    const [frequency, setFrequency] = useState('');
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [itemAccount, setItemAccount] = useState('');
    
    useEffect(() => {
        const initialize = async () => {
            const loggedInUser = getLoggedInUser();
            setUser(loggedInUser)
            
            try {
                const response = await request('get', `/api/v1/balance-sheet-items?userId=${loggedInUser?.userId}`);
                setItems(response?.data);

                const response2 = await request('get', `/api/v1/accounts/user-minimal/${loggedInUser?.userId}`);
                setAccounts(response2?.data);
            } catch (error) {
                console.log(error);
            }
        }
        
        initialize()
    }, [])

    const addItem = async () => {
        const itemDetails = {
            name,
            type,
            description,
            amount,
            frequencyNumber: parseInt(frequencyNumber),
            frequency,
            itemAccount
        }
        console.log(itemDetails);
        console.log(typeof(itemDetails.frequencyNumber));
        try {
            const response = await request('POST', `/api/v1/balance-sheet-items/create?accountId=${itemAccount}`);
            console.log(response?.data);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome to the balance sheet items page,"
                        user={user?.firstName || 'Guest'}
                        subtext="Manage your assets and liabilities here."
                    />
                </header>
                <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <h2 className='text-14 font-semibold text-gray-600' onClick={() => setOpen(true)}>
                        Add a New Item
                    </h2>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Enter balance sheet item details</DialogTitle>
                    <DialogDescription>
                        Add a new balance sheet item
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemName" className="text-right">
                            Item Name
                            </Label>
                            <Input
                            id="name"
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemType" className="text-right">
                            Item Type
                            </Label>
                            <Select onValueChange={(value) => setType(value)}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="ASSET">Asset</SelectItem>
                                    <SelectItem value="LIABILITY">Liability</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                            Description
                            </Label>
                            <Input
                            id="description"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                            Amount
                            </Label>
                            <Input
                            id="amount"
                            value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequencyNumber" className="text-right">
                            Frequency Number
                            </Label>
                            <Input
                            id="frequencyNumber"
                            value={frequencyNumber} onChange={(e) => setFrequencyNumber(e.target.value)}
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="frequency" className="text-right">
                                Frequency
                            </Label>
                            <Select onValueChange={(value) => setFrequency(value)}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="BIWEEKLY">Biweekly</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemAccount" className="text-right">
                                Account
                            </Label>
                            <Select onValueChange={(value) => setItemAccount(value)}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    {accounts.map((account:any) => (
                                        <SelectItem key={account?.accountId} value={account?.accountId}>{account?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                    <Button onClick={() => addItem()}>Add Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </section>
    )
}

export default BalanceSheetItem