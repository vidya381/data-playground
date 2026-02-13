"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/Input";
import DataTable from "@/components/DataTable";
import SchemaPanel from "@/components/SchemaPanel";
import ColumnSelector from "@/components/ColumnSelector";
import FilterBuilder from "@/components/FilterBuilder";
import ExportPanel from "@/components/ExportPanel";
import {
  ParseResult,
  DataFormat,
  FilterCondition,
  Transformation,
} from "@/lib/types";
import { inferSchema, applyTransformations } from "@/lib/utils";

export default function Home() {
  const searchParams = useSearchParams();
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  const [currentFormat, setCurrentFormat] = useState<DataFormat>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string>("");

  // Transformation state
  const [transformation, setTransformation] = useState<Transformation>({
    selectedColumns: [],
    filters: [],
  });

  // Load session from URL on mount
  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (!sessionId) return;

    const loadSession = async () => {
      setIsLoadingSession(true);
      setSessionError("");

      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error("Session not found or expired");
        }

        const session = await response.json();

        // Set data
        const columns = Object.keys(session.data[0] || {});
        setParsedData({
          success: true,
          data: session.data,
          columns,
          format: session.format as DataFormat,
        });
        setCurrentFormat(session.format as DataFormat);

        // Set transformations
        setTransformation(session.transformations);
      } catch (error) {
        setSessionError(
          error instanceof Error ? error.message : "Failed to load session"
        );
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadSession();
  }, [searchParams]);

  const handleDataParsed = (result: ParseResult, format: DataFormat) => {
    setParsedData(result);
    setCurrentFormat(format);
    // Reset transformations when new data is loaded
    setTransformation({ selectedColumns: [], filters: [] });
  };

  // Apply transformations to data
  const transformedData = useMemo(() => {
    if (parsedData?.success && parsedData.data) {
      return applyTransformations(parsedData.data, transformation);
    }
    return [];
  }, [parsedData, transformation]);

  // Get columns to display (either selected or all)
  const displayColumns = useMemo(() => {
    if (!parsedData?.columns) return [];
    if (
      transformation.selectedColumns.length === 0 ||
      transformation.selectedColumns.length === parsedData.columns.length
    ) {
      return parsedData.columns;
    }
    return transformation.selectedColumns;
  }, [parsedData, transformation.selectedColumns]);

  // Infer schema from transformed data
  const schema = useMemo(() => {
    if (transformedData.length > 0) {
      return inferSchema(transformedData);
    }
    return [];
  }, [transformedData]);

  const hasTransformations =
    transformation.filters.length > 0 ||
    (transformation.selectedColumns.length > 0 &&
      transformation.selectedColumns.length !==
        (parsedData?.columns?.length || 0));

  return (
    <main className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Data Playground</h1>
        <p className="text-gray-600">
          Interactive JSON/CSV playground for inspection and conversion
        </p>
      </header>

      <div className="space-y-8">
        {/* Session Loading/Error */}
        {isLoadingSession && (
          <div className="max-w-4xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading shared session...</p>
          </div>
        )}
        {sessionError && (
          <div className="max-w-4xl p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{sessionError}</p>
          </div>
        )}

        {/* Input Section */}
        <section className="max-w-4xl">
          <Input onDataParsed={handleDataParsed} />
        </section>

        {/* Data & Transformations Section */}
        {parsedData?.success && parsedData.data && parsedData.columns ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold">
                {hasTransformations && (
                  <span className="text-gray-400 line-through mr-2">
                    {parsedData.data.length}
                  </span>
                )}
                {transformedData.length} rows
              </span>
              <span>•</span>
              <span className="font-semibold">
                {displayColumns.length} columns
              </span>
              {currentFormat && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {currentFormat.toUpperCase()}
                  </span>
                </>
              )}
              {hasTransformations && (
                <>
                  <span>•</span>
                  <span className="text-orange-600 font-medium">Filtered</span>
                </>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Data Table */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Data</h2>
                <DataTable data={transformedData} columns={displayColumns} />
              </section>

              {/* Right Sidebar */}
              <aside className="space-y-6">
                {/* Transformations */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">Transformations</h2>

                  <ColumnSelector
                    columns={parsedData.columns}
                    selectedColumns={transformation.selectedColumns}
                    onChange={(selected) =>
                      setTransformation((prev) => ({
                        ...prev,
                        selectedColumns: selected,
                      }))
                    }
                  />

                  <FilterBuilder
                    columns={parsedData.columns}
                    filters={transformation.filters}
                    onChange={(filters) =>
                      setTransformation((prev) => ({ ...prev, filters }))
                    }
                  />
                </section>

                {/* Export Panel */}
                <ExportPanel
                  data={transformedData}
                  currentFormat={currentFormat}
                />

                {/* Schema Panel */}
                <SchemaPanel schemas={schema} />
              </aside>
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
