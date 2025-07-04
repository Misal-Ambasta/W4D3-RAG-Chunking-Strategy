import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StrategySelectorProps {
  id?: string;
  strategies: string[];
  value: string;
  onChange: (value: string) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ id, strategies, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-[240px]">
        <SelectValue placeholder="Select a strategy" />
      </SelectTrigger>
      <SelectContent>
        {strategies.map((strategy) => (
          <SelectItem key={strategy} value={strategy}>
            {strategy}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
