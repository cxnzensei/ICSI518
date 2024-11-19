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

import { columns } from "./columns"
import { DataTable } from "./data-table"

const TransactionHistory = () => {
    const [user, setUser] = useState<loginResponse>({
        emailId: "",
        firstName: "",
        userId: "",
        lastName: "",
        membershipStatus: "",
        role: "",
        familyId: ""
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const loggedInUser = getLoggedInUser();
        setUser(loggedInUser);

        const fetchTransactionsForUser = async () => {
            try {
                const response = await request('GET', `/api/v1/transactions/account-all?userId=${loggedInUser.userId}`);
                setTransactions(response?.data)
            } catch (error: any) {
                console.error(error)
            }
        }

        fetchTransactionsForUser();
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
                <div className="container mx-auto py-10">
                    <DataTable columns={columns} data={transactions} />
                </div>
            </div>
        </Suspense>
    )
}

export default TransactionHistory;