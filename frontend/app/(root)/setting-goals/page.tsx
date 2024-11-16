'use client';

import React, { useState, useEffect } from "react";
import "./GoalsPage.css";

// Assuming these helpers are available in your utils
import { request, getLoggedInUser } from "@/lib/utils";

// Interfaces to type the data
interface Goal {
  goal: string;
  notes: string;
  dueDate: string;
  startDate: string;
}

interface FamilyMember {
  name: string;
  emailId: string;
  contribution: number; // percentage contribution
}

interface PageProps {
  navigateTo: (page: string) => void;
}

interface CreateGoalProps {
  navigateTo: (page: string) => void;
  familyMembersList: FamilyMember[];
  setFamilyMembersList: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  savedGoals: Goal[];
  setSavedGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

interface EditGoalProps {
  navigateTo: (page: string) => void;
  savedGoals: Goal[];
  setSavedGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

interface CheckStatusProps {
  navigateTo: (page: string) => void;
  savedGoals: Goal[];
  familyMembersList: FamilyMember[];
}

const WelcomePage = ({ navigateTo }: PageProps) => {
  return (
    <div className="welcome-container">
      <h1>Welcome to Family Goals</h1>
      <p>Manage your family's financial goals effectively.</p>
      <div className="button-group">
        <button className="button" onClick={() => navigateTo("create-goal")}>
          Create Goal
        </button>
        <button className="button" onClick={() => navigateTo("edit-goal")}>
          Edit Goal
        </button>
        <button className="button" onClick={() => navigateTo("check-status")}>
          Check Status
        </button>
      </div>
    </div>
  );
};

const CreateGoalPage = ({
  navigateTo,
  familyMembersList,
  setFamilyMembersList,
  savedGoals,
  setSavedGoals,
}: CreateGoalProps) => {
  const [yearlyGoal, setYearlyGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string | null>(null);
  const [remainingPercentage, setRemainingPercentage] = useState(100);

  useEffect(() => {
    const totalPercentage = familyMembersList.reduce((sum, member) => sum + member.contribution, 0);
    setRemainingPercentage(100 - totalPercentage);
  }, [familyMembersList]);

  const calculateMonths = () => {
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      const diffMonths = (due.getFullYear() - start.getFullYear()) * 12 + (due.getMonth() - start.getMonth());
      return Math.max(diffMonths, 1); // Minimum 1 month
    }
    return 12; // Default 12 months
  };

  const calculateMonthlyContribution = (goal: number, contributionPercentage: number) => {
    return (goal * (contributionPercentage / 100)) / calculateMonths();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (yearlyGoal) {
      setSavedGoals((prev: Goal[]) => [
        ...prev,
        { goal: yearlyGoal, notes, dueDate, startDate },
      ]);
      resetForm();
    }
  };

  const resetForm = () => {
    setYearlyGoal("");
    setNotes("");
    setDueDate("");
    setStartDate("");
    setFamilyMembersList((prev: FamilyMember[]) =>
      prev.map((member) => ({ ...member, contribution: 0 }))
    );
  };

  const handlePercentageChange = (percentage: number) => {
    if (selectedFamilyMember && percentage >= 0 && percentage <= remainingPercentage) {
      setFamilyMembersList((prevList: FamilyMember[]) =>
        prevList.map((member) =>
          member.emailId === selectedFamilyMember ? { ...member, contribution: percentage } : member
        )
      );
    }
  };

  return (
    <div className="container">
      <h1 className="title">Create a New Goal</h1>
      <form onSubmit={handleSubmit} className="goal-form">
        <label>Yearly Goal ($):</label>
        <input
          type="number"
          value={yearlyGoal}
          onChange={(e) => setYearlyGoal(e.target.value)}
          className="input"
          required
        />
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea"
        />
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input"
        />
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input"
        />
        <label>Select Family Member:</label>
        <select
          onChange={(e) => setSelectedFamilyMember(e.target.value)}
          value={selectedFamilyMember || ""}
          className="input"
        >
          <option value="">Select a family member</option>
          {familyMembersList.map((member) => (
            <option key={member.emailId} value={member.emailId}>
              {member.name} ({member.emailId})
            </option>
          ))}
        </select>
        {selectedFamilyMember && (
          <div className="family-member">
            <label>{selectedFamilyMember}'s Contribution Percentage:</label>
            <input
              type="number"
              value={
                familyMembersList.find((member) => member.emailId === selectedFamilyMember)?.contribution || 0
              }
              onChange={(e) => handlePercentageChange(parseFloat(e.target.value))}
              className="input"
              min="0"
              max={remainingPercentage}
            />
            <p>Remaining Percentage: {remainingPercentage}%</p>
          </div>
        )}
        <div className="goal-summary">
          <h3>Family Goal Details</h3>
          <p><strong>Total Goal:</strong> ${yearlyGoal}</p>
          <p><strong>Months: </strong>{calculateMonths()}</p>
          <ul>
            {familyMembersList.map((member) => (
              <li key={member.emailId}>
                <strong>{member.name}</strong> ({member.emailId}): 
                ${calculateMonthlyContribution(Number(yearlyGoal), member.contribution).toFixed(2)} per month
              </li>
            ))}
          </ul>
          {selectedFamilyMember && (
            <div>
              <p><strong>{familyMembersList.find((member) => member.emailId === selectedFamilyMember)?.name}</strong> 
                ({selectedFamilyMember}) will contribute 
                {familyMembersList.find((member) => member.emailId === selectedFamilyMember)?.contribution}% 
                of the goal.</p>
            </div>
          )}
        </div>
        <button type="submit" className="button">
          Save Goal
        </button>
        <button type="button" className="button secondary" onClick={() => navigateTo("welcome")}>
          Back to Home
        </button>
      </form>
    </div>
  );
};

const EditGoalPage = ({ navigateTo, savedGoals, setSavedGoals }: EditGoalProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editedGoal, setEditedGoal] = useState<Goal | null>(null);

  const handleGoalEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditedGoal(goal);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedGoal && selectedGoal) {
      setSavedGoals(savedGoals.map(goal =>
        goal === selectedGoal ? editedGoal : goal
      ));
      setSelectedGoal(null);
      setEditedGoal(null);
    }
  };

  const handleDeleteGoal = (index: number) => {
    setSavedGoals(savedGoals.filter((_, idx) => idx !== index));
  };

  return (
    <div className="container">
      <h1>Edit Goals</h1>
      {savedGoals.length > 0 ? (
        <ul>
          {savedGoals.map((goal: Goal, idx: number) => (
            <li key={idx}>
              <p>Goal: ${goal.goal}</p>
              <p>Notes: {goal.notes}</p>
              <p>Start Date: {goal.startDate}</p>
              <p>Due Date: {goal.dueDate}</p>
              <button className="button small" onClick={() => handleGoalEdit(goal)}>
                Edit
              </button>
              <button className="button small danger" onClick={() => handleDeleteGoal(idx)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved goals to edit.</p>
      )}
      {selectedGoal && editedGoal && (
        <form onSubmit={handleSaveChanges}>
          <label>Goal ($):</label>
          <input
            type="number"
            value={editedGoal.goal}
            onChange={(e) => setEditedGoal({ ...editedGoal, goal: e.target.value })}
          />
          <label>Notes:</label>
          <textarea
            value={editedGoal.notes}
            onChange={(e) => setEditedGoal({ ...editedGoal, notes: e.target.value })}
          />
          <label>Due Date:</label>
          <input
            type="date"
            value={editedGoal.dueDate}
            onChange={(e) => setEditedGoal({ ...editedGoal, dueDate: e.target.value })}
          />
          <label>Start Date:</label>
          <input
            type="date"
            value={editedGoal.startDate}
            onChange={(e) => setEditedGoal({ ...editedGoal, startDate: e.target.value })}
          />
          <button type="submit" className="button">
            Save Changes
          </button>
          <button className="button secondary" onClick={() => setSelectedGoal(null)}>
            Cancel
          </button>
        </form>
      )}
      <button className="button secondary" onClick={() => navigateTo("welcome")}>
        Back to Home
      </button>
    </div>
  );
};

const CheckStatusPage = ({ navigateTo, savedGoals, familyMembersList }: CheckStatusProps) => {
  const calculateProgress = (goal: Goal) => {
    const totalContribution = familyMembersList.reduce((sum, member) => {
      return sum + Number(goal.goal) * (member.contribution / 100);
    }, 0);
    const paid = Math.min(totalContribution, Number(goal.goal)); 
    const remaining = Number(goal.goal) - paid;

    return { paid, remaining };
  };

  return (
    <div className="container">
      <h1>Goal Status</h1>
      {savedGoals.length > 0 ? (
        savedGoals.map((goal, idx) => {
          const { paid, remaining } = calculateProgress(goal);
          return (
            <div key={idx} className="goal-status">
              <h2>Goal: ${goal.goal}</h2>
              <p>Notes: {goal.notes}</p>
              <p>Start Date: {goal.startDate}</p>
              <p>Due Date: {goal.dueDate}</p>
              <p><strong>Paid:</strong> ${paid.toFixed(2)}</p>
              <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>
              <h3>Contributions</h3>
              <ul>
                {familyMembersList.map((member) => (
                  <li key={member.emailId}>
                    <strong>{member.name}:</strong> $
                    {(Number(goal.goal) * (member.contribution / 100)).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      ) : (
        <p>No goals to display. Create a goal first!</p>
      )}
      <button className="button" onClick={() => navigateTo("welcome")}>
        Back to Home
      </button>
    </div>
  );
};

const Page = () => {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [savedGoals, setSavedGoals] = useState<Goal[]>([]);
  const [familyMembersList, setFamilyMembersList] = useState<FamilyMember[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const loggedInUser = getLoggedInUser();
      if (loggedInUser?.familyId) {
        const response = await request("GET", `/api/v1/families/${loggedInUser.familyId}`);
        setFamilyMembersList(response?.data?.members || []);
      }
    };
    initialize();
  }, []);

  const navigateTo = (page: string) => setCurrentPage(page);

  return (
    <div>
      {currentPage === "welcome" && <WelcomePage navigateTo={navigateTo} />}
      {currentPage === "create-goal" && (
        <CreateGoalPage
          navigateTo={navigateTo}
          familyMembersList={familyMembersList}
          setFamilyMembersList={setFamilyMembersList}
          savedGoals={savedGoals}
          setSavedGoals={setSavedGoals}
        />
      )}
      {currentPage === "edit-goal" && (
        <EditGoalPage
          navigateTo={navigateTo}
          savedGoals={savedGoals}
          setSavedGoals={setSavedGoals}
        />
      )}
      {currentPage === "check-status" && (
        <CheckStatusPage
          navigateTo={navigateTo}
          savedGoals={savedGoals}
          familyMembersList={familyMembersList}
        />
      )}
    </div>
  );
};

export default Page;
