"use client";

import HeaderBox from '@/components/HeaderBox';
import { getLoggedInUser, request } from '@/lib/utils';
import { AccountMinimal, IndividualGoalsDto, loginResponse } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import IndividualGoalForm from '@/components/IndividualGoalForm';


export default function Goals() {

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
  const [goalAmount, setGoalAmount] = useState('');
  const [amountContributed, setAmountContributed] = useState('');
  const [description, setDescription] = useState('');
  const [frequencyNumber, setFrequencyNumber] = useState('');
  const [frequency, setFrequency] = useState('');
  const [autoContribute, setAutoContribute] = useState(false);
  const [targetDate, setTargetDate] = React.useState<Date>();
  const [account, setAccount] = useState<string | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accounts, setAccounts] = useState<AccountMinimal[]>([]);
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [familyGoalsFormOpen, setFamilyGoalsFormOpen] = useState(false);
  const [individualGoals, setIndividualGoals] = useState<IndividualGoalsDto[]>([]);
  const [editingIndividualGoalId, setEditingIndividualGoalId] = useState(null);
  const [formData, setFormData] = useState({
      individualGoalId: '',
      goalAmount: '',
      frequencyNumber: '',
      frequency: '',
      autoContribute: false,
      status: '',
      targetDate: '',
      account: {
          accountId: '',
          name: ''
      }
  })

  useEffect(() => {

    const initialize = async () => {
      const loggedInUser = getLoggedInUser();
      setUser(loggedInUser);

      try {
        const response2 = await request('get', `/api/v1/accounts/user-minimal/${loggedInUser?.userId}`);
        setAccounts(response2?.data);
        console.log(response2?.data);

        const response = await request('get', `/api/v1/individual-goals?userId=${loggedInUser?.userId}`);
        setIndividualGoals(response?.data);
        console.log(response?.data);

        
      } catch (error) {
        console.error(error);
      }
    }

    initialize();
    console.log('accounts:', accounts);
    console.log('individual goals:', individualGoals);
  }, [])

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
      ...(autoContribute && { account: { accountId: account, name: accountName } }),    
    }

    console.log('goal details:', goalDetails);

    try {
      const response = await request('POST', `/api/v1/individual-goals/create?userId=${user?.userId}`, goalDetails);
      console.log(response?.data);
      setIndividualGoals([...individualGoals, response?.data]);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const addFamilyGoal = () => {
    const familyGoalDetails = {
      name,
      goalAmount,
      amountContributed,
      description,
      frequency,
      frequencyNumber,
      autoContribute,
      targetDate: new Date(String(targetDate)).toISOString(),
      account,
    }

    console.log(familyGoalDetails);
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target ? e.target : { name: e.name, value: e.value };
    setFormData({
        ...formData,
        [name]: value
    });
  };

  const handleEditClick = (goal: any) => {
    setEditingIndividualGoalId(goal.individualGoalId);
    setFormData(goal);
  }

  const handleInidividualGoalDelete = async (id: string) => {
    // await request('delete', `/api/v1/individual-goals/delete/${id}`)
    // const updatedIndividualGoals = individualGoals.filter(item => item.individualGoalId !== id);
    // setIndividualGoals(updatedIndividualGoals);
    console.log('id of to delete goal:', id);
  }


  const handleEditSave = async () => {
      const payload = {
          goalAmount: formData.goalAmount,
          autoContribute: formData.autoContribute,
          frequencyNumber: formData.frequencyNumber,
          frequency: formData.frequency,
          status: formData.status,
          targetDate: formData.targetDate,
          accountId: formData.account.accountId
      }
      try {
          // const response = await request('patch', `/api/v1/individual-goals/update/${formData.individualGoalId}`, payload);
          // setIndividualGoals((prevGoals) => prevGoals.map((goal) => (goal.individualGoalId === response?.data.individualGoalId ? response?.data : goal)));
          console.log('payload of goal to be edited:', payload);
          setEditingIndividualGoalId(null);
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
            title="Welcome to your goals page,"
            user={user?.firstName || 'Guest'}
            subtext="Manage your goals here."
          />
        </header>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/setting-budgets">
            <button className='bg-bankGradient' style={styles.button}>Setting Budgets</button>
          </Link>

          <Link href="/setting-goals">
            <button className='bg-bankGradient' style={styles.button}>Setting Goals</button>
          </Link>

          <Link href="/suggest-spending-changes">
            <button className='bg-bankGradient' style={styles.button}>Suggest Spending Changes</button>
          </Link>
        </div>
        <IndividualGoalForm 
          user={user} 
          accounts={accounts}
          onIndividualGoalAdded={async () => {
            if(user?.userId) {
                try {
                  const response = await request('get', `/api/v1/individual-goals?userId=${user?.userId}`);
                  console.log(response?.data);
                  setIndividualGoals([...response?.data]);
                } catch (error) {
                  console.error(error);
                }
            }
          }}
        />

        
        <>
        {user?.role === "ADMIN" && (
        <Dialog  open={familyGoalsFormOpen} onOpenChange={setFamilyGoalsFormOpen}>
          <DialogTrigger asChild>
            <h2
              className="text-14 font-semibold text-gray-600 view-all-btn cursor-pointer w-fit hover:scale-105 duration-300 ease-in-out"
              onClick={() => setFamilyGoalsFormOpen(true)}
            >
              Add a Family Goal
            </h2>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Enter Family Goal Details</DialogTitle>
              <DialogDescription>Add a new family goal</DialogDescription>
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
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetDate" className="text-right">
                  Target Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate ? format(new Date(targetDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={targetDate}
                      onSelect={(date) => setTargetDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => addFamilyGoal()}>Add Family Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        )}
        </>




        <div>
          <h2 className='text-xl'>Individual Goals</h2>
          <hr className='my-5' />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {individualGoals.map(item => (
                  <Card key={item.individualGoalId}>
                      <CardHeader className="h-32">
                          <CardTitle>{item.name}</CardTitle>
                          <CardDescription className="card-description flex gap-1">
                              <span className="font-semibold">desc./&gt; </span>
                              <span>{item.description ? item.description : 'No description provided'}</span>
                          </CardDescription>
                      </CardHeader>
                      <hr className="mb-7" />
                      <CardContent className="overflow-hidden">
                          {editingIndividualGoalId === item.individualGoalId ? (
                              <form>
                                  <div className="grid grid-cols-2 w-full items-center gap-4">
                                      <div className="flex flex-col space-y-1.5">
                                          <Label htmlFor="amount">Goal Amount:</Label>
                                          <Input className="outline-none border px-2" id="amount" name="amount" value={formData.goalAmount} onChange={handleChange} />
                                      </div>
                                      <div className="flex flex-col space-y-1.5">
                                          <Label htmlFor="targetDate">Target Date:</Label>
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
                                                  handleChange({ target: { name: "targetDate", value: selectedDate } });
                                                }}
                                                initialFocus
                                              />
                                            </PopoverContent>
                                          </Popover>
                                      </div>
                                      <div className="flex flex-col space-y-1.5">
                                          <Label htmlFor="autoContribute">Auto Contribute:</Label>
                                          <Checkbox id="autoContribute" name="autoContribute" onClick={() => {
                                            setAutoContribute(!autoContribute);
                                            handleChange({ target: { name: "autoContribute", value: autoContribute } });
                                          }} />
                                      </div>
                                      {autoContribute && (
                                        <>
                                          <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="account">Account:</Label>
                                            <Select onValueChange={handleChange}>
                                                <SelectTrigger id="account" className="bg-white">
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
                                        </>
                                      )}
                                      <div className="flex flex-col space-y-1.5 bg-white">
                                        <Label htmlFor="status">Status:</Label>
                                        <Select onValueChange={handleChange}>
                                            <SelectTrigger id="status" className="bg-white">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white" position="popper">
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="PAUSED">Paused</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="CANCELED">Canceled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                      </div>
                                  </div>
                              </form>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="amount">Goal Amount:</Label>
                                  <div id="amount"><Label>{item.goalAmount}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="account">Account:</Label>
                                  <div id="account"><Label>{item?.account?.name}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="frequencyNumber">Frequency Number:</Label>
                                  <div id="frequencyNumber"><Label>{item.frequencyNumber}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="frequency">Frequency:</Label>
                                  <div id="frequency"><Label>{item.frequency}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="autoContribute">Auto Contribute:</Label>
                                  <div id="frequency"><Label>{item.autoContribute}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="amountContributed">Amount Contributed:</Label>
                                  <div id="amountContributed"><Label>{item.amountContributed}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="targetDate">Target Date:</Label>
                                  <div id="targetDate"><Label>{new Date(item.targetDate).toLocaleDateString()}</Label></div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                  <Label htmlFor="status">Status:</Label>
                                  <div id="status"><Label>{item.status}</Label></div>
                                </div>
                              </div>
                            </>
                          )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                          {editingIndividualGoalId === item.individualGoalId ? (
                              <>
                                  <Button variant="outline" onClick={() => setEditingIndividualGoalId(null)}>Cancel</Button>
                                  <Button onClick={handleEditSave}>Save</Button>
                              </>
                          ) : (
                              <>
                                  <Button variant="outline" onClick={() => handleEditClick(item)}>Edit</Button>
                                  <Button variant="outline" onClick={() => handleInidividualGoalDelete(item.individualGoalId)}>Delete</Button>
                              </>
                          )}
                      </CardFooter>
                  </Card>
              ))}
          </div>
        </div>

      </div>
    </section>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '10px',
  },
};
