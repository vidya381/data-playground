"use client";

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  onChange: (selected: string[]) => void;
}

export default function ColumnSelector({
  columns,
  selectedColumns,
  onChange,
}: ColumnSelectorProps) {
  const allSelected =
    selectedColumns.length === 0 || selectedColumns.length === columns.length;

  const handleToggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(columns);
    }
  };

  const handleToggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      onChange(selectedColumns.filter((c) => c !== column));
    } else {
      onChange([...selectedColumns, column]);
    }
  };

  // If no columns selected, show all
  const displayedColumns =
    selectedColumns.length === 0 ? columns : selectedColumns;

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">Select Columns</h3>
        <button
          onClick={handleToggleAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {columns.map((column) => {
          const isSelected =
            selectedColumns.length === 0 || selectedColumns.includes(column);

          return (
            <label
              key={column}
              className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleColumn(column)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-mono text-sm text-gray-700">{column}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {displayedColumns.length} of {columns.length} columns selected
      </div>
    </div>
  );
}
