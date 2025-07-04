import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface StrategyPerformanceChartProps {
  data: { strategy: string; metric: number }[];
}

export const StrategyPerformanceChart: React.FC<StrategyPerformanceChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="strategy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="metric" fill="#10b981" name="Performance Metric" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
