"use client";

import HeaderBox from '@/components/HeaderBox'
import React from 'react'
import { getLoggedInUser, request } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useEffect, useState, Suspense } from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import { BankTabItem } from '@/components/BankTabItem';
import BankInfo from '@/components/BankInfo';
import { loginResponse, Account } from '@/types';

const TransactionHistory = () => {
    const [activeTab, setActiveTab] = useState('unique-appwrite-id'); // useState to dynamically update id

    const filterTransactionsForAccount = (accountId: string) => {
        return transactions.filter(transaction => transaction.accountId === accountId);
    };

    const handleTabChange = (newId: React.SetStateAction<string>) => {
        setActiveTab(newId);
    };

    const [user, setUser] = useState<loginResponse>({
        emailId: "",
        firstName: "",
        userId: "",
        lastName: "",
        membershipStatus: "",
        role: "",
        familyId: ""
    });

    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        const loggedInUser = getLoggedInUser();
        setUser(loggedInUser);

        const fetchAccountsForUser = async () => {
            try {
                const response = await request('GET', `/api/v1/accounts/user/${loggedInUser.userId}`);
                setAccounts(response?.data)
            } catch (error: any) {
                console.error(error)
            }
        }

        fetchAccountsForUser();

    }, [])

    const transactions = [
        {
            id: 't1',
            $id: 't1',
            name: 'Groceries',
            paymentChannel: 'in-store',
            type: 'debit',
            accountId: '22c2ed34-1858-42b4-a7ed-ffc5886928b2',
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
            accountId: '22c2ed34-1858-42b4-a7ed-ffc5886928b2',
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
            accountId: '22c2ed34-1858-42b4-a7ed-ffc5886928b2',
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
            accountId: '22c2ed34-1858-42b4-a7ed-ffc5886928b2',
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
            accountId: '22c2ed34-1858-42b4-a7ed-ffc5886928b2',
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
            accountId: 'ef420591-12be-43bf-a2ec-dba7b25f38aa',
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
            accountId: 'ef420591-12be-43bf-a2ec-dba7b25f38aa',
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

    const addAccountForUser = async (userId: string) => {
        try {
            const response = await request('POST', `/api/v1/accounts/${userId}`,
                {
                    "name": "Personal Savings",
                    "appwriteItemId": "unique-appwrite-id4",
                    "availableBalance": 1500.00,
                    "currentBalance": 1500.00,
                    "officialName": "My Personal Savings Account",
                    "mask": "1234",
                    "institutionId": "bank-001",
                    "type": "savings",
                    "subtype": "personal",
                    "sharableId": "sharable-unique-id4"
                }
            )
            setAccounts([...accounts, response?.data])
            console.log(response?.data)
        } catch (error: any) {
            console.error(error)
        }
    }

    const deleteAccount = async (accountId: string) => {
        try {
            const response = await request('DELETE', `/api/v1/accounts/${accountId}`);
            const tempAccounts = accounts.filter((account) => account.accountId !== accountId);
            setAccounts(tempAccounts);
        } catch (error: any) {
            console.error(error)
        }
    }

    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <div className="transactions">
                <div className="transactions-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome to your Transaction History,"
                        user={user?.firstName || 'Guest'}
                        subtext="See your bank details and Transactions."
                    />
                </div>
                <button onClick={() => addAccountForUser(user?.userId)}>Add account</button>
                <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue={'unique-appwrite-id'} className="w-full">
                    <TabsList className='recent-transactions-tablist'>
                        {accounts.map((account: Account) => (
                            <div key={account.accountId}>
                                <TabsTrigger value={account.appwriteItemId}>
                                    <BankTabItem key={account.accountId} account={account} appwriteItemId={account.appwriteItemId} />
                                </TabsTrigger>
                                <button onClick={() => deleteAccount(account.accountId)}>Delete</button>
                            </div>
                        ))}
                    </TabsList>

                    {accounts.map((account: Account) => (
                        <TabsContent
                            value={account.appwriteItemId}
                            key={account.accountId}
                            className='space-y-4'
                        >
                            <BankInfo account={account} appwriteItemId={account.appwriteItemId} type='full' />
                            <TransactionsTable transactions={filterTransactionsForAccount(account.accountId)} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </Suspense>
    )
}

export default TransactionHistory;