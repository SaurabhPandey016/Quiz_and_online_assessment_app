'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register the modular Chart.js structural components required for our graphs
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDataProps {
  registrationTrends: Array<{ date: string; count: number }>;
  attemptTrends: Array<{ date: string; count: number }>;
  popularQuizzes: Array<{ title: string; attemptCount: number }>;
}

export default function AdminCharts({ registrationTrends, attemptTrends, popularQuizzes }: ChartDataProps) {
  
  // 1. Map data for the User Activity & Registration Line Chart
  const lineChartData = {
    labels: registrationTrends.map(item => item.date),
    datasets: [
      {
        label: 'New Registrations',
        data: registrationTrends.map(item => item.count),
        borderColor: 'rgb(139, 92, 246)', // Violet color matching our layout theme
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3, // Adds a smooth curve animation to the lines
        fill: true,
      },
      {
        label: 'Quiz Attempts',
        data: attemptTrends.map(item => item.count),
        borderColor: 'rgb(16, 185, 129)', // Emerald color matching our student dashboard theme
        backgroundColor: 'transparent',
        tension: 0.3,
      }
    ]
  };

  // 2. Map data for the Most Popular Quizzes Horizontal Bar Chart
  const barChartData = {
    labels: popularQuizzes.map(item => item.title),
    datasets: [
      {
        label: 'Total Quiz Attempts',
        data: popularQuizzes.map(item => item.attemptCount),
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo theme color
        borderRadius: 8,
      }
    ]
  };

  // Common chart visual overrides for dark-theme dashboards
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' as const } }
      }
    },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } } }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Container Area 1: Activity Trends Line Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Platform Activity Trends</h3>
          <p className="text-[11px] text-slate-500">Tracking daily user registrations against quiz attempts.</p>
        </div>
        <div className="h-64 relative">
          <Line data={lineChartData} options={commonOptions} />
        </div>
      </div>

      {/* Container Area 2: Popularity Bar Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Most Popular Quizzes</h3>
          <p className="text-[11px] text-slate-500">Top 5 evaluation modules ranked by total attempts volume.</p>
        </div>
        <div className="h-64 relative">
          <Bar 
            data={barChartData} 
            options={{
              ...commonOptions,
              indexAxis: 'y' as const, // Rotates the graph to display rows cleanly for long quiz titles
            }} 
          />
        </div>
      </div>
    </div>
  );
}
