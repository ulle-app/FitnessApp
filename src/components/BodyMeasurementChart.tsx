import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Measurement {
  id: number;
  measurement_date: string;
  [key: string]: any;
}

interface BodyMeasurementChartProps {
  measurements: Measurement[];
  metric: string;
  metricLabel: string;
  metricUnit: string;
  color: string;
}

const BodyMeasurementChart: React.FC<BodyMeasurementChartProps> = ({
  measurements,
  metric,
  metricLabel,
  metricUnit,
  color
}) => {
  // Sort measurements by date (oldest to newest)
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
  );

  // Extract dates and values
  const dates = sortedMeasurements.map(m => 
    new Date(m.measurement_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  
  const values = sortedMeasurements.map(m => m[metric]);

  // Calculate trend line (simple linear regression)
  const calculateTrendLine = () => {
    const n = values.length;
    if (n < 2) return values;
    
    const indices = Array.from({ length: n }, (_, i) => i);
    
    // Calculate means
    const meanX = indices.reduce((sum, x) => sum + x, 0) / n;
    const meanY = values.reduce((sum, y) => sum + y, 0) / n;
    
    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (indices[i] - meanX) * (values[i] - meanY);
      denominator += (indices[i] - meanX) ** 2;
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = meanY - slope * meanX;
    
    // Generate trend line points
    return indices.map(i => slope * i + intercept);
  };

  const trendLine = calculateTrendLine();

  const data = {
    labels: dates,
    datasets: [
      {
        label: metricLabel,
        data: values,
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Trend',
        data: trendLine,
        borderColor: `${color}88`,
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#718096',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1a202c',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#2d3748',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${metricLabel}: ${context.raw} ${metricUnit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#2d374820',
        },
        ticks: {
          color: '#718096',
          font: {
            family: 'Inter, sans-serif',
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: '#2d374820',
        },
        ticks: {
          color: '#718096',
          font: {
            family: 'Inter, sans-serif',
            size: 10
          },
          callback: function(value: any) {
            return `${value} ${metricUnit}`;
          }
        }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default BodyMeasurementChart;