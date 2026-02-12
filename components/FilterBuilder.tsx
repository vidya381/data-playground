"use client";

import { FilterCondition, FilterOperator } from "@/lib/types";
import { getOperatorLabel } from "@/lib/utils";

interface FilterBuilderProps {
  columns: string[];
  filters: FilterCondition[];
  onChange: (filters: FilterCondition[]) => void;
}

const OPERATORS: FilterOperator[] = [
  "equals",
  "notEquals",
  "contains",
  "notContains",
  "startsWith",
  "endsWith",
  "greaterThan",
  "lessThan",
  "greaterThanOrEqual",
  "lessThanOrEqual",
  "isEmpty",
  "isNotEmpty",
];

export default function FilterBuilder({
  columns,
  filters,
  onChange,
}: FilterBuilderProps) {
  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      field: columns[0] || "",
      operator: "equals",
      value: "",
    };
    onChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter((f) => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    onChange(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const needsValue = (operator: FilterOperator) => {
    return operator !== "isEmpty" && operator !== "isNotEmpty";
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <button
          onClick={addFilter}
          disabled={columns.length === 0}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Filter
        </button>
      </div>

      {filters.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">
          No filters applied. Click "Add Filter" to start filtering data.
        </div>
      ) : (
        <div className="space-y-3">
          {filters.map((filter, index) => (
            <div
              key={filter.id}
              className="bg-white p-3 rounded border border-gray-200 space-y-2"
            >
              {/* Header with remove button */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Filter {index + 1}
                </span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              {/* Field selector */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Field
                </label>
                <select
                  value={filter.field}
                  onChange={(e) =>
                    updateFilter(filter.id, { field: e.target.value })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operator selector */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Operator
                </label>
                <select
                  value={filter.operator}
                  onChange={(e) =>
                    updateFilter(filter.id, {
                      operator: e.target.value as FilterOperator,
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {getOperatorLabel(op)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value input */}
              {needsValue(filter.operator) && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(filter.id, { value: e.target.value })
                    }
                    placeholder="Enter value..."
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filters.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          {filters.length} filter{filters.length !== 1 ? "s" : ""} active (AND
          logic)
        </div>
      )}
    </div>
  );
}
