import { MakeTransactionProps } from '@/types';
import { useState } from 'react';

const MakeTransaction = ({ addTransaction, accounts }: MakeTransactionProps) => {
  const [name, setName] = useState('');
  const [paymentChannel, setPaymentChannel] = useState('in-store');
  const [type, setType] = useState('debit');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    addTransaction({
      id: `t${Date.now()}`,
      $id: `t${Date.now()}`,
      name,
      paymentChannel,
      type,
      accountId,
      amount,
      pending: false,
      category,
      date,
      image: 'url',
      $createdAt: new Date().toISOString(),
      channel: paymentChannel,
      senderBankId: accountId, 
      receiverBankId: 'some_receiver_id',
    });

    // Clear form after submission
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
            <option key={account.id} value={account.id}>
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