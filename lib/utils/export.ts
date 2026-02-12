/**
 * Data export utilities
 */

import Papa from "papaparse";

/**
 * Convert data to JSON string
 */
export function toJSON(
  data: Array<Record<string, unknown>>,
  pretty = true
): string {
  return JSON.stringify(data, null, pretty ? 2 : 0);
}

/**
 * Convert data to CSV string
 */
export function toCSV(data: Array<Record<string, unknown>>): string {
  return Papa.unparse(data);
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}
