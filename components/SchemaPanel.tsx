import { ColumnSchema } from "@/lib/types";

interface SchemaPanelProps {
  schemas: ColumnSchema[];
}

const typeColors: Record<string, string> = {
  string: "bg-gray-100 text-gray-700",
  number: "bg-gray-100 text-gray-700",
  boolean: "bg-gray-100 text-gray-700",
  date: "bg-gray-100 text-gray-700",
  null: "bg-gray-100 text-gray-600",
  object: "bg-gray-100 text-gray-700",
  array: "bg-gray-100 text-gray-700",
  mixed: "bg-gray-100 text-gray-700",
};

export default function SchemaPanel({ schemas }: SchemaPanelProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-3 text-gray-700">Schema</h3>
      <div className="space-y-2">
        {schemas.map((schema) => (
          <div
            key={schema.name}
            className="flex items-start gap-3 text-sm bg-white p-3 rounded border border-gray-200"
          >
            <div className="flex-1 min-w-0">
              <div className="font-mono font-medium text-gray-900 truncate">
                {schema.name}
              </div>
              {schema.sampleValues && schema.sampleValues.length > 0 && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  Sample: {schema.sampleValues.slice(0, 2).join(", ")}
                  {schema.sampleValues.length > 2 && "..."}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  typeColors[schema.type] || typeColors.string
                }`}
              >
                {schema.type}
              </span>
              {schema.nullable && (
                <span className="text-xs text-gray-400">nullable</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        {schemas.length} column{schemas.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
