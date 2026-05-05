import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function PriceChart({ history = [], forecast = [] }) {
  const labels = [...history, ...forecast].map((point) => point.date);

  const data = {
    labels,
    datasets: [
      {
        label: "Historical Price (Rs/quintal)",
        data: history.map((point) => point.price),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.4
      },
      {
        label: "Forecast Price (Rs/quintal)",
        data: [
          ...history.map(() => null),
          ...forecast.map((point) => point.price)
        ],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" }
    },
    scales: {
      y: { ticks: { callback: (value) => `₹${value}` } }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}
