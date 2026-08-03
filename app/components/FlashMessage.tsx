"use client";

export default function FlashMessage({ msg, type }: { msg: string; type: "success" | "error" }) {
  if (!msg) return null;
  const cls =
    type === "success"
      ? "bg-green-500/20 border-green-500/50 text-green-200"
      : "bg-red-500/20 border-red-500/50 text-red-200";
  return (
    <div className={`p-3 rounded border text-sm text-center ${cls}`}>{msg}</div>
  );
}
