import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaWeight, FaRuler, FaHeartbeat, FaDumbbell } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [selectedMetric, setSelectedMetric] = useState('weight');

  const metrics = {
    weight: {
      data: [80, 79, 78.5, 78, 77.5, 77, 76.5],
      label: 'Weight (kg)',
      color: '#ff2625'
    },
    bodyFat: {
      data: [20, 19.5, 19, 18.8, 18.5, 18.2, 18],
      label: 'Body Fat (%)',
      color: '#00c6ff'
    },
    strength: {
      data: [100, 105, 110, 112, 115, 118, 120],
      label: 'Bench Press (kg)',
      color: '#4CAF50'
    },
    cardio: {
      data: [25, 27, 28, 30, 32, 33, 35],
      label: 'Running (min)',
      color: '#FFC107'
    }
  };

  const dates = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12'];

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: metrics[selectedMetric].label,
        data: metrics[selectedMetric].data,
        fill: false,
        borderColor: metrics[selectedMetric].color,
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Progress Tracking'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  const stats = [
    {
      label: 'Current Weight',
      value: '76.5 kg',
      change: '-3.5 kg',
      icon: FaWeight
    },
    {
      label: 'Body Fat',
      value: '18%',
      change: '-2%',
      icon: FaRuler
    },
    {
      label: 'Max Bench Press',
      value: '120 kg',
      change: '+20 kg',
      icon: FaDumbbell
    },
    {
      label: 'Running Time',
      value: '35 min',
      change: '+10 min',
      icon: FaHeartbeat
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Progress Tracking</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <stat.icon className="text-primary text-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setSelectedMetric('weight')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'weight' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => setSelectedMetric('bodyFat')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'bodyFat' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Body Fat
          </button>
          <button
            onClick={() => setSelectedMetric('strength')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'strength' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Strength
          </button>
          <button
            onClick={() => setSelectedMetric('cardio')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedMetric === 'cardio' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Cardio
          </button>
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Progress;