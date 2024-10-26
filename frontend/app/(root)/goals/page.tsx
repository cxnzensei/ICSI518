"use client";

import HeaderBox from '@/components/HeaderBox';
import { getLoggedInUser } from '@/lib/utils';
import { loginResponse } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Goals() {

  const [loggedInUser, setLoggedInUser] = useState<loginResponse | null>(null);

  useEffect(() => {
    const user = getLoggedInUser();
    setLoggedInUser(user);
  }, [])

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome to your goals page,"
            user={loggedInUser?.firstName || 'Guest'}
            subtext="To adjust a goal, please select one of the following options."
          />
        </header>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/setting-budgets">
            <button className='bg-bankGradient' style={styles.button}>Setting Budgets</button>
          </Link>

          <Link href="/setting-goals">
            <button className='bg-bankGradient' style={styles.button}>Setting Goals</button>
          </Link>

          <Link href="/suggest-spending-changes">
            <button className='bg-bankGradient' style={styles.button}>Suggest Spending Changes</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '10px',
  },
};
