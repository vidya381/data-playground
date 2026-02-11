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

  // Try parsing as JSON first - accept any valid JSON
  try {
    JSON.parse(input);
    return "json";
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
 * Accepts arrays or objects with nested arrays
 */
export function parseJSON(input: string): ParseResult {
  try {
    const parsed = JSON.parse(input);

    let dataArray: Array<Record<string, unknown>> = [];

    // If it's already an array, use it
    if (Array.isArray(parsed)) {
      dataArray = parsed;
    }
    // If it's an object, try to extract array from common patterns
    else if (parsed && typeof parsed === "object") {
      // Check for common patterns: { data: [...] }, { results: [...] }, { items: [...] }
      const possibleKeys = ["data", "results", "items", "records", "rows"];
      for (const key of possibleKeys) {
        if (parsed[key] && Array.isArray(parsed[key])) {
          dataArray = parsed[key];
          break;
        }
      }

      // If no nested array found, wrap the object in an array
      if (dataArray.length === 0) {
        dataArray = [parsed];
      }
    } else {
      // Primitive value - wrap in object
      dataArray = [{ value: parsed }];
    }

    if (dataArray.length === 0) {
      return {
        success: false,
        error: "No data found to display",
      };
    }

    const columns = Object.keys(dataArray[0]);

    return {
      success: true,
      data: dataArray,
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
