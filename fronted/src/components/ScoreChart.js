// src/components/ScoreChart.js
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ScoreChart = ({ previousScores = [], latestScore = null }) => {
  const labels = [
    ...previousScores.map((_, idx) => `Attempt ${idx + 1}`),
    ...(latestScore !== null ? ["Latest"] : []),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "ATS Score",
        data: latestScore !== null ? [...previousScores, latestScore] : previousScores,
        fill: false,
        borderColor: "#1976d2",
        backgroundColor: "#1976d2",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Score (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Attempts",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ScoreChart;

