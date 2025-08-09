// src/components/ScoreChart.js
// src/components/ScoreChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreChart = ({ value = 0 }) => {
  const data = {
    labels: ['Matched', 'Unmatched'],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#1976d2', '#e0e0e0'],
        hoverOffset: 6,
      },
    ],
  };

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <Box width={200}>
        <Doughnut data={data} />
      </Box>
      <Box>
        <Typography variant="h4">{value}%</Typography>
        <Typography variant="body2" color="text.secondary">ATS Match</Typography>
      </Box>
    </Box>
  );
};

export default ScoreChart;
