import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ChunkListProps {
  chunks: string[];
  metadata: { index: number; size: number; overlap: number }[];
}

export const ChunkList: React.FC<ChunkListProps> = ({ chunks, metadata }) => {
  return (
    <div className="grid gap-4 mt-4">
      {chunks.map((chunk, i) => (
        <div key={i} className="border rounded-lg p-2 bg-card">
          <div className="text-xs text-muted-foreground mb-1 flex gap-2 items-center">
            <span className="flex items-center gap-1">
              <span>Chunk #{metadata[i]?.index ?? i}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="underline cursor-help">Chunk</span>
                </TooltipTrigger>
                <TooltipContent>Chunk: A segment of the document text created by the selected chunking strategy.</TooltipContent>
              </Tooltip>
            </span>
            |
            <span className="flex items-center gap-1">
              <span>Size: {metadata[i]?.size}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="underline cursor-help">Size</span>
                </TooltipTrigger>
                <TooltipContent>Size: The number of characters or tokens in this chunk.</TooltipContent>
              </Tooltip>
            </span>
            |
            <span className="flex items-center gap-1">
              <span>Overlap: {metadata[i]?.overlap}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="underline cursor-help">Overlap</span>
                </TooltipTrigger>
                <TooltipContent>Overlap: The number of characters or tokens shared with the previous chunk.</TooltipContent>
              </Tooltip>
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-40">{chunk}</pre>
        </div>
      ))}
    </div>
  );
};
