import React from "react";
export function Toggle({ pressed=false, onPressedChange=()=>{}, className="", children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={"inline-flex select-none items-center rounded-md px-3 py-2 text-sm transition border " + (pressed ? "border-white/30 bg-white/20" : "border-white/20 bg-white/10") + " " + className}
      {...props}
    >{children}</button>
  );
}
