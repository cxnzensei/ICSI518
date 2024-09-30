

 // /app/goals/page.js
import HeaderBox from '@/components/ui/HeaderBox';
import Link from 'next/link';

export default function Goals() {
  const loggedIn = { firstName: "Team8" }

  return (


    <div style={{ padding: '20px' }}>
          <section className="home">
      <div className="home-content">
          <header className="home-header">
              <HeaderBox
                  type="greeting"
                  title="Welcome to your goals page,"
                  user={loggedIn?.firstName || 'Guest'}
                  subtext="To adjust a goal, please select one of the following options."
              />
            </header>
      </div>
    </section>

      <div>
        <Link href="/setting-budgets">
          <button style={styles.button}>Setting Budgets</button>
        </Link>
      </div>

      <div>
        <Link href="/setting-goals">
          <button style={styles.button}>Setting Goals</button>
        </Link>
      </div>

      <div>
        <Link href="/suggest-spending-changes">
          <button style={styles.button}>Suggest Spending Changes</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '10px',
  },
};
