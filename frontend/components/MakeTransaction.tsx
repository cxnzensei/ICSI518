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

const MakeTransaction = ({ accounts, onTransactionAdded }: MakeTransactionProps) => {
  const [name, setName] = useState('');
  const [paymentChannel, setPaymentChannel] = useState('in-store');
  const [type, setType] = useState('debit');
  const [accountId, setAccountId] = useState(accounts[0]?.accountId || '');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = React.useState<Date>()


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newTransaction = {
      "appwriteId": "unique-appwrite-id",
      "name": String(name),
      "paymentChannel": String(paymentChannel),
      "type": String(type),
      "amount": Number(amount),
      "pending": false,
      "category": String(category),
      "date": String(date),
      "image": "url",
      "createdAt": new Date().toISOString(),
      "channel": String(paymentChannel),
      "senderBankId": accountId,
      "receiverBankId": "some_receiver_id"
    };

    try {
      const response = await request('POST', `/api/v1/transactions/${accountId}`, newTransaction);
      onTransactionAdded();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }

    setName('');
    setAmount(0);
    setCategory('');
  };

  return (
    <div>
      <h2>Make a Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Transaction Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(e.target.value === '' ? 0 : Number(e.target.value))}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          {accounts.map((account) => (
            <option key={account.accountId} value={account.accountId}>
              {account.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={paymentChannel} onChange={(e) => setPaymentChannel(e.target.value)}>
          <option value="in-store">In-Store</option>
          <option value="online">Online</option>
          <option value="direct-deposit">Direct Deposit</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
      <div>
        <h2>Make Transaction Refactor</h2>
      </div>
        <form
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
        }}
        >
        {/* Transaction Name Input */}
        <Input type="name" placeholder="Transaction Name" style={{ flex: 1 }} />

        {/* Amount Input */}
        <Input type="amount" placeholder="Amount" style={{ flex: 1 }} />

        {/* Transaction Type Dropdown */}
        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value="debit">Debit</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
          </SelectContent>
        </Select>

        {/* Bank Account Dropdown */}
        <Select
          value={accountId}
          onValueChange={(value) => setAccountId(value)}
        >
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

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date2 && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date2 ? format(date2, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={date2}
              onSelect={setDate2}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Transaction Channel Dropdown */}
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-store">In-Store</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="direct-deposit">Direct Deposit</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Transaction Button */}
        <Button type="submit" style={{ flexShrink: 0 }}>
          Add Transaction
        </Button>
      </form>
    </div>
  );
};

export default MakeTransaction;