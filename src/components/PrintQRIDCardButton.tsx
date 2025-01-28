import React from 'react'
import { Button } from './ui/button'
import DownloadPDF from './DownloadPDF';

export type Data = {
  file: File;
  fullName: string;
  precinct: string;
  size: number;
  type: string;
}

export default function PrintQRIDCardButton({ files }: { files: File[] | null, setFiles: (files: File[] | null) => void }) {
  const [data, setData] = React.useState<Data[] | null>([]);

  const handleConvert = () => {
    if(!files) return;

    const datas: Data[] = files!.map((file) => {
      const splitFileName = file.name.split("_");
      const fullName = splitFileName[0].split("-").join(" ").toUpperCase();
      const precinct = splitFileName[1].split(".")[0].toUpperCase();
      return {
        file,
        fullName: fullName,
        precinct: precinct,
        size: file.size,
        type: file.type
      }
    });
    setData(datas)
  }
  
  return (
    <>
      {files && files.length > 0 && (
        <Button
        disabled={!files}
        onClick={handleConvert}
      >
        Convert
      </Button>
      )}
      {data && data.length > 0 && (
        <DownloadPDF datas={data} setData={setData} />
      )}
    </>
  )
}
