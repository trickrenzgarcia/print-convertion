"use client"

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Items from './Items';
import PrintQRIDCardButton from './PrintQRIDCardButton';
import ConvertionDetails from './ConvertionDetails';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';


export default function ConvertComponent() {
  const [isClient, setIsClient] = useState(false);
  const [files, setFiles] = useState<File[] | null>([]);

  const isValidFile = (file: File) => {
    // Accept only images or non-empty files, excluding .DS_Store
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    return (
      file.name !== ".DS_Store" &&
      (validImageTypes.includes(file.type) || file.size > 0)
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(isValidFile);
    setFiles(validFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false, // Allow clicking to open file picker
    noKeyboard: true, // Disable keyboard shortcuts
  });

  useEffect(() => {
    console.log("Accepted files:", files);
  }, [files]);

  useEffect(() => {
    setIsClient(true);
  }, []) 

  if (!isClient) return null;

  return (
    <div className='space-y-5'>
      <div {...getRootProps()}>
        {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 mb-8 text-center transition-colors cursor-pointer
              ${isDragActive ? "border-primary bg-primary/5" : "border-gray-200"}`}
          >
            <input {...getInputProps()} {...{ webkitdirectory:"", directory: "" }}/>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">Drag and drop directories or files here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to select them</p>
            <Button>Select Files</Button>
          </div>
      </div>
      
      <ConvertionDetails
        files={files}
        setFiles={setFiles}
      />

      {/* <Items files={files} setFiles={setFiles} /> */}

      {/* <PrintQRIDCardButton files={files} setFiles={setFiles} /> */}
      
    </div>
  );
}
