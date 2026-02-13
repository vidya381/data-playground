"use client";

import { useState } from "react";

interface SharePanelProps {
  data: Record<string, unknown>[];
  transformations: {
    selectedColumns: string[];
    filters: Array<{
      column: string;
      operator: string;
      value: string | string[];
    }>;
  };
  format: string;
}

export default function SharePanel({
  data,
  transformations,
  format,
}: SharePanelProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSaveAndShare = async () => {
    setIsLoading(true);
    setError("");
    setIsCopied(false);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          transformations,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save session");
      }

      const result = await response.json();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const url = `${appUrl}/?session=${result.id}`;
      setShareUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">Share Session</h3>
          <p className="text-sm text-gray-600 mt-1">
            Create a shareable link (expires in 7 days)
          </p>
        </div>
        <button
          onClick={handleSaveAndShare}
          disabled={isLoading || data.length === 0}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors whitespace-nowrap"
        >
          {isLoading ? "Saving..." : "Save & Share"}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {shareUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-mono"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isCopied
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Link will be accessible for 7 days from now
          </p>
        </div>
      )}
    </div>
  );
}
