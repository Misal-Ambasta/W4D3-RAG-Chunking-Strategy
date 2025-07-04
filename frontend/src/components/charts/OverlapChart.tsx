import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface OverlapChartProps {
  metadata: { index: number; overlap: number }[];
}

export const OverlapChart: React.FC<OverlapChartProps> = ({ metadata }) => {
  return (
    <div className="w-full h-64 mt-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base font-semibold">Overlap</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline cursor-help">?</span>
          </TooltipTrigger>
          <TooltipContent>Overlap: The number of characters or tokens shared between adjacent chunks.</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base font-semibold">Overlap Chart</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline cursor-help">?</span>
          </TooltipTrigger>
          <TooltipContent>Overlap: The number of characters or tokens shared between adjacent chunks.</TooltipContent>
        </Tooltip>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={metadata}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" label={{ value: "Chunk #", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Overlap", angle: -90, position: "insideLeft" }} />
          <RechartsTooltip />
          <Bar dataKey="overlap" fill="#f59e42" name="Overlap" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
