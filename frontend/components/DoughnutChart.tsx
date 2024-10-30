"use client";

import { DoughnutChartProps } from "@/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {


    const data = {
        datasets: [
            {
                label: 'Banks',
                data: accounts.map(account => account.availableBalance),
                // backgroundColor: ['#355E3B', '#00A36C', '#2AAA8A']
            }
        ],
        labels: accounts.map(account => account.name)
    }

    return <Doughnut
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
}

export default DoughnutChart