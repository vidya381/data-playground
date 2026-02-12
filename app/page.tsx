"use client";

import { useState, useMemo } from "react";
import Input from "@/components/Input";
import DataTable from "@/components/DataTable";
import SchemaPanel from "@/components/SchemaPanel";
import { ParseResult, DataFormat } from "@/lib/types";
import { inferSchema } from "@/lib/utils";

export default function Home() {
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  const [currentFormat, setCurrentFormat] = useState<DataFormat>(null);

  const handleDataParsed = (result: ParseResult, format: DataFormat) => {
    setParsedData(result);
    setCurrentFormat(format);
  };

  // Infer schema from parsed data
  const schema = useMemo(() => {
    if (parsedData?.success && parsedData.data) {
      return inferSchema(parsedData.data);
    }
    return [];
  }, [parsedData]);

  return (
    <main className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Data Playground</h1>
        <p className="text-gray-600">
          Interactive JSON/CSV playground for inspection and conversion
        </p>
      </header>

      <div className="space-y-8">
        {/* Input Section */}
        <section className="max-w-4xl">
          <Input onDataParsed={handleDataParsed} />
        </section>

        {/* Preview Section */}
        {parsedData?.success && parsedData.data && parsedData.columns ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold">
                {parsedData.data.length} rows
              </span>
              <span>•</span>
              <span className="font-semibold">
                {parsedData.columns.length} columns
              </span>
              {currentFormat && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {currentFormat.toUpperCase()}
                  </span>
                </>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Data Table */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Data</h2>
                <DataTable
                  data={parsedData.data}
                  columns={parsedData.columns}
                />
              </section>

              {/* Schema Panel */}
              <section>
                <SchemaPanel schemas={schema} />
              </section>
            </div>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-12 text-center text-gray-400">
            <p className="text-lg">Paste or upload data to see preview...</p>
            <p className="text-sm mt-2">
              Supports JSON arrays, objects, and CSV files
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
