"use client";

import React, { useState } from 'react';
import './GoalsPage.css'; // Updated CSS file name

interface Goal {
  goal: string;
  notes: string;
  dueDate: string;
}

const Page = () => {
  const [yearlyGoal, setYearlyGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (yearlyGoal) {
      setGoals(prev => [
        ...prev,
        { goal: yearlyGoal, notes, dueDate },
      ]);
      setYearlyGoal('');
      setNotes('');
      setDueDate('');
    }
  };

  const totalFamilyYearlyGoal = goals.reduce((total, g) => total + (parseFloat(g.goal) || 0), 0);
  const totalFamilyMonthlyGoal = totalFamilyYearlyGoal / 12;

  const calculateContributions = (totalYearlyGoal: number) => {
    const momContribution = totalYearlyGoal * 0.35;
    const dadContribution = totalYearlyGoal * 0.40;
    const childContribution = totalYearlyGoal * 0.25;

    return {
      mom: {
        monthly: momContribution / 12,
      },
      dad: {
        monthly: dadContribution / 12,
      },
      child: {
        monthly: childContribution / 12,
      },
    };
  };

  const contributions = calculateContributions(totalFamilyYearlyGoal);

  return (
    <div className="container">
      <h1 className="title">Set Family Goals</h1>
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="input-container">
          <label className="label">Yearly Goal ($):</label>
          <input 
            type="number" 
            value={yearlyGoal} 
            onChange={(e) => setYearlyGoal(e.target.value)} 
            className="input"
            required
          />
          <label className="label">Notes:</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="textarea"
          />
          <label className="label">Due Date:</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            className="input"
          />
          <button type="submit" className="button">Add Goal</button>
        </div>
      </form>
      <div className="goals-list">
        <h2 className="goals-title">Your Family's Goals</h2>
        <ul>
          {goals.map((g, idx) => (
            <li key={idx} className="goal-item">
              <strong>Goal:</strong> ${g.goal} <br />
              <strong>Notes:</strong> {g.notes} <br />
              <strong>Due Date:</strong> {g.dueDate}
            </li>
          ))}
        </ul>
      </div>
      <div className="totals">
        <h3>Total Family Monthly Goal: ${totalFamilyMonthlyGoal.toFixed(2)}</h3>
        <h3>Total Family Yearly Goal: ${totalFamilyYearlyGoal.toFixed(2)}</h3>
      </div>
      <div className="contributions">
        <h3>Monthly Contributions</h3>
        <p>Mom: ${contributions.mom.monthly.toFixed(2)}</p>
        <p>Dad: ${contributions.dad.monthly.toFixed(2)}</p>
        <p>Child: ${contributions.child.monthly.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Page;
