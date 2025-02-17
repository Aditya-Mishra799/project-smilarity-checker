"use client";
import { useToast } from "@/components/toast/ToastProvider";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import SessionCard from "./SessionCard";  // Assuming the new SessionCard is imported
import NotFound from "@/public/not-found.svg";
import Image from "next/image";
import InfiniteScroll from "@/components/InfiniteScroll";
import { getAllSessions } from "@/server-actions/sessionAction";  // Assuming the API for sessions
import LoadingFallback from "@/components/LoadingFallback";

const SavedSessionPage = ({ success, sessions: initialSessions = [] }) => {
  const { addToast } = useToast();

  // Handle not logged in
  useEffect(() => {
    if (!success) {
      addToast("error", "Please Login, to see saved sessions");
    }
  }, [success, addToast]);

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

  if (Array.isArray(initialSessions) && initialSessions.length === 0) {
    return (
      <div className="w-full h-screen text-center flex flex-col  items-center justify-center gap-4  text-base text-gray-700 tracking-wider">
        <Image src={NotFound} alt="Not-found" width={200} />
        <p>You have no saved sessions</p>
      </div>
    );
  }

  // Fetch sessions from server
  const fetchSessions = useCallback(async (page, limit) => {
    try {
      const sessionsResponse = await getAllSessions(page, limit);
      if (!sessionsResponse.success) {
        return [];
      }
      return sessionsResponse?.data?.sessions;
    } catch (error) {
      addToast("error", error.message);
      return [];
    }
  }, [addToast]);

  return (
    <div className="w-full h-full">
      <InfiniteScroll
        width="100%"
        height="100vh"
        scroll="vertical"
        page={1}
        fetchItems={fetchSessions}
        Card={SessionCard} 
        cardProps={{}}  
        loadingSkeleton={<LoadingFallback />}
        initialItems={initialSessions}
      />
    </div>
  );
};

export default SavedSessionPage;
