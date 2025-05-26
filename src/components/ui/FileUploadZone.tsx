
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from './button';

export interface FileUploadZoneProps {
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
}

export function FileUploadZone({ 
  onFilesChange, 
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4,.zip",
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024 // 10MB
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  }, [uploadedFiles, maxFiles, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'audio/mpeg': ['.mp3'],
      'video/mp4': ['.mp4'],
      'application/zip': ['.zip']
    },
    maxSize: maxSizeBytes,
    maxFiles: maxFiles - uploadedFiles.length
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-justice-primary bg-justice-primary/10' 
            : 'border-justice-light/30 hover:border-justice-primary/50'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-justice-light/50 mx-auto mb-4" />
        <p className="text-justice-light mb-2">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files or click to browse'}
        </p>
        <p className="text-sm text-justice-light/70">
          Supports: PDF, DOC, Images, Audio, Video, ZIP (max {maxFiles} files, {Math.round(maxSizeBytes / 1024 / 1024)}MB each)
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-justice-primary" />
                <div>
                  <p className="text-sm text-white">{file.name}</p>
                  <p className="text-xs text-justice-light/70">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
