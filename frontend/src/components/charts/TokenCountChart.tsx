import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface TokenCountChartProps {
  tokenCounts: { index: number; tokens: number }[];
}

export const TokenCountChart: React.FC<TokenCountChartProps> = ({ tokenCounts }) => {
  return (
    <div className="w-full h-64 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tokenCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" label={{ value: "Chunk #", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Tokens", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="tokens" fill="#3b82f6" name="Token Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
