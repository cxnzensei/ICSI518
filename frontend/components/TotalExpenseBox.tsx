import { TotalExpenseBoxProps } from '@/types'
import AnimatedCounter from './AnimatedCounter'
import DoughnutChart from './DoughnutChart'


const TotalExpenseBox = ({
    accounts = [], totalExpenses, category
}: TotalExpenseBoxProps) => {
    return (
        <section className='total-balance'>
            <div className='total-balance-chart'>
                <DoughnutChart accounts={accounts} />
            </div>
            <div className='flex flex-col gap-6'>
                <h2 className='header-2'>
                    Different Expenses: {totalExpenses}
                </h2>
                <div className='flex flex-col gap-2'>
                    <p className='total-balance-label'>
                        Total Current Balance
                    </p>
                    <div className='total-balance-amount flex-center gap-2'>
                        {category ? category.name : 'No Category'}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TotalExpenseBox