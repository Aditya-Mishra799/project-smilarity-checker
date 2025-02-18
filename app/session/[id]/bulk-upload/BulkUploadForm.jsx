'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/toast/ToastProvider';
import axios from 'axios';

const BulkUploadForm = ({ id, user }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile?.type !== 'text/csv') {
      addToast('error', 'Please upload a CSV file');
      return;
    }
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      addToast('error', 'Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('session_id', id);
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SIMILARITY_API_ENDPOINT_BASE_URL;
      const response = await axios.post(
        `${apiUrl}/bulk_add_projects/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      addToast('success', 'Upload completed successfully');
      setFile(null);
    } catch (error) {
      addToast(
        'error',
        error.response?.data?.message || 'Error uploading file'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Bulk Upload Projects
        </h1>
        <p className="text-gray-600">
          Upload a CSV file containing multiple projects to add them to this session.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload
            className={`w-12 h-12 ${
              isDragActive ? 'text-indigo-500' : 'text-gray-400'
            }`}
          />
          {isDragActive ? (
            <p className="text-indigo-500">Drop the CSV file here</p>
          ) : (
            <div>
              <p className="text-gray-600">
                Drag and drop a CSV file here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Only CSV files are accepted
              </p>
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="text-gray-500" />
            <span className="text-gray-700">{file.name}</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-gray-500 hover:text-gray-700"
            disabled={uploading}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-6 w-full py-2 px-4 rounded-md text-white font-medium
          ${
            !file || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }
          flex items-center justify-center space-x-2`}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Upload File</span>
          </>
        )}
      </button>

      {uploading && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          This process may take 5-8 minutes. Please keep this window open.
        </p>
      )}
    </div>
  );
};

export default BulkUploadForm;