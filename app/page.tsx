"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/Input";
import DataTable from "@/components/DataTable";
import SchemaPanel from "@/components/SchemaPanel";
import ColumnSelector from "@/components/ColumnSelector";
import FilterBuilder from "@/components/FilterBuilder";
import ExportPanel from "@/components/ExportPanel";
import SharePanel from "@/components/SharePanel";
import {
  ParseResult,
  DataFormat,
  FilterCondition,
  Transformation,
} from "@/lib/types";
import { inferSchema, applyTransformations } from "@/lib/utils";

function HomeContent() {
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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Playground
          </h1>
          <p className="text-gray-600">Transform and convert JSON/CSV data</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 pb-12">
        <div className="space-y-6">
          {/* Session Loading/Error */}
          {isLoadingSession && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-teal-700">Loading shared session...</p>
            </div>
          )}
          {sessionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-red-700">{sessionError}</p>
            </div>
          )}

          {/* Input Section */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Input onDataParsed={handleDataParsed} />
          </section>

          {/* Data & Transformations Section */}
          {parsedData?.success && parsedData.data && parsedData.columns ? (
            <div className="space-y-6">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 px-1">
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
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                      {currentFormat.toUpperCase()}
                    </span>
                  </>
                )}
                {hasTransformations && (
                  <>
                    <span>•</span>
                    <span className="text-gray-700 font-medium">Filtered</span>
                  </>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* Data Table */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-0">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Data
                  </h2>
                  <DataTable data={transformedData} columns={displayColumns} />
                </section>

                {/* Right Sidebar */}
                <aside className="space-y-6 lg:order-last">
                  {/* Transformations */}
                  <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Transformations
                    </h2>

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
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <ExportPanel
                      data={transformedData}
                      currentFormat={currentFormat}
                    />
                  </div>

                  {/* Share Panel */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <SharePanel
                      data={parsedData.data}
                      transformations={transformation}
                      format={currentFormat || "json"}
                    />
                  </div>

                  {/* Schema Panel */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <SchemaPanel schemas={schema} />
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-16 text-center text-gray-400 shadow-sm">
              <p className="text-lg mb-2">No data loaded yet</p>
              <p className="text-sm">
                Paste or upload JSON/CSV data, or try a sample dataset above
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <HomeContent />
    </Suspense>
  );
}
