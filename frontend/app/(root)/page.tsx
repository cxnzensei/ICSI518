"use client";

import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getLoggedInUser, request } from '@/lib/utils';
import { Account, loginResponse, Transaction } from '@/types';

import { Suspense, useEffect, useState } from 'react';

import MakeTransaction from '@/components/MakeTransaction';
import BalanceSheet from '@/components/BalanceSheet';

const Home = () => {

  const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    setLoggedInUser(loggedInUser);
    fetchTransactions(loggedInUser.userId);
  }, [])

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await request('GET', `/api/v1/accounts/user/${userId}`);
      const userAccounts = response?.data;
      setAccounts(userAccounts);

      const allTransactions = await Promise.all(
        userAccounts.map(async (account: Account) => {
          try {
            const transactionResponse = await request('GET', `/api/v1/transactions/account/${account.accountId}`);
            return transactionResponse?.data || [];
          } catch (error) {
            console.error(`Error fetching transactions for account ${account.accountId}`, error);
            return [];
          }
        })
      );

      setTransactions(allTransactions.flat());
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className='home'>
        <div className='home-content'>
          <header className='home-header'>
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedInUser?.firstName || 'Guest'}
              subtext="Manag your funds wisely. Access your transactions, goals and get insights towards them."
            />
            <TotalBalanceBox
              accounts={accounts}
              totalBanks={accounts.length}
              totalCurrentBalance={accounts.reduce((total, account) => total + account.availableBalance, 0)}
            />
          </header>
          <RecentTransactions
            accounts={accounts}
            transactions={transactions}
            appwriteItemId={'1'}
            page={1}
          />
          <MakeTransaction 
            accounts={accounts} 
            onTransactionAdded={() => {
              if (loggedInUser?.userId) {
                fetchTransactions(loggedInUser.userId);
              } else {
                console.error("User ID is undefined, cannot fetch transactions.");
              }
            }}
          />        
          <BalanceSheet />
        </div>
        <RightSidebar
          user={loggedInUser}
          // banks={[{ currentBalance: 123.45 }, { currentBalance: 6789.01 }]}
          banks={accounts}
        />
      </section>
    </Suspense>
  )
}

export default Home