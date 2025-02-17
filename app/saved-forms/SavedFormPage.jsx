"use client";
import { useToast } from "@/components/toast/ToastProvider";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import FormCard from "./FormCard";
import NotFound from "@/public/not-found.svg";
import Image from "next/image";
import InfiniteScroll from "@/components/InfiniteScroll";
import { getSavedForms } from "@/server-actions/savedFormAction";
import LoadingFallback from "@/components/LoadingFallback";

const SavedFormPage = ({ success, forms: initialForms = [] }) => {
  const { addToast } = useToast();
  useEffect(() => {
    if (!success) {
      addToast("error", "Please Login, to see saved forms");
    }
  }, []);
  if (!success) {
    return (
      <div className="w-full h-screen text-center flex flex-col items-center justify-center gap-1 text-sm">
        <p>Please Login, to see saved forms</p>
        <Link
          href={"/auth/siginin"}
          className="bg-slate-400 px-4 py-2 text-white rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }
  if (Array.isArray(initialForms) && initialForms.length === 0) {
    return (
      <div className="w-full h-screen text-center flex flex-col  items-center justify-center gap-4  text-base text-gray-700 tracking-wider">
        <Image src={NotFound} alt="Not-found" width={200} />
        <p>You have no saved forms </p>
      </div>
    );
  }
  const fetchSavedForms = useCallback(async (page, limit ) => {
    try {
      const formsResponse = await getSavedForms(page, limit);
      if (!formsResponse.success) {
        return [];
      }
      return formsResponse?.data?.forms;
    } catch (error) {
      addToast("error", error.message);
      return [];
    }
  }, []);
  return (
    <div className="w-full h-full">
      <InfiniteScroll
        width="100%"
        height="100vh"
        scroll="vertical"
        page={1}
        fetchItems={fetchSavedForms}
        Card = {FormCard}
        cardProps = {{}}
        loadingSkeleton = {<LoadingFallback />}
        initialItems = {initialForms}
      />
    </div>
  );
};

export default SavedFormPage;
