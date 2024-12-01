import { TotalIncomeBoxProps } from '@/types';
import DoughnutChartIncomes from './DoughnutChartIncomes';

const TotalIncomeBox = ({
  category = [], totalIncomes, categoryCount
}: TotalIncomeBoxProps) => {
  // Sort the categories by count in descending order and get the top 3
  const topCategories = categoryCount
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Calculate the total cost for the top 3 categories
  const totalCostTopCategories = topCategories.reduce((total, category) => total + category.totalCost, 0);

  return (
    <section className='total-balance'>
      <div className='total-balance-chart'>
        <DoughnutChartIncomes categoryCount={categoryCount} />
      </div>
      <div className='flex flex-col gap-6'>
        <h2 className='header-2'>
          Different Incomes: {totalIncomes}
        </h2>
        <div className='flex flex-col gap-2'>
          <p className='total-balance-label'>
            3 most popular categories:
          </p>
          <div className='flex gap-4'>
            {topCategories.map((category, index) => (
              <div key={index}>
                <div>
                  {category.name}: {category.count} ({((category.count / totalIncomes) * 100).toFixed(2)}%)
                </div>
                <div>
                  Total cost: ${category.totalCost.toFixed(2)}
                  </div>
              </div>
            ))}
          </div>
          <p className='total-balance-label'>
            Total cost for top 3 categories: ${totalCostTopCategories.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TotalIncomeBox;