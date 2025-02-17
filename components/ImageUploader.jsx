import { deleteObject, getUploadURL } from "@/server-actions/s3Actions";
import axios from "axios";
import { Upload } from "lucide-react";
import { Fascinate } from "next/font/google";
import React, { useEffect, useReducer, useRef, useState } from "react";
import FileCard from "./FileCard";
import Label from "./Label";
import useApiHandler from "@/hooks/useApiHandler";

const filesReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      const newSate = state.map((item) => {
        if (action.id === item.id) {
          return { ...item, ...action.payload };
        }
        return item;
      });
      return newSate;
    case "APPEND":
      return [...state, action.payload];
    case "REMOVE":
      return [...state.filter((item) => action.id != item.id)];
    case "FILL_WITH_VALUE":
      return action.payload.map((key) => ({
        name: key.split("/").at(-1),
        s3Key: key,
        isUploading: false,
        cancelToken: null,
        progress: 0,
        id: Math.random().toString(36).substring(2, 9) + Date.now(),
      }));
    case "RESET":
      return [];
    default:
      return state;
  }
};
const ImageUploader = ({
  name,
  onChange,
  ref,
  onBlur,
  value = [],
  className = "",
  error = null,
  label,
  acceptedTypes = ["jpeg", "png", "jpg"],
  minSize = 10 * 1024, // Minimum size in bytes (10 KB)
  maxSize = 5 * 1024 * 1024, // Maximum size in bytes (5 MB)

  ...props
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const [files, dispatchFiles] = useReducer(filesReducer, []);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  useEffect(() => {
    const newLinks = [];
    files.forEach((file) => {
      if (file?.s3Key) {
        newLinks.push(file?.s3Key);
      }
    });
    onChange(newLinks);
  }, [files]);

  useEffect(() => {
    dispatchFiles({ type: "FILL_WITH_VALUE", payload: value });
  }, []);
  const validateFiles = (inputFiles) => {
    const errors = [];
    const validFiles = [];
    Array.from(inputFiles).forEach((file) => {
      const fileType = file.type.split("/")[1];
      if (!acceptedTypes.includes(fileType)) {
        errors.push(`${file.name}: Unsupported file type.`);
      } else if (file.size < minSize) {
        errors.push(`${file.name}: File is too small.`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: File exceeds the size limit.`);
      } else {
        validFiles.push(file);
      }
    });

    setFileErrors(errors);
    return validFiles;
  };
  const startUploading = async (file) => {
    const ID = Math.random().toString(36).substring(2, 9) + Date.now();
    try {
      const uploadUrlRequest = await getUploadURL(file.name, file.type, true);
      if (!uploadUrlRequest.success) {
        throw new Error(uploadUrlRequest.message);
      }
      const { uploadUrl, key } = uploadUrlRequest.data;
      const cancelTokenSource = axios.CancelToken.source();
      dispatchFiles({
        type: "APPEND",
        payload: {
          s3Key: key,
          cancelToken: cancelTokenSource,
          isUploading: true,
          name: file.name,
          progress: 0,
          id: ID,
          fileObject: file,
        },
      });
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          const currentProgress = Math.round(
            (event.loaded * 100) / event.total
          );
          dispatchFiles({
            type: "UPDATE",
            payload: { progress: currentProgress },
            id: ID,
          });
        },
        cancelToken: cancelTokenSource.token,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Cancelled Forcefully", ID);
      } else {
        console.error(error.message);
      }
      dispatchFiles({
        type: "UPDATE",
        payload: { s3Key: null, progress: 0 },
        id: ID,
      });
    } finally {
      dispatchFiles({
        type: "UPDATE",
        payload: { isUploading: false, cancelToken: null },
        id: ID,
      });
    }
  };

  const deleteFile = async ({ s3Key, id, isUploading }) => {
    if (s3Key !== null && isUploading == false) {
      try {
        const deleteResponse = await deleteObject(s3Key);
        if (!deleteResponse.success) {
          throw new Error(deleteResponse.message);
        }
        dispatchFiles({ type: "REMOVE", id: id });
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const restartUpload = async ({ id, fileObject, isUploading }) => {
    if (!isUploading && fileObject) {
      try {
        const uploadUrlRequest = await getUploadURL(
          fileObject.name,
          fileObject.type,
          true
        );
        if (!uploadUrlRequest.success) {
          throw new Error(uploadUrlRequest.message);
        }
        const { uploadUrl, key } = uploadUrlRequest.data;
        const cancelTokenSource = axios.CancelToken.source();
        dispatchFiles({
          type: "UPDATE",
          id: id,
          payload: {
            cancelToken: cancelTokenSource,
            s3Key: key,
            isUploading: true,
            fileObject: fileObject,
            name: fileObject.name,
            progress: 0,
          },
        });
        await axios.put(uploadUrl, fileObject, {
          onUploadProgress: (event) => {
            const currentProgress = Math.round(
              (event.loaded * 100) / event.total
            );
            dispatchFiles({
              type: "UPDATE",
              id: id,
              payload: { progress: currentProgress },
            });
          },
          cancelToken: cancelTokenSource.token,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Cancelled Forcefully");
        } else {
          console.error(error.message);
        }
        dispatchFiles({
          type: "UPDATE",
          payload: { s3Key: null, progress: 0 },
          id: id,
        });
      } finally {
        dispatchFiles({
          type: "UPDATE",
          payload: { isUploading: false, cancelToken: null },
          id: id,
        });
      }
    }
  };
  // const abortUploading = ({ cancelToken, s3Key, isUploading }) => {
  //   if (s3Key !== null && cancelToken && isUploading === true) {
  //     cancelToken.cancel();
  //   }
  // };
  const handleFiles = (inputFiles) => {
    const validFiles = validateFiles(inputFiles);
    validFiles.map((file) => startUploading(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };
  return (
    <div className="w-full space-y-2">
      <Label label={label} htmlFor={name} />
      <div
        className={`flex flex-col justify-center items-center cursor-pointer border-2 border-dashed px-12 py-8 rounded-md transition-all duration-200 
          ${
            dragging
              ? "bg-slate-100 border-slate-800"
              : "bg-white border-slate-600"
          }
          ${error || fileErrors.length ? "border-red-500" : ""} ${className}`}
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileInput}
          multiple
        />
        <Upload className="text-slate-500" size={32} />
        <h3 className="text-center text-sm font-medium">
          Drop your files or, <strong>Browse</strong>
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Supports {acceptedTypes.map((type) => type.toUpperCase()).join(", ")}{" "}
          file types.
        </p>
      </div>
      <div className="mt-4 overflow-y-auto max-h-72">
        {files.length > 0 && (
          <div className="mt-4 flex flex-col flex-wrap gap-2 ">
            {files.map((file, idx) => (
              <FileCard
                key={file.name + idx}
                name={file.name}
                progress={file.progress}
                s3Key={file.s3Key}
                isUploading={file.isUploading}
                onDelete={() => deleteFile(file)}
                id={file.id}
                onRestart={() => restartUpload(file)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
