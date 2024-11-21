import { useEffect, useState } from 'react';
import { AccountMinimal, IndividualGoalFormProps, IndividualGoalsDto, loginResponse } from '@/types';
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
  import { Textarea } from "@/components/ui/textarea"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Button } from "@/components/ui/button"
  import { Checkbox } from "@/components/ui/checkbox"
  import { cn, request } from "@/lib/utils"
  import { Calendar } from "@/components/ui/calendar"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { format } from "date-fns"
  import { Calendar as CalendarIcon } from "lucide-react"
  import * as React from "react"
  

const IndividualGoalForm = ({ user, accounts, onIndividualGoalAdded }: IndividualGoalFormProps) => {

    const [name, setName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [amountContributed, setAmountContributed] = useState('');
    const [description, setDescription] = useState('');
    const [frequencyNumber, setFrequencyNumber] = useState('');
    const [frequency, setFrequency] = useState('');
    const [autoContribute, setAutoContribute] = useState(false);
    const [targetDate, setTargetDate] = React.useState<Date>();
    const [account, setAccount] = useState<string | null>(null);
    const [accountName, setAccountName] = useState('');
    const [open, setOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const addGoal = async () => {
        const goalDetails = {
          name,
          goalAmount: Number(goalAmount),
          amountContributed: Number(amountContributed),
          description,
          frequency: autoContribute ? frequency : 'EMPTY',
          frequencyNumber: autoContribute ? Number(frequencyNumber) : 0,
          autoContribute,
          targetDate: new Date(String(targetDate)).toISOString().slice(0, 19),
          ...(autoContribute && { accountId: account }),    
        }
    
        console.log('goal details:', goalDetails);
    
        try {
            const response = await request('POST', `/api/v1/individual-goals/create?userId=${user?.userId}`, goalDetails);
            console.log(response?.data);
            onIndividualGoalAdded();
            resetForm();
        } catch (error) {
          console.error(error);
        }
    }

    const resetForm = () => {
        setOpen(false);
        setName('');
        setGoalAmount('');
        setAmountContributed('');
        setDescription('');
        setFrequency('');
        setFrequencyNumber('');
        setAutoContribute(false);
        setTargetDate(undefined);
        setAccount(null);
        setAccountName('');
        setCalendarOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                resetForm();
            }
        }}>
        <DialogTrigger asChild>
            <h2
                className="text-14 font-semibold text-gray-600 view-all-btn cursor-pointer w-fit hover:scale-105 duration-300 ease-in-out"
                onClick={() => setOpen(true)}
            >
                Add a New Goal
            </h2>
        </DialogTrigger>
        <DialogContent className="bg-white">
            <DialogHeader>
                <DialogTitle>Enter Individual Goal Details</DialogTitle>
                <DialogDescription>Add a new goal</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goalAmount" className="text-right">
                        Goal Amount
                    </Label>
                    <Input
                        id="goalAmount"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amountContributed" className="text-right">
                        Amount Contributed
                    </Label>
                    <Input
                        id="amountContributed"
                        value={amountContributed}
                        onChange={(e) => setAmountContributed(e.target.value)}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="targetDate" className="text-right">
                        Target Date
                    </Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          onClick={() => setCalendarOpen(true)}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !targetDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={targetDate}
                          onSelect={(selectedDate) => {
                            setTargetDate(selectedDate);
                            setCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="autoContribute" className="text-right">
                        Auto Contribute
                    </Label>
                    <Checkbox id="autoContribute" onClick={() => setAutoContribute(!autoContribute)} />
                </div>
                {autoContribute && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account" className="text-right">
                            Account
                        </Label>
                        <Select onValueChange={(value) =>  {
                          const selectedAccount = accounts.find((account: any) => account.accountId === value);
                          if (selectedAccount) {
                            setAccount(selectedAccount.accountId);
                            setAccountName(selectedAccount.name);
                          }
                        }}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {accounts.map((account: any) => (
                                    <SelectItem
                                        key={account?.accountId}
                                        value={account?.accountId}
                                    >
                                        {account?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="frequency" className="text-right">
                            Frequency
                        </Label>
                        <Select onValueChange={(value) => setFrequency(value)}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="BIWEEKLY">Biweekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="frequencyNumber" className="text-right">
                            Frequency Number
                        </Label>
                        <Input
                            id="frequencyNumber"
                            value={frequencyNumber}
                            onChange={(e) => setFrequencyNumber(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                  </>
                )}
            </div>
            <DialogFooter>
                <Button onClick={() => addGoal()}>Add Goal</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};

export default IndividualGoalForm;