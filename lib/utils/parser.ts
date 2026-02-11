/**
 * Data parsing utilities for JSON and CSV
 */

import Papa from "papaparse";
import { ParseResult, DataFormat } from "../types";

/**
 * Detect the format of input data
 */
export function detectFormat(input: string): DataFormat {
  if (!input.trim()) return null;

  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return "json";
    }
  } catch {
    // Not valid JSON, might be CSV
  }

  // Check if it looks like CSV (has commas and newlines)
  if (input.includes(",") && input.includes("\n")) {
    return "csv";
  }

  return null;
}

/**
 * Parse JSON input into rows and columns
 */
export function parseJSON(input: string): ParseResult {
  try {
    const parsed = JSON.parse(input);

    if (!Array.isArray(parsed)) {
      return {
        success: false,
        error: "JSON must be an array of objects",
      };
    }

    if (parsed.length === 0) {
      return {
        success: false,
        error: "JSON array is empty",
      };
    }

    const columns = Object.keys(parsed[0]);

    return {
      success: true,
      data: parsed,
      columns,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

/**
 * Parse CSV input into rows and columns
 */
export function parseCSV(input: string): ParseResult {
  try {
    const result = Papa.parse(input, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (result.errors.length > 0) {
      return {
        success: false,
        error: result.errors[0].message,
      };
    }

    if (result.data.length === 0) {
      return {
        success: false,
        error: "CSV is empty",
      };
    }

    const columns = Object.keys(result.data[0] as Record<string, unknown>);

    return {
      success: true,
      data: result.data as Array<Record<string, unknown>>,
      columns,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid CSV",
    };
  }
}
