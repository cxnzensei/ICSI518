'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { RecentTransactionsProps, Account } from '@/types'

const RecentTransactions = ({
    accounts,
    transactions = [],
    page = 1
}: RecentTransactionsProps) => {
    const [activeTab, setActiveTab] = useState(''); // useState to dynamically update id

    // Filter transactions for the currently active account
    const filterTransactionsForAccount = (accountId: string) => {
        console.log('transactions in recent transactions:', transactions);
        console.log('accountId in recent transactions:', accountId);

        const filteredTransactions = transactions.filter(transaction => transaction.accountId === accountId);

        return filteredTransactions.slice(0, 4);
    };

    const handleTabChange = (newId: React.SetStateAction<string>) => {
        setActiveTab(newId);
    };

    return (
        <section className='recent-transactions'>
            <header className='flex items-center justify-between'>
                <h2 className='recent-transactions-label'>
                    Recent Transactions
                </h2>
                <Link href={`/transaction-history`} className='view-all-btn'>
                    View All
                </Link>
            </header>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className='recent-transactions-tablist'>
                    {accounts.map((account) => (
                        <TabsTrigger key={account.accountId} value={account.accountId}>
                            <BankTabItem
                                key={account.accountId}
                                account={account}
                                accountId={activeTab}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>
                {accounts.map((account: Account) => (
                    <TabsContent
                        value={account.accountId}
                        key={account.accountId}
                        className='space-y-4'
                    >
                        <BankInfo
                            account={account}
                            accountId={activeTab}
                            type='full'
                        />
                        <TransactionsTable transactions={filterTransactionsForAccount(account.accountId)} />
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default RecentTransactions