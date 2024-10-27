"use client";

import React, { useState } from 'react';
import './Page.css';

const Page = () => {
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [goals, setGoals] = useState<{ goal: string, notes: string, deadline: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoals([...goals, { goal, notes, deadline }]);
    setGoal('');
    setNotes('');
    setDeadline('');
  };

  return (
    <div className="container">
      <h1>Set a Goal</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Goal ($):</label>
          <input 
            type="number" 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)} 
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input 
            type="date" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
          />
        </div>
        <label>Notes:</label>
        <div>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>
        <button type="submit">Set Goal</button>
      </form>
      <div className="goals-list">
        <h2>Goals</h2>
        <ul>
          {goals.map((g, index) => (
            <li key={index}>
              <strong>Budget:</strong> ${g.goal} <br />
              <strong>Deadline:</strong> {g.deadline} <br />
              <strong>Notes:</strong> {g.notes}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;