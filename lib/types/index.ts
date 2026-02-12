/**
 * Core type definitions for Data Playground
 */

// Supported data formats
export type DataFormat = "json" | "csv" | null;

// Parse result from format detection
export interface ParseResult {
  success: boolean;
  data?: Array<Record<string, unknown>>;
  columns?: string[];
  error?: string;
}

// Column data types
export type ColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "null"
  | "object"
  | "array"
  | "mixed";

// Schema information for a column
export interface ColumnSchema {
  name: string;
  type: ColumnType;
  nullable: boolean;
  sampleValues?: unknown[];
}

// Filter operator types
export type FilterOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "isEmpty"
  | "isNotEmpty";

// Single filter condition
export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

// Transformation state
export interface Transformation {
  selectedColumns: string[]; // Empty = all columns
  filters: FilterCondition[];
}

// Main dataset state (will expand in later milestones)
export interface DataSet {
  rawInput: string;
  detectedFormat: DataFormat;
  parsedRows: Array<Record<string, unknown>>;
  columns: string[];
  errors: string[];
}
