import { MakeTransactionProps } from '@/types';
import { useState } from 'react';
import { request } from '@/lib/utils';
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"


const MakeTransaction = ({ accounts, onTransactionAdded }: MakeTransactionProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('DEBIT');
  const [accountId, setAccountId] = useState(accounts[0]?.accountId);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = useState(false);

  const credits = ['INCOME', 'INVESTMENTS', 'MISCELLANEOUS']
  const debits = [
    'GROCERIES',
    'RESTAURANTS',
    'UTILITIES', 
    'RENT',
    'MORTGAGE', 
    'TRANSPORTATION',
    'ENTERTAINMENT',
    'HEALTHCARE',
    'PERSONALCARE',
    'SHOPPING',
    'INSURANCE', 
    'EDUCATION',
    'SUBSCRIPTIONS',
    'TRAVEL', 
    'MISCELLANEOUS']

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newTransaction = {
      "name": String(name),
      "type": String(type),
      "amount": Number(amount),
      "pending": false,
      "category": String(category),
      "date": new Date(String(date)).toISOString(),
    };

    try {
      const response = await request('POST', `/api/v1/transactions/${accountId}`, newTransaction);
      console.log(response.data);
      onTransactionAdded();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
    console.log(newTransaction);
    setName('');
    setType('DEBIT'); // Reset to initial value
    setAccountId(accounts[0]?.accountId);
    setAmount('');
    setCategory('');
    setDate(new Date());
  };

  return (
    <div>
      <div>
        <Label>Make Transactions</Label>
      </div>
        <form
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
        }}
        >
        <Input type="name" value={name} placeholder="Transaction Name" onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />

        <Input type="amount" value={amount} placeholder="Amount" onChange={(e) => setAmount(e.target.value)} style={{ flex: 1 }} />

        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value="DEBIT">Debit</SelectItem>
            <SelectItem value="CREDIT">Credit</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setAccountId(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {accounts.map((account) => (
              <SelectItem key={account.accountId} value={account.accountId}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
            
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() => setOpen(true)}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" onClick={() => setOpen(false)}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {(type === "CREDIT" ? credits : debits).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" onClick={handleSubmit} style={{ flexShrink: 0 }}>
          Add Transaction
        </Button>
      </form>
    </div>
  );
};

export default MakeTransaction;