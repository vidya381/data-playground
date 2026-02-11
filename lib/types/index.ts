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

// Main dataset state (will expand in later milestones)
export interface DataSet {
  rawInput: string;
  detectedFormat: DataFormat;
  parsedRows: Array<Record<string, unknown>>;
  columns: string[];
  errors: string[];
}
