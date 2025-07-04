import React from "react";
// Placeholder for a heatmap visualization (could use a heatmap library or recharts)

interface SemanticSimilarityHeatmapProps {
  data: number[][]; // 2D matrix of similarity scores
}

export const SemanticSimilarityHeatmap: React.FC<SemanticSimilarityHeatmapProps> = ({ data }) => {
  // For demo, render as a grid of colored divs
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
      {data.flat().map((value, idx) => (
        <div
          key={idx}
          className="w-4 h-4"
          style={{ background: `rgba(59,130,246,${value})` }}
          title={value.toFixed(2)}
        />
      ))}
    </div>
  );
};
