import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ChunkChartProps {
  metadata: { index: number; size: number; overlap: number }[];
}

export const ChunkChart: React.FC<ChunkChartProps> = ({ metadata }) => {
  return (
    <div className="w-full h-64 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={metadata}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" label={{ value: "Chunk #", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Size", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="size" fill="#6366f1" name="Chunk Size" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
