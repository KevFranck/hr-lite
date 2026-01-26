export default function Badge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  const cls =
    normalized === "active"
      ? "bg-green-50 text-green-700 border-green-200"
      : normalized === "inactive"
        ? "bg-gray-100 text-gray-700 border-gray-200"
        : "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}
    >
      {value}
    </span>
  );
}
