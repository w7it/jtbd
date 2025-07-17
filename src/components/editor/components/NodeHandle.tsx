import { Handle, HandleProps } from "@xyflow/react";

export function NodeHandle(props: HandleProps) {
  return (
    <Handle
      className="w-3 h-3 !bg-gray-300 border-2 !border-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
      {...props}
    />
  );
}
