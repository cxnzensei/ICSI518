import HeaderBox from '@/components/ui/HeaderBox'
import RecentTransactions from '@/components/ui/RecentTransactions';
import RightSidebar from '@/components/ui/RightSidebar';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox'

const Home = () => {

  const loggedIn = { firstName: "Team8", lastName: "User", email: "team8@icsi518.com", userId: '1' }

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
  ];

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Manage your funds wisely. Access your transactions, goals and get insights towards them."
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
        <RecentTransactions
          accounts={accounts}
          transactions={transactions}
          appwriteItemId = {'1'}
          page = {1}
        />
      </div>
      <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 123.45 }, { currentBalance: 6789.01 }]}
      />
    </section>
  )
}

export default Home