import HeaderBox from '@/components/ui/HeaderBox'
import TotalBalanceBox from '@/components/ui/TotalBalanceBox'

const Home = () => {

  const loggedIn = { firstName: "Team8" }

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Manage your funds wisely. Access your transactions, goals and get insights towards them."
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
      </div>
    </section>
  )
}

export default Home