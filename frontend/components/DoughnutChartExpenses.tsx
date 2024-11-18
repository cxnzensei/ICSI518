"use client";

import { DoughnutChartExpensesProps } from "@/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChartExpenses = ({ categoryCount }: DoughnutChartExpensesProps) => {
  const data = {
    datasets: [
      {
        label: 'Expenses',
        data: categoryCount.map(category => category.count),
        backgroundColor: ['#355E3B', '#00A36C', '#2AAA8A'] // Add more colors if needed
      }
    ],
    labels: categoryCount.map(category => category.name)
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          }
        }
      }}
    />
  );
};

export default DoughnutChartExpenses;