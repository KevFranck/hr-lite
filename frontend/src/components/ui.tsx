import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    />
  );
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  },
) {
  const { className = "", variant = "primary", ...rest } = props;
  const base =
    "rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const style =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-gray-800"
      : "bg-transparent hover:bg-gray-100";

  return <button {...rest} className={`${base} ${style} ${className}`} />;
}
