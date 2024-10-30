import { MakeTransactionProps } from '@/types';
import { useState } from 'react';
import { request } from '@/lib/utils';

const MakeTransaction = ({ accounts, onTransactionAdded }: MakeTransactionProps) => {
  const [name, setName] = useState('');
  const [paymentChannel, setPaymentChannel] = useState('in-store');
  const [type, setType] = useState('debit');
  const [accountId, setAccountId] = useState(accounts[0]?.accountId || '');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newTransaction = {
      "appwriteId": "unique-appwrite-id",
      "name": String(name),
      "paymentChannel": String(paymentChannel),
      "type": String(type),
      "amount": Number(amount),
      "pending": false,
      "category": String(category),
      "date": String(date),
      "image": "url",
      "createdAt": new Date().toISOString(),
      "channel": String(paymentChannel),
      "senderBankId": accountId,
      "receiverBankId": "some_receiver_id"
    };

    try {
      const response = await request('POST', `/api/v1/transactions/${accountId}`, newTransaction);
      onTransactionAdded();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }

    setName('');
    setAmount(0);
    setCategory('');
  };

  return (
    <div>
      <h2>Make a Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Transaction Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(e.target.value === '' ? 0 : Number(e.target.value))}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          {accounts.map((account) => (
            <option key={account.accountId} value={account.accountId}>
              {account.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={paymentChannel} onChange={(e) => setPaymentChannel(e.target.value)}>
          <option value="in-store">In-Store</option>
          <option value="online">Online</option>
          <option value="direct-deposit">Direct Deposit</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default MakeTransaction;