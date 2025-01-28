import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { FileIcon } from "lucide-react";
import { Button } from './ui/button';

const formatFileSize = (size: number): string => {
  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(2)} MB`;
  } else if (size >= 1_000) {
    return `${(size / 1_000).toFixed(2)} KB`;
  } else {
    return `${size} B`;
  }
};

export default function Items({ files, setFiles }: { files: File[] | null, setFiles: (files: File[] | null) => void }) {
  const totalFiles = files ? files.length : 0;
  const totalSize = files ? files.reduce((acc, file) => acc + file.size, 0) : 0;
  return (
    <div>
      {files && files.length > 0 && (
        <div className=" rounded-md border">
        <div className="px-4 pt-4 flex gap-2 items-center">
          <p>Items: {totalFiles}</p>
          <span>•</span>
          <p>Size: {formatFileSize(totalSize)}</p>
          <span>•</span>
          <Button variant="link" onClick={() => setFiles(null)} className='text-red-600'>Clear</Button>
        </div>
          <ScrollArea className="w-full h-96">
            <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file: File, index) => (
                <div key={index} className="bg-slate-200 p-2 rounded-sm">
                  <div className="flex items-center">
                    <FileIcon />
                    <p>{file.name}</p>
                  </div>
                  <div className="flex gap-4">
                    <p>{file.size} bytes</p>
                    <p>{file.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
