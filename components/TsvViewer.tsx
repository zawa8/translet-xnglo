"use client";

import React, { useEffect, useState, useRef } from "react";

export default function TsvViewer() {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Find Popup States
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isRegex, setIsRegex] = useState<boolean>(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("all");
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchTsv() {
      try {
        const res = await fetch("/api/get-tsv");
        if (!res.ok) {
          throw new Error("Failed to load TSV data.");
        }
        const text = await res.text();
        
        const rows = text
          .trim()
          .split("\n")
          .map((row) => row.split("\t"));
        
        setData(rows);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTsv();
  }, []);

  // Global shortcut (Ctrl+F / Cmd+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (loading) return <div className="p-4 text-center">Loading TSV data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const rawHeaders = data[0] || [];
  const rawRows = data.slice(1);

  // Only keep these target columns
  const allowedColumns = ["e23", "x38", "xv38"];

  const validIndices = allowedColumns
    .map((target) => rawHeaders.findIndex((h) => h.trim().toLowerCase() === target))
    .filter((index) => index !== -1);

  const headers = validIndices.map((i) => rawHeaders[i]);
  const rows = rawRows.map((row) => validIndices.map((i) => row[i] || ""));

  // Build regex safely if enabled
  let regex: RegExp | null = null;
  if (searchTerm.trim() !== "" && isRegex) {
    try {
      regex = new RegExp(searchTerm, "i");
    } catch (e) {
      regex = null;
    }
  }

  // Filter rows safely without triggering stack overflow
  const filteredRows = rows.filter((row) => {
    if (!searchTerm.trim()) return true;

    if (selectedColumn !== "all") {
      const colIndex = headers.findIndex((h) => h === selectedColumn);
      if (colIndex === -1) return true;
      const cell = row[colIndex] || "";
      if (isRegex && regex) {
        return regex.test(cell);
      }
      return cell.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return row.some((cell) => {
      if (isRegex && regex) {
        return regex.test(cell);
      }
      return cell.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return (
    <div className="my-4 relative">
      {/* Top Bar Trigger */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 transition flex items-center gap-2"
        >
          <span>Find...</span>
          <kbd className="bg-gray-900 px-1.5 py-0.5 text-xs rounded text-gray-400 border border-gray-700">Ctrl+F</kbd>
        </button>
        <span className="text-sm text-gray-400">
          Showing {filteredRows.length} of {rows.length} entries
        </span>
      </div>

      {/* Floating Find Dialog Popup */}
      {isOpen && (
        <div className="fixed top-20 right-8 z-50 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl w-80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-200">Find in Table</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200 text-sm font-bold px-1.5 py-0.5 rounded bg-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Column Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Search Column</label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Columns</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              placeholder={isRegex ? "Enter regex pattern..." : "Search text..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* Checkbox Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isRegex}
                  onChange={(e) => setIsRegex(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Regex</span>
              </label>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-gray-400 hover:text-gray-200 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Display */}
      <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-700 text-left text-sm">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 font-semibold uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900 text-gray-300">
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-800/50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-4 py-6 text-center text-gray-500">
                  No matching entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}