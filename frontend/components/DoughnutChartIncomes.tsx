"use client";

import { DoughnutChartIncomesProps } from "@/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChartIncomes = ({ categoryCount }: DoughnutChartIncomesProps) => {
  const data = {
    datasets: [
      {
        label: 'Incomes',
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

export default DoughnutChartIncomes;