"use client";

import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox'
import TotalExpenseBox from '@/components/TotalExpenseBox'
import { getLoggedInUser, request } from '@/lib/utils';
import { Account, CategoryCount, loginResponse, Transaction } from '@/types';

import { Suspense, useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"; // Adjust import based on your setup
import { Button } from "@/components/ui/button";

import MakeTransaction from '@/components/MakeTransaction';
import TotalIncomeBox from '@/components/TotalIncomeBox';

const Home = () => {

  const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccountToRemove, setSelectedAccountToRemove] = useState('');
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
  const [incomeCategoryCount, setIncomeCategoryCount] = useState<CategoryCount[]>([]);
  const [categoryCount, setCategoryCount] = useState<CategoryCount[]>([]);



  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    setLoggedInUser(loggedInUser);
    fetchTransactions(loggedInUser.userId);
  }, [])

  const fetchAccounts = async (userId: string) => {
    try {
      const response = await request('GET', `/api/v1/accounts/user/${userId}`);
      const userAccounts = response?.data;
      setAccounts(userAccounts);
    } catch (error) {
      console.error(error);
    }
  }

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

      const transactions = allTransactions.flat();
      setTransactions(transactions);

      const incomeTransactions = transactions.filter(transaction => transaction.type.toLowerCase() === 'credit');
      setIncomeTransactions(incomeTransactions);

      const expenseTransactions = transactions.filter(transaction => transaction.type.toLowerCase() === 'debit');
      setExpenseTransactions(expenseTransactions);

      const categoryCount = expenseTransactions.reduce((acc: CategoryCount[], transaction: Transaction) => {
        const normalizedCategory = transaction.category.toLowerCase();
        const category = acc.find(cat => cat.name === normalizedCategory);
        if (category) {
          category.count += 1;
          category.totalCost += transaction.amount;
        } else {
          acc.push({
            name: normalizedCategory, count: 1, totalCost: transaction.amount,
            totalCount: 0
          });
        }
        return acc;
      }, []);

      setCategoryCount(categoryCount);

      const incomeCategoryCount = incomeTransactions.reduce((acc: CategoryCount[], transaction: Transaction) => {
        const normalizedCategory = transaction.category.toLowerCase();
        const category = acc.find(cat => cat.name === normalizedCategory);
        if (category) {
          category.count += 1;
          category.totalCost += transaction.amount;
        } else {
          acc.push({
            name: normalizedCategory, count: 1, totalCost: transaction.amount,
            totalCount: 0
          });
        }
        return acc;
      }, []);

      setIncomeCategoryCount(incomeCategoryCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveAccount = async () => {
    try {
      const response = await request('DELETE', `/api/v1/accounts/${selectedAccountToRemove}`);
      if (loggedInUser?.userId) {
        fetchAccounts(loggedInUser.userId);
      } else {
        console.error("User ID is undefined, cannot fetch accounts.");
      }
      setSelectedAccountToRemove('Select an account');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className='home'>
        <div className='home-content'>
          <header className='home-header'>
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedInUser?.firstName || 'Guest'}
              subtext="Manage your funds wisely. Access your transactions, goals and get insights towards them."
            />
            <TotalBalanceBox
              accounts={accounts}
              totalBanks={accounts.length}
              totalCurrentBalance={accounts.reduce((total, account) => total + account.currentBalance, 0)}
            />
            {expenseTransactions.length > 0 && (
              <TotalExpenseBox
                category={categoryCount}
                totalExpenses={expenseTransactions.length}
                categoryCount={categoryCount}
              />
            )}
            {incomeTransactions.length > 0 && (
              <TotalIncomeBox
                category={incomeCategoryCount}
                totalIncomes={incomeTransactions.length}
                categoryCount={incomeCategoryCount}
              />
            )}
          </header>
          <div className="space-y-4">
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
            <RecentTransactions
              accounts={accounts}
              transactions={transactions}
              page={1}
            />
            <div>
              <Select
                value={selectedAccountToRemove}
                onValueChange={(value) => setSelectedAccountToRemove(value)}
              >
                <SelectTrigger className="w-full bg-white">
                  {selectedAccountToRemove ? (
                    accounts.find((account) => account.accountId === selectedAccountToRemove)?.name
                  ) : (
                    "Select an account"
                  )}
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {accounts.map((account) => (
                    <SelectItem key={account.accountId} value={account.accountId}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRemoveAccount} disabled={!selectedAccountToRemove}>
              Remove Account
            </Button>
          </div>
        </div>
        <RightSidebar
          user={loggedInUser}
          // banks={[{ currentBalance: 123.45 }, { currentBalance: 6789.01 }]}
          banks={accounts}
          onBankAccountAdded={() => {
            if (loggedInUser?.userId) {
              fetchAccounts(loggedInUser.userId);
            } else {
              console.error("User ID is undefined, cannot fetch accounts.");
            }
          }}
        />
      </section>
    </Suspense>
  )
}

export default Home