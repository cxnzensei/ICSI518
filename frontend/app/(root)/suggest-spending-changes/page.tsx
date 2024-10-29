"use client";

import React, { useState, useEffect } from "react";

// Define types for expenses
type Expense = {
  category: string;
  amount: number;
};

type ComparisonExpense = {
  category: string;
  lastMonth: number;
  previousMonth: number;
  difference: number;
  percentageChange: number;
};

// Sample data for last and previous month's expenses
const lastMonthExpenses: Expense[] = [
  { category: "Rent", amount: 1200 },
  { category: "Groceries", amount: 450 },
  { category: "Dining Out", amount: 280 },
  { category: "Transportation", amount: 120 },
  { category: "Entertainment", amount: 160 },
  { category: "Shopping", amount: 220 },
  { category: "Utilities", amount: 200 },
];

const previousMonthExpenses: Expense[] = [
  { category: "Rent", amount: 1200 },
  { category: "Groceries", amount: 400 },
  { category: "Dining Out", amount: 250 },
  { category: "Transportation", amount: 100 },
  { category: "Entertainment", amount: 150 },
  { category: "Shopping", amount: 200 },
  { category: "Utilities", amount: 180 },
];

// Calculate comparison data
const calculateComparison = (lastMonth: Expense[], previousMonth: Expense[]): ComparisonExpense[] => {
  return lastMonth.map(expense => {
    const prevExpense = previousMonth.find(e => e.category === expense.category) || { amount: 0 };
    const difference = expense.amount - prevExpense.amount;
    return {
      category: expense.category,
      lastMonth: expense.amount,
      previousMonth: prevExpense.amount,
      difference,
      percentageChange: prevExpense.amount ? (difference / prevExpense.amount) * 100 : 0,
    };
  });
};

const SuggestSpendingChanges = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonExpense[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const comparison = calculateComparison(lastMonthExpenses, previousMonthExpenses);
    setComparisonData(comparison);

    const newSuggestions = lastMonthExpenses
      .filter(expense => expense.amount > 200)
      .map(expense => `Consider reducing spending on ${expense.category} by at least 10%.`);
    
    newSuggestions.push("Try cooking at home more to save on dining expenses.");
    newSuggestions.push("Set a budget for entertainment to control spending.");
    
    setSuggestions(newSuggestions);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "1200px", margin: "20px auto", padding: "20px", background: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      {/* Comparison Table */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "15px" }}>Spending Comparison</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "20px" }}>Category</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "20px" }}>Last Month</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "20px" }}>Previous Month</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "20px" }}>Difference</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "20px" }}>Percentage Change</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.category}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>${item.lastMonth.toFixed(2)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>${item.previousMonth.toFixed(2)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.difference > 0 ? `+${item.difference}` : item.difference}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.percentageChange.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Suggestions Section */}
      <div style={{ flex: 1, marginLeft: "20px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Suggestions for Reducing Spending</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suggestions.map((suggestion, index) => (
            <li key={index} style={{
              background: "#fff",
              margin: "8px 0",
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "18px",
            }}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuggestSpendingChanges;
