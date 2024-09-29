'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'

const RecentTransactions = ({
    accounts,
    transactions = [],
    appwriteItemId,
    page = 1
}: RecentTransactionsProps) => {
    const [activeTab, setActiveTab] = useState(appwriteItemId); // useState to dynamically update id
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
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTabItem 
                                key={account.id}
                                account={account}
                                appwriteItemId={activeTab}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>
                {accounts.map((account: Account) => (
                    <TabsContent
                        value={account.appwriteItemId}
                        key={account.id}
                        className='space-y-4'
                    >
                        <BankInfo 
                            account={account}
                            appwriteItemId={activeTab}
                            type='full'
                        />
                        <TransactionsTable transactions={transactions} />
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default RecentTransactions