"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from './ui/input';

type LogEntry = {
  province: string;
  municipals: string[];
  barangay: string[];
  count: number;
  createdAt: string;
};

export default function HistoryComponent() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // Fetch logs from localStorage
    const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]");
    setLogs(storedLogs);
  }, []);

  // Filter logs based on the search term
  const filteredLogs = logs.filter((log) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      log.municipals.some((municipal) =>
        municipal.toLowerCase().includes(lowercasedSearchTerm)
      ) || log.createdAt.toLowerCase().includes(lowercasedSearchTerm)
    );
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">History Logs</h2>
        <Input
          type="text"
          placeholder="Search by Municipal / Date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-64"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Province</TableHead>
            <TableHead>Municipals</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>File Count</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{log.province}</TableCell>
              <TableCell>{log.municipals.join(", ")}</TableCell>
              <TableCell>{log.barangay.join(", ")}</TableCell>
              <TableCell>{log.count}</TableCell>
              <TableCell>{log.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredLogs.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No results found.</p>
      )}
    </div>
  );
}