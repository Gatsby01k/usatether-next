import React from "react";
export function Slider({ value=[0], min=0, max=100, step=1, onValueChange=()=>{}, className="", ...props }) {
  const v = Array.isArray(value) ? value[0] ?? 0 : 0;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e)=> onValueChange([Number(e.target.value)])}
      className={"w-full accent-white " + className}
      {...props}
    />
  );
}
