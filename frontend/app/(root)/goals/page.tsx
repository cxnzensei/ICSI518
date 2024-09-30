

 // /app/goals/page.js
import Link from 'next/link';

export default function Goals() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>To adjust a goal, please select one of the following options. </h1>

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
