/**
 * Schema inference utilities
 */

import { ColumnSchema, ColumnType } from "../types";

/**
 * Infer the type of a single value
 */
function inferValueType(value: unknown): ColumnType {
  if (value === null || value === undefined) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  const type = typeof value;

  if (type === "string") {
    // Check if it's a date string
    const strValue = value as string;
    const dateTest = new Date(strValue);
    if (!isNaN(dateTest.getTime()) && strValue.match(/^\d{4}-\d{2}-\d{2}/)) {
      return "date";
    }
    return "string";
  }

  if (type === "number") {
    return "number";
  }

  if (type === "boolean") {
    return "boolean";
  }

  if (type === "object") {
    return "object";
  }

  return "string";
}

/**
 * Infer schema for all columns in the dataset
 */
export function inferSchema(
  data: Array<Record<string, unknown>>
): ColumnSchema[] {
  if (data.length === 0) {
    return [];
  }

  const columns = Object.keys(data[0]);
  const schemas: ColumnSchema[] = [];

  for (const column of columns) {
    const types = new Set<ColumnType>();
    let hasNull = false;
    const sampleValues: unknown[] = [];

    // Sample first 100 rows for type inference
    const sampleSize = Math.min(100, data.length);
    for (let i = 0; i < sampleSize; i++) {
      const value = data[i][column];

      if (value === null || value === undefined) {
        hasNull = true;
      } else {
        types.add(inferValueType(value));
      }

      // Collect up to 3 sample values
      if (sampleValues.length < 3 && value !== null && value !== undefined) {
        sampleValues.push(value);
      }
    }

    // Determine primary type
    let primaryType: ColumnType = "string";
    if (types.size === 1) {
      primaryType = Array.from(types)[0];
    } else if (types.size > 1) {
      // Mixed types
      primaryType = "mixed";
    } else if (hasNull) {
      primaryType = "null";
    }

    schemas.push({
      name: column,
      type: primaryType,
      nullable: hasNull,
      sampleValues,
    });
  }

  return schemas;
}
