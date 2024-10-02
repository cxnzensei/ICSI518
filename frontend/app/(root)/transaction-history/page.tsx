"use client";

import HeaderBox from '@/components/HeaderBox'
import React from 'react'
import { getLoggedInUser } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useEffect, useState } from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import { BankTabItem } from '@/components/BankTabItem';
import BankInfo from '@/components/BankInfo';

const TransactionHistory = ({ appwriteItemId }: RecentTransactionsProps) => {
    const [activeTab, setActiveTab] = useState('1'); // useState to dynamically update id

    const filterTransactionsForAccount = (accountId: string) => {
        return transactions.filter(transaction => transaction.accountId === accountId);
    };

    const handleTabChange = (newId: React.SetStateAction<string>) => {
        setActiveTab(newId);
    };
    const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);

    useEffect(() => {
        const user = getLoggedInUser();
        setLoggedInUser(user);
    }, [])

    const accounts = [
        {
            id: '1',
            name: 'Savings Account',
            appwriteItemId: '1',
            availableBalance: 5000.00,
            currentBalance: 5500.00,
            officialName: 'Personal Savings',
            mask: '1234',
            institutionId: 'bank_01',
            type: 'depository',
            subtype: 'savings',
            sharableId: 'share_1',
        },
        {
            id: '2',
            name: 'Checking Account',
            appwriteItemId: '2',
            availableBalance: 3000.00,
            currentBalance: 3500.00,
            officialName: 'Personal Checking',
            mask: '5678',
            institutionId: 'bank_02',
            type: 'depository',
            subtype: 'checking',
            sharableId: 'share_2',
        },
    ];

    const transactions = [
        {
            id: 't1',
            $id: 't1',
            name: 'Groceries',
            paymentChannel: 'in-store',
            type: 'debit',
            accountId: '1',
            amount: 150.75,
            pending: false,
            category: 'Food and Drink',
            date: '2024-09-28',
            image: 'grocery-image-url',
            $createdAt: '2024-09-28T09:00:00Z',
            channel: 'store',
            senderBankId: 'bank_01',
            receiverBankId: 'merchant_01',
        },
        {
            id: 't2',
            $id: 't2',
            name: 'Electricity Bill',
            paymentChannel: 'online',
            type: 'debit',
            accountId: '2',
            amount: 75.50,
            pending: false,
            category: 'Utilities',
            date: '2024-09-27',
            image: 'electricity-bill-image-url',
            $createdAt: '2024-09-27T10:00:00Z',
            channel: 'online',
            senderBankId: 'bank_02',
            receiverBankId: 'utility_company',
        },
        {
            id: 't3',
            $id: 't3',
            name: 'Salary',
            paymentChannel: 'direct-deposit',
            type: 'credit',
            accountId: '2',
            amount: 3000.00,
            pending: false,
            category: 'Payment',
            date: '2024-09-25',
            image: 'salary-image-url',
            $createdAt: '2024-09-25T12:00:00Z',
            channel: 'direct-deposit',
            senderBankId: 'employer_bank',
            receiverBankId: 'bank_02',
        },
        {
            id: 't4',
            $id: 't4',
            name: 'Amazon Orders',
            paymentChannel: 'online',
            type: 'debit',
            accountId: '1',
            amount: 161.68,
            pending: false,
            category: 'Shopping',
            date: '2024-09-28',
            image: 'salary-image-url',
            $createdAt: '2024-09-28T09:00:00Z',
            channel: 'store',
            senderBankId: 'bank_01',
            receiverBankId: 'merchant_01',
        },
        {
            id: 't5',
            $id: 't5',
            name: 'Netflix',
            paymentChannel: 'online',
            type: 'debit',
            accountId: '1',
            amount: 150.75,
            pending: false,
            category: 'Subscription',
            date: '2024-09-28',
            image: 'grocery-image-url',
            $createdAt: '2024-09-28T09:00:00Z',
            channel: 'store',
            senderBankId: 'bank_01',
            receiverBankId: 'merchant_01',
        },
        {
            id: 't6',
            $id: 't6',
            name: 'Zelle John',
            paymentChannel: 'online',
            type: 'credit',
            accountId: '1',
            amount: 150.75,
            pending: true,
            category: 'Payment',
            date: '2024-09-28',
            image: 'grocery-image-url',
            $createdAt: '2024-09-28T09:00:00Z',
            channel: 'store',
            senderBankId: 'bank_01',
            receiverBankId: 'merchant_01',
        },
        {
            id: 't7',
            $id: 't7',
            name: 'Dinner',
            paymentChannel: 'in-store',
            type: 'debit',
            accountId: '1',
            amount: 150.75,
            pending: false,
            category: 'Food and Drink',
            date: '2024-09-28',
            image: 'grocery-image-url',
            $createdAt: '2024-09-28T09:00:00Z',
            channel: 'store',
            senderBankId: 'bank_01',
            receiverBankId: 'merchant_01',
        }
    ];

    return (
        <div className="transactions">
            <div className="transactions-header">
                <HeaderBox
                    type="greeting"
                    title="Welcome to your Transaction History,"
                    user={loggedInUser?.firstName || 'Guest'}
                    subtext="See your bank details and Transactions."
                />
            </div>
            <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue={appwriteItemId} className="w-full">
                <TabsList className='recent-transactions-tablist'>
                    {accounts.map((account: Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
                        </TabsTrigger>
                    ))}
                </TabsList>

                {accounts.map((account: Account) => (
                    <TabsContent
                        value={account.appwriteItemId}
                        key={account.id}
                        className='space-y-4'
                    >
                        <BankInfo account={account} appwriteItemId={appwriteItemId} type='full' />
                        <TransactionsTable transactions={filterTransactionsForAccount(account.id)} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default TransactionHistory;