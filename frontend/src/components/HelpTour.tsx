import React from "react";

export const HelpTour: React.FC = () => (
  <div className="fixed bottom-4 right-4 bg-card border shadow-lg rounded-lg p-4 max-w-xs">
    <div className="font-semibold mb-2">Quick Tour</div>
    <ul className="list-disc ml-4 text-xs text-muted-foreground">
      <li>Upload your PDF using the upload button.</li>
      <li>Select a chunking strategy and adjust parameters.</li>
      <li>Click 'Chunk & Visualize' to see results.</li>
      <li>View chunk charts, lists, and advanced visualizations.</li>
    </ul>
    <div className="mt-2 text-xs">Need more help? Check the FAQ or hover info icons.</div>
  </div>
);
