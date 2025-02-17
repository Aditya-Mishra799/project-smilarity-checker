import useApiHandler from "@/hooks/useApiHandler";
import { deleteObject, getUploadURL } from "@/server-actions/s3Actions";
import axios from "axios";
import { Loader2, RefreshCcw, Trash, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const FileCard = ({
  name,
  progress,
  s3Key,
  isUploading,
  onDelete,
  onRestart,
  id,
}) => {
  const managedDeleteHandler = useApiHandler(onDelete);

  return (
    <div className="flex gap-2 justify-between items-center bg-gray-100 rounded p-2 w-full">
      <div className="w-full space-y-1">
        <p className="text-xs max-w-[180px] text-slate-700 text-ellipsis overflow-x-hidden text-nowrap">
          {name}
        </p>
        {isUploading && (
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div
              className={`bg-slate-700 h-1 rounded-l-full ${
                progress === 100 ? "rounded-r-full" : "rounded-r-none"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      {!isUploading &&
        (s3Key ? (
          <button
            className="px-2 py-2"
            onClick={managedDeleteHandler.execute}
            type="button"
            disabled={managedDeleteHandler.apiState.loading}
          >
            {managedDeleteHandler.apiState.loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash />
            )}
          </button>
        ) : (
          <button type="button" className="px-2 py-2" onClick={onRestart}>
            <RefreshCcw />
          </button>
        ))}
    </div>
  );
};

export default FileCard;
