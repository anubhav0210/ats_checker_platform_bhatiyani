// src/components/ScoreChart.js
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Radar chart for displaying score breakdown
const ScoreChart = ({ scores }) => {
  const data = {
    labels: ['Skills', 'Experience', 'Format', 'Keywords'],
    datasets: [
      {
        label: 'Resume Score',
        data: [scores.skills_score, scores.experience_score, scores.format_score, scores.keywords_score],
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={data} />;
};

export default ScoreChart;