'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text } from '@radix-ui/themes';

interface UploadDropzoneProps {
  onFileUpload: (file: File) => void;
  onUploadSuccess?: (cid: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
}

export const UploadDropzone = ({ onFileUpload, onUploadSuccess, onUploadError, disabled }: UploadDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragReject 
  } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    disabled
  });

  return (
    <Box 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-cyan-500 bg-cyan-900/10' : 'border-gray-600'}
        ${isDragReject ? 'border-red-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Text className="text-gray-300">
        {isDragActive 
          ? 'Drop the file here...' 
          : 'Drag & drop a dataset file here, or click to select'}
      </Text>
      <Text className="text-gray-500 text-sm mt-2">
        Supported formats: CSV, JSON, TXT, PDF (Max 200MB)
      </Text>
    </Box>
  );
};