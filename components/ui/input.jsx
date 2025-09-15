import React from "react";
export function Input({ className = "", ...props }) {
  return <input className={"h-10 w-full rounded-lg border border-white/10 bg-transparent px-3 text-sm outline-none placeholder:text-white/40 " + className} {...props} />;
}
