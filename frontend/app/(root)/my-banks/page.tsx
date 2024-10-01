"use client";

import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import { getLoggedInUser } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

const MyBanks = () => {
    const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);

    useEffect(() => {
        const user = getLoggedInUser();
        setLoggedInUser(user);
    }, [])

    const accounts: Account[] = [
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

    return (
        <section className='flex'>
            <div className="my-banks">
                <HeaderBox
                    title="My Bank Accounts"
                    subtext="Effortlessly manage your banking activities."
                />

                <div className="space-y-4">
                    <h2 className="header-2">
                        Your cards
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {accounts && accounts.map((account: Account) => (
                            <BankCard
                                key={account.id}
                                account={account}
                                userName={loggedInUser?.firstName}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBanks;