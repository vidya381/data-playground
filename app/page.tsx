"use client";

import { useState } from "react";
import Input from "@/components/Input";
import { ParseResult, DataFormat } from "@/lib/types";

export default function Home() {
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  const [currentFormat, setCurrentFormat] = useState<DataFormat>(null);

  const handleDataParsed = (result: ParseResult, format: DataFormat) => {
    setParsedData(result);
    setCurrentFormat(format);
  };

  return (
    <main className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Data Playground</h1>
        <p className="text-gray-600">
          Interactive JSON/CSV playground for inspection and conversion
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <section>
          <Input onDataParsed={handleDataParsed} />
        </section>

        {/* Preview Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          {parsedData?.success ? (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="mb-4 text-sm text-gray-600">
                <strong>Rows:</strong> {parsedData.data?.length || 0} |{" "}
                <strong>Columns:</strong> {parsedData.columns?.length || 0}
              </div>
              <div className="overflow-x-auto">
                <pre className="text-xs bg-white p-4 rounded border border-gray-200">
                  {JSON.stringify(parsedData.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-8 text-center text-gray-400">
              Paste or upload data to see preview...
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
