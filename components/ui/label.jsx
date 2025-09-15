import React from "react";
export function Label({ className = "", htmlFor, children }) {
  return <label htmlFor={htmlFor} className={"text-sm " + className}>{children}</label>;
}
