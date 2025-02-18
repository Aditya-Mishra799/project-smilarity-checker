"use client";
import { useToast } from "@/components/toast/ToastProvider";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import SessionCard from "./SessionCard";
import NotFound from "@/public/not-found.svg";
import Image from "next/image";
import { getAllSessions } from "@/server-actions/sessionAction";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import SessionFilters from "./SessionFilters";
import SessionSkeleton from "./SessionSkeleton";

const ITEMS_PER_PAGE = 10;

const SavedSessionPage = ({
  success,
  sessions: initialSessions = [],
  totalSessions: initialTotal = 0,
  totalPages: initialTotalPages = 1,
  currentPage: initialPage = 1,
  limit = ITEMS_PER_PAGE,
}) => {
  const { addToast } = useToast();
  const [sessions, setSessions] = useState(initialSessions);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalSessions, setTotalSessions] = useState(initialTotal);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!success) {
      addToast("error", "Please Login, to see saved sessions");
    }
  }, [success, addToast]);

  const fetchSessions = useCallback(async (page, filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const sessionsResponse = await getAllSessions(page, ITEMS_PER_PAGE, {
        search: filters.search,
        status: filters.status !== "all" ? filters.status : undefined,
      });

      if (!sessionsResponse.success) {
        setError(sessionsResponse.message);
        setSessions([]);
        return;
      }

      setSessions(sessionsResponse.data.sessions);
      setTotalPages(sessionsResponse.data.totalPages);
      setTotalSessions(sessionsResponse.data.totalSessions);
    } catch (error) {
      setError(error.message || "Failed to fetch sessions");
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
// debounce
  useEffect(() => {
    if (!error) {
      fetchSessions(currentPage, { search: searchTerm, status: statusFilter });
    }
  }, [currentPage, statusFilter, fetchSessions, error]);

  useEffect(() => {
    if (error) return;
    const handler = setTimeout(() => {
      fetchSessions(currentPage, { search: searchTerm, status: statusFilter });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleRefresh = () => {
    fetchSessions(currentPage, { search: searchTerm, status: statusFilter });
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/sessions/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sessions-export-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      addToast("error", "Failed to export sessions");
    } finally {
      setIsLoading(false);
    }
  };

  if (!success) {
    return (
      <div className="w-full h-screen text-center flex flex-col items-center justify-center gap-1 text-sm">
        <p>Please Login, to see saved sessions</p>
        <Link
          href={"/auth/signin"}
          className="bg-slate-400 px-4 py-2 text-white rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Filters Section */}
      <SessionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onExport={handleExport}
        isExportDisabled={isLoading || sessions.length === 0}
        totalSessions={totalSessions}
        currentCount={sessions.length}
      />

      {/* Error state with refresh button */}
      {error && (
        <div className="mt-6 text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      )}

      {/* Sessions grid */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          // Loading state with skeletons
          <div className="space-y-4 md:grid md:grid-cols-2 gap-2">
            {[...Array(3)].map((_, index) => (
              <SessionSkeleton key={index} />
            ))}
          </div>
        ) : sessions.length === 0 && !error ? (
          // No results state
          <div className="w-full text-center flex flex-col items-center justify-center gap-4 py-12">
            <Image src={NotFound} alt="Not-found" width={200} />
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No sessions found matching your criteria"
                : "You have no saved sessions"}
            </p>
          </div>
        ) : (
          // Sessions list
          <div className="space-y-4 md:grid md:grid-cols-2 gap-2 items-start">
            {sessions.map((session) => (
              <SessionCard key={session._id} {...session} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedSessionPage;
