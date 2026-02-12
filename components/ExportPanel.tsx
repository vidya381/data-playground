"use client";

import { useState } from "react";
import { DataFormat } from "@/lib/types";
import { toJSON, toCSV, downloadFile, copyToClipboard } from "@/lib/utils";

interface ExportPanelProps {
  data: Array<Record<string, unknown>>;
  currentFormat: DataFormat;
}

export default function ExportPanel({ data, currentFormat }: ExportPanelProps) {
  const [outputFormat, setOutputFormat] = useState<"json" | "csv">(
    currentFormat === "csv" ? "csv" : "json"
  );
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const content = outputFormat === "json" ? toJSON(data) : toCSV(data);
    const filename = `data-playground-export.${outputFormat}`;
    downloadFile(content, filename);
  };

  const handleCopy = async () => {
    const content = outputFormat === "json" ? toJSON(data) : toCSV(data);
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const previewContent = () => {
    const content = outputFormat === "json" ? toJSON(data) : toCSV(data);
    // Show first 10 lines
    return content.split("\n").slice(0, 10).join("\n");
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-3 text-gray-700">Export Data</h3>

      {/* Format Selection */}
      <div className="space-y-2 mb-4">
        <label className="block text-sm text-gray-600">Output Format</label>
        <div className="flex gap-2">
          <button
            onClick={() => setOutputFormat("json")}
            className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
              outputFormat === "json"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setOutputFormat("csv")}
            className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
              outputFormat === "csv"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            CSV
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Preview</label>
        <div className="bg-white border border-gray-300 rounded p-3 overflow-x-auto">
          <pre className="text-xs font-mono text-gray-700">
            {previewContent()}
            {data.length > 10 && (
              <span className="text-gray-400">
                {"\n"}... ({data.length - 10} more rows)
              </span>
            )}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleDownload}
          className="w-full px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
        >
          📥 Download {outputFormat.toUpperCase()}
        </button>
        <button
          onClick={handleCopy}
          className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
            copied
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {data.length} rows • {Object.keys(data[0] || {}).length} columns
      </div>
    </div>
  );
}
