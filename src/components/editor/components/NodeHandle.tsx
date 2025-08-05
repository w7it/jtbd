import { Handle, HandleProps } from "@xyflow/react";

export function NodeHandle(props: HandleProps) {
  return (
    <Handle
      className="w-2.5 h-2.5 rounded-full !bg-gray-300/80 border-1 !border-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity"
      {...props}
    />
  );
}
