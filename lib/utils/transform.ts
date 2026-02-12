/**
 * Data transformation utilities
 */

import { FilterCondition, FilterOperator, Transformation } from "../types";

/**
 * Apply a single filter condition to a row
 */
function applyFilter(
  row: Record<string, unknown>,
  filter: FilterCondition
): boolean {
  const value = row[filter.field];
  const filterValue = filter.value;

  switch (filter.operator) {
    case "equals":
      return String(value) === String(filterValue);

    case "notEquals":
      return String(value) !== String(filterValue);

    case "greaterThan":
      return Number(value) > Number(filterValue);

    case "lessThan":
      return Number(value) < Number(filterValue);

    case "greaterThanOrEqual":
      return Number(value) >= Number(filterValue);

    case "lessThanOrEqual":
      return Number(value) <= Number(filterValue);

    case "contains":
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());

    case "notContains":
      return !String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());

    case "startsWith":
      return String(value)
        .toLowerCase()
        .startsWith(String(filterValue).toLowerCase());

    case "endsWith":
      return String(value)
        .toLowerCase()
        .endsWith(String(filterValue).toLowerCase());

    case "isEmpty":
      return (
        value === null || value === undefined || String(value).trim() === ""
      );

    case "isNotEmpty":
      return (
        value !== null && value !== undefined && String(value).trim() !== ""
      );

    default:
      return true;
  }
}

/**
 * Apply transformations to dataset
 */
export function applyTransformations(
  data: Array<Record<string, unknown>>,
  transformation: Transformation
): Array<Record<string, unknown>> {
  let result = [...data];

  // Apply filters
  if (transformation.filters.length > 0) {
    result = result.filter((row) => {
      // All filters must pass (AND logic)
      return transformation.filters.every((filter) => applyFilter(row, filter));
    });
  }

  // Apply column selection
  if (
    transformation.selectedColumns.length > 0 &&
    transformation.selectedColumns.length < Object.keys(data[0] || {}).length
  ) {
    result = result.map((row) => {
      const newRow: Record<string, unknown> = {};
      transformation.selectedColumns.forEach((col) => {
        newRow[col] = row[col];
      });
      return newRow;
    });
  }

  return result;
}

/**
 * Get filter operator display name
 */
export function getOperatorLabel(operator: FilterOperator): string {
  const labels: Record<FilterOperator, string> = {
    equals: "Equals (=)",
    notEquals: "Not Equals (≠)",
    greaterThan: "Greater Than (>)",
    lessThan: "Less Than (<)",
    greaterThanOrEqual: "Greater or Equal (≥)",
    lessThanOrEqual: "Less or Equal (≤)",
    contains: "Contains",
    notContains: "Not Contains",
    startsWith: "Starts With",
    endsWith: "Ends With",
    isEmpty: "Is Empty",
    isNotEmpty: "Is Not Empty",
  };
  return labels[operator];
}
