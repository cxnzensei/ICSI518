"use client";

import HeaderBox from '@/components/HeaderBox'
import React from 'react'
import { getLoggedInUser, request } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useEffect, useState, Suspense } from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import { BankTabItem } from '@/components/BankTabItem';
import BankInfo from '@/components/BankInfo';
import { loginResponse, Account, Transaction } from '@/types';

const TransactionHistory = () => {
    const [activeTab, setActiveTab] = useState(''); // useState to dynamically update id

    // const filterTransactionsForAccount = (accountId: string) => {
    //     return transactions.filter(transaction => transaction.accountId === accountId);
    // };

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

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const loggedInUser = getLoggedInUser();
        setUser(loggedInUser);

        const fetchAccountsForUser = async () => {
            try {
                const response = await request('GET', `/api/v1/accounts/user/${loggedInUser.userId}`);
                setAccounts(response?.data)
                setActiveTab(accounts[0]?.accountId)
            } catch (error: any) {
                console.error(error)
            }
        }

        fetchAccountsForUser();
        
    }, [])

    const fetchTransactionsByAccountId = async (accountId: string) => {
        try {
            const response = await request('GET', `/api/v1/transactions/account/${accountId}`);
            setTransactions(response?.data)
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
                <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue={accounts[0]?.accountId} className="w-full">
                    <TabsList className='recent-transactions-tablist'>
                        {accounts.map((account: Account) => (
                            <div key={account.accountId}>
                                <TabsTrigger value={account.accountId} onClick={() => fetchTransactionsByAccountId(account.accountId)}>
                                    <BankTabItem key={account.accountId} account={account} accountId={account.accountId} />
                                </TabsTrigger>
                            </div>
                        ))}
                    </TabsList>

                    {accounts.map((account: Account) => (
                        <TabsContent
                            value={account.accountId}
                            key={account.accountId}
                            className='space-y-4'
                        >
                            <BankInfo account={account} appwriteItemId={account.appwriteItemId} type='full' />
                            <TransactionsTable transactions={transactions} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </Suspense>
    )
}

export default TransactionHistory;