"use client";

import HeaderBox from "@/components/HeaderBox"
import { useEffect, useState } from "react"
import { getLoggedInUser, request } from "@/lib/utils"
import { BalanceSheetItemDto, loginResponse } from "@/types"

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

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

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
    const [items, setItems] = useState<BalanceSheetItemDto[]>([]);
    const [open, setOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [itemAccount, setItemAccount] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [formData, setFormData] = useState({
        itemId: '',
        type: '',
        amount: '',
        frequencyNumber: '',
        frequency: '',
        account: {
            accountId: '',
            name: ''
        }
    })

    useEffect(() => {
        const initialize = async () => {
            const loggedInUser = getLoggedInUser();
            setUser(loggedInUser)

            try {
                const response2 = await request('get', `/api/v1/accounts/user-minimal/${loggedInUser?.userId}`);
                setAccounts(response2?.data);

                const response = await request('get', `/api/v1/balance-sheet-items?userId=${loggedInUser?.userId}`);
                setItems(response?.data);

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
            frequencyNumber,
            frequency,
        }
        try {
            const response = await request('POST', `/api/v1/balance-sheet-items/create?accountId=${itemAccount}`, itemDetails);
            setItems([...items, response?.data]);
            setOpen(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target ? e.target : { name: e.name, value: e.value };
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEditClick = (item: any) => {
        setEditingItemId(item.itemId);
        setFormData(item);
    }

    const handleItemDelete = async (id: string) => {
        await request('delete', `/api/v1/balance-sheet-items/delete/${id}`)
        const updatedItems = items.filter(item => item.itemId !== id);
        setItems(updatedItems);
    }


    const handleEditSave = async () => {
        const payload = {
            type: formData.type,
            amount: formData.amount,
            frequencyNumber: formData.frequencyNumber,
            frequency: formData.frequency,
            accountId: formData.account.accountId
        }
        try {
            const response = await request('patch', `/api/v1/balance-sheet-items/update/${formData.itemId}`, payload);
            setItems((prevItems) => prevItems.map((item) => (item.itemId === response?.data.itemId ? response?.data : item)));
            setEditingItemId(null);
        } catch (error) {
            console.log(error)
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
                        <h2 className='text-14 font-semibold text-gray-600 view-all-btn cursor-pointer w-fit hover:scale-105 duration-300 ease-in-out' onClick={() => setOpen(true)}>
                            Add a New Item
                        </h2>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
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
                                {/* <Input
                                    id="description"
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="col-span-3"
                                /> */}
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                        {accounts.map((account: any) => (
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
                <div>
                    <h2 className="text-xl">Balance Sheet Items</h2>
                    <hr className="my-5" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {items.map(item => (
                            <Card key={item.itemId}>
                                <CardHeader className="h-32">
                                    <CardTitle>{item.type}: {item.name}</CardTitle>
                                    <CardDescription className="card-description flex gap-1">
                                        <span className="font-semibold">desc./&gt;</span>
                                        <span>{item.description ? item.description : 'No description provided'}</span>
                                    </CardDescription>
                                </CardHeader>
                                <hr className="mb-7" />
                                <CardContent className="overflow-hidden">
                                    {editingItemId === item.itemId ? (
                                        <form>
                                            <div className="grid grid-cols-2 w-full items-center gap-4">
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="amount">Amount:</Label>
                                                    <Input className="outline-none border px-2" id="amount" name="amount" value={formData.amount} onChange={handleChange} />
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="account">Account:</Label>
                                                    <Select onValueChange={handleChange}>
                                                        <SelectTrigger id="frequency" className="bg-white">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white" position="popper">
                                                            {accounts.map((account: any) => (
                                                                <SelectItem key={account.accountId} value={account.accountId}>{account.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="frequencyNumber">Frequency Number:</Label>
                                                    <Input className="outline-none border px-2" id="frequencyNumber" name="frequencyNumber" value={formData.frequencyNumber} onChange={handleChange} />
                                                </div>
                                                <div className="flex flex-col space-y-1.5 bg-white">
                                                    <Label htmlFor="frequency">Frequency:</Label>
                                                    <Select onValueChange={handleChange}>
                                                        <SelectTrigger id="frequency" className="bg-white">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white" position="popper">
                                                            <SelectItem value="DAILY">Daily</SelectItem>
                                                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                                                            <SelectItem value="BIWEEKLY">Biweekly</SelectItem>
                                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 w-full items-center gap-4">
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="amount">Amount:</Label>
                                                    <div id="amount"><Label>{item.amount}</Label></div>
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="account">Account:</Label>
                                                    <div id="account"><Label>{item.account.name}</Label></div>
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="frequencyNumber">Frequency Number:</Label>
                                                    <div id="frequencyNumber"><Label>{item.frequencyNumber}</Label></div>
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="frequency">Frequency:</Label>
                                                    <div id="frequency"><Label>{item.frequency}</Label></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    {editingItemId === item.itemId ? (
                                        <>
                                            <Button variant="outline" onClick={() => setEditingItemId(null)}>Cancel</Button>
                                            <Button onClick={handleEditSave}>Save</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" onClick={() => handleEditClick(item)}>Edit</Button>
                                            <Button variant="outline" onClick={() => handleItemDelete(item.itemId)}>Delete</Button>
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BalanceSheetItem