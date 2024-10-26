"use client";

import React, { useState } from 'react';
import './Page.css';

const Page = () => {
  const [budget, setBudget] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [showFrequency, setShowFrequency] = useState(false);
  const [budgets, setBudgets] = useState<{ budget: string, frequency: string, notes: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBudgets([...budgets, { budget, frequency, notes }]);
    setBudget('');
    setFrequency('');
    setNotes('');
    setShowFrequency(false);
  };

  return (
    <div className="container">
      <h1>Set a Budget</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Budget ($):</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
          />
        </div>
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={showFrequency} 
              onChange={(e) => setShowFrequency(e.target.checked)} 
            />
            Repeat?
          </label>
        </div>
        {showFrequency && (
          <div>
            <label>Frequency (Days):</label>
            <input 
              type="number" 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)} 
            />
          </div>
        )}
        <label>Notes:</label>
        <div>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>
        <button type="submit">Set Budget</button>
      </form>
      <div className="budgets-list">
        <h2>Budgets</h2>
        <ul>
          {budgets.map((g, index) => (
            <li key={index}>
              <strong>Budget:</strong> ${g.budget} <br />
              {g.frequency && (
                <>
                  <strong>Frequency:</strong> {g.frequency} <br />
                </>
              )}
              <strong>Notes:</strong> {g.notes}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;