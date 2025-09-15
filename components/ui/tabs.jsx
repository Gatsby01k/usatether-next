import React, { createContext, useContext, useState } from "react";
const TabsCtx = createContext(null);
export function Tabs({ defaultValue, className="", children }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsCtx.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsCtx.Provider>;
}
export function TabsList({ className="", children, ...props }) {
  return <div className={"rounded-lg p-1 " + className} {...props}>{children}</div>;
}
export function TabsTrigger({ value, children, ...props }) {
  const { value: v, setValue } = useContext(TabsCtx);
  const active = v === value;
  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      aria-pressed={active}
      className={"px-3 py-2 text-sm rounded-md transition " + (active ? "bg-white/20" : "hover:bg-white/10")}
      {...props}
    >{children}</button>
  );
}
export function TabsContent({ value, children, className="", ...props }) {
  const { value: v } = useContext(TabsCtx);
  if (v !== value) return null;
  return <div className={className} {...props}>{children}</div>;
}
