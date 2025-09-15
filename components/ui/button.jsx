import React from "react";
export function Button({ className = "", variant, children, ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-white text-black hover:bg-white/90",
    outline: "border border-white/10 bg-white/5 text-white hover:bg-white/10"
  };
  const cls = [base, variant ? variants[variant] : variants.default, className].join(" ");
  return <button className={cls} {...props}>{children}</button>;
}
