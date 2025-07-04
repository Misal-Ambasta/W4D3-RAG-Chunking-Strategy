import React from "react";
import { InfoIcon } from "lucide-react";

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group cursor-pointer">
    <InfoIcon className="inline-block ml-1 text-muted-foreground" size={16} />
    <span className="absolute left-1/2 z-10 hidden w-48 -translate-x-1/2 rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg group-hover:block">
      {text}
    </span>
  </span>
);
