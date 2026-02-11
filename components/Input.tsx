"use client";

import { useState, ChangeEvent } from "react";
import { detectFormat, parseJSON, parseCSV } from "@/lib/utils";
import { DataFormat, ParseResult } from "@/lib/types";

interface InputProps {
  onDataParsed: (result: ParseResult, format: DataFormat) => void;
}

export default function Input({ onDataParsed }: InputProps) {
  const [inputText, setInputText] = useState("");
  const [detectedFormat, setDetectedFormat] = useState<DataFormat>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setError(null);

    if (!text.trim()) {
      setDetectedFormat(null);
      return;
    }

    // Detect format
    const format = detectFormat(text);
    setDetectedFormat(format);

    // Parse based on format
    if (format === "json") {
      const result = parseJSON(text);
      if (result.success) {
        onDataParsed(result, format);
      } else {
        setError(result.error || "Failed to parse JSON");
      }
    } else if (format === "csv") {
      const result = parseCSV(text);
      if (result.success) {
        onDataParsed(result, format);
      } else {
        setError(result.error || "Failed to parse CSV");
      }
    } else {
      setError("Unrecognized format. Please paste valid JSON or CSV data.");
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);

      // Trigger the same logic as text change
      const format = detectFormat(text);
      setDetectedFormat(format);

      if (format === "json") {
        const result = parseJSON(text);
        if (result.success) {
          onDataParsed(result, format);
        } else {
          setError(result.error || "Failed to parse JSON");
        }
      } else if (format === "csv") {
        const result = parseCSV(text);
        if (result.success) {
          onDataParsed(result, format);
        } else {
          setError(result.error || "Failed to parse CSV");
        }
      } else {
        setError("Unrecognized format");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Input</h2>
        {detectedFormat && (
          <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            {detectedFormat.toUpperCase()} detected
          </span>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder="Paste your JSON or CSV data here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-2">
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
          >
            📁 Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json,.csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="text-sm text-gray-500">or paste directly above</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
