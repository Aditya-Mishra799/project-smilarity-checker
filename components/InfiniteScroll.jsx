import { appConfig } from "@/config/appConfig";
import useApiHandler from "@/hooks/useApiHandler";
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "./toast/ToastProvider";
const InfiniteScroll = ({
  page = 1,
  limit = appConfig.paginationItemsPerPage,
  fetchItems,
  cardProps = {},
  loadingSkeleton,
  hasMore = true,
  Card,
  initialItems = [],
  width = "100%", // Default width
  height = "100%", // Default height
  scroll = "vertical", // Can be 'vertical' or 'horizontal'
  className,
  reachedEndFallBack,
  ...props
}) => {
  const [items, setItems] = useState(initialItems);
  const { addToast } = useToast();
  const [paginationData, setPaginationData] = useState({
    currentPage: page,
    limit: limit,
    hasMore: true,
  });

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item?._id !== id));
  }, []);

  const fetchMoreData = useApiHandler(async () => {
    try {
      if (!paginationData.hasMore) return;
      const newItems = await fetchItems(
        paginationData.currentPage + 1,
        paginationData.limit
      );
      if (newItems.length === 0) {
        setPaginationData((prev) => ({ ...prev, hasMore: false }));
      }
      setItems((prev) => [...prev, ...newItems]);
      setPaginationData((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    } catch (error) {
      addToast("error", "Some error occurred while fetching the data");
    }
  });

  const handleScroll = (e) => {
    const scrollElement = e.target;

    if (scroll === "vertical") {
      if (
        scrollElement.scrollTop + scrollElement.clientHeight >=
        scrollElement.scrollHeight - 150
      ) {
        if (!fetchMoreData?.apiState?.loading && paginationData?.hasMore) {
          fetchMoreData.execute();
        }
      }
    } else if (scroll === "horizontal") {
      if (
        scrollElement.scrollLeft + scrollElement.clientWidth >=
        scrollElement.scrollWidth - 150
      ) {
        if (!fetchMoreData?.apiState?.loading && paginationData?.hasMore) {
          fetchMoreData.execute();
        }
      }
    }
  };

  useEffect(() => {
    const scrollContainer = document.getElementById(
      "infinite-scroll-container"
    );
    if (!scrollContainer || !paginationData.hasMore) return;
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, [fetchMoreData?.apiState?.loading, paginationData.hasMore]);

  return (
    <div
      id="infinite-scroll-container"
      className={`minimal-scroll  ${className} ${
        scroll === "vertical"
          ? "overflow-y-auto overflow-x-hidden"
          : "overflow-x-auto overflow-y-hidden"
      }`}
      style={{ width, height }}
      {...props}
    >
      <div
        className={`w-full flex  ${
          scroll === "vertical" ? "pr-2 flex-wrap" : "pb-2 items-center"
        } gap-2 `}
      >
        {items.length === 0 &&
          fetchMoreData?.apiState?.loading &&
          loadingSkeleton}

        {items.length > 0 &&
          items.map((item, index) => (
            <Card key={index} {...cardProps} {...item} onDelete = {removeItem}/>
          ))}

        {fetchMoreData?.apiState?.loading && (
          <div className="flex justify-center items-center">
            {loadingSkeleton}
          </div>
        )}
      </div>
      {(!paginationData.hasMore && reachedEndFallBack) && (
        <div className="w-full h-full flex justify-center">
          {reachedEndFallBack}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
