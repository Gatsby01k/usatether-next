import React from "react";
export function Badge({ className = "", children, ...props }) {
  return <span className={"inline-flex items-center rounded-md px-2 py-1 text-xs " + className} {...props}>{children}</span>;
}
