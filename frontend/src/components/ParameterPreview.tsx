import React from "react";

export const ParameterPreview: React.FC<{ param: string; value: any }> = ({ param, value }) => (
  <div className="text-xs text-muted-foreground my-1">
    <b>{param}:</b> {String(value)}
  </div>
);
