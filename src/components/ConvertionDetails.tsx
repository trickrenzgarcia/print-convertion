"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { CircleCheck, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { useToast } from '@/hooks/use-toast';

type ConvertionDetailsProps = {
  files: File[] | null;
  setFiles: (files: File[] | null) => void;
};

export type Data = {
  file: File;
  fullName: string;
  firstName: string;
  lastName: string;
  address: string;
  precinct: string;
  size: number;
  type: string;
};

export default function ConvertionDetails({
  files,
  setFiles,
}: ConvertionDetailsProps) {
  const [converting, setConverting] = React.useState(false);
  const { toast } = useToast()
  const totalFiles = files ? files.length : 0;
  const totalSize = files ? files.reduce((acc, file) => acc + file.size, 0) : 0;

  if (!totalFiles || !totalSize) return null;

  const extractLocationDetails = (file: File) => {
    const pathParts = file.webkitRelativePath.split("/"); // Split by directory separator

    // Exclude .DS_Store files
    if (file.name === ".DS_Store") {
      return null;
    }

    return {
      province: pathParts[0] || "Unknown",
      municipality: pathParts[1] || "Unknown",
      barangay: pathParts[2] || "Unknown",
    };
  };

  const locations = files
    ?.map(extractLocationDetails)
    .filter((details) => details !== null) as {
    province: string;
    municipality: string;
    barangay: string;
  }[];

  // Group files by province, then by municipality, and then barangay
  const groupedLocations = locations.reduce((acc, location) => {
    if (!acc[location.province]) {
      acc[location.province] = {};
    }
    if (!acc[location.province][location.municipality]) {
      acc[location.province][location.municipality] = new Set<string>();
    }
    acc[location.province][location.municipality].add(location.barangay);

    return acc;
  }, {} as Record<string, Record<string, Set<string>>>);

  // Function to draw wrapped text without breaking words
  function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, lineHeight: number, maxChars: number) {
    const words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
        // Check if adding the next word exceeds the maxChars limit
        if ((currentLine + ' ' + word).length <= maxChars) {
            currentLine = currentLine ? `${currentLine} ${word}` : word; // Add the word to the current line
        } else {
            ctx.fillText(currentLine, x, y); // Draw the current line
            y += lineHeight; // Move to the next line
            currentLine = word; // Start a new line with the current word
        }
    });

    // Draw the last line
    ctx.fillText(currentLine, x, y);
    return y + lineHeight; // Return the updated y position
  }

  const handleConvert = async () => {
    if (!files) return;
    setConverting(true);
    const datas: Data[] = files!.map((file) => {
      const splitFileName = file.name.split("_");
      const fullName = splitFileName[0].split("-").join(" ").toUpperCase();
      const precinct = splitFileName[1].split(".")[0].toUpperCase();
      const arrFullName = fullName.split(" ");
      // Get the first name except last index;
      const firstName = arrFullName.slice(0, arrFullName.length - 1).join(" ");
      const lastName = arrFullName[arrFullName.length - 1];

      const locationDetails = extractLocationDetails(file);
      const address = `${locationDetails?.barangay || "Unknown"}, ${locationDetails?.municipality || "Unknown"}, ${locationDetails?.province}`; // Combine municipal and barangay for the address
      return {
        file,
        fullName: fullName,
        firstName: firstName,
        lastName: lastName,
        address: address,
        precinct: precinct,
        size: file.size,
        type: file.type,
      };
    });
    const pdf = new jsPDF("portrait", "pt", "a4");
    const cardWidth = 234; // 3 1/4 inches in points
    const cardHeight = 144; // 2 inches in points
    const pageWidth = 595; // A4 width in points
    const xMargin = (pageWidth - 2 * cardWidth - 20) / 2; // Dynamic horizontal margin
    const yMargin = 30; // Top and bottom margin
    const spacing = 10; // Spacing between cards
    const cardsPerRow = 2; // Number of cards in each row
    const cardsPerColumn = 5; // Number of cards in each column

    let xOffset = xMargin;
    let yOffset = yMargin;
    let countData = 0;

    const qrImageCache = new Map<File, string>();

    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 600;
    
      const ctx = canvas.getContext("2d");
      const template = new Image();
      template.src = "/template.jpg";
    
      await new Promise<void>((resolve) => {
        template.onload = () => {
          if (!ctx) return;
          ctx.drawImage(template, 0, 0, 900, 600);
    
          // Set text styles
          ctx.fillStyle = "black";
          ctx.font = "bold 26px ALTGOT2N";
    
          let y = 301;
          y = drawWrappedText(ctx, data.firstName, 526, y, 27, 20);
          ctx.fillText(data.lastName, 525, 366);
          drawWrappedText(ctx, data.address, 510, 434, 28, 24);
          ctx.fillText(data.precinct, 521, 532);
    
          // QR Code Logic
          if (!qrImageCache.has(data.file)) {
            const qrImage = new Image();
            qrImage.src = URL.createObjectURL(data.file);
            qrImage.onload = () => {
              ctx.drawImage(qrImage, 30, 175, 385, 385);
              qrImageCache.set(data.file, canvas.toDataURL("image/jpeg", 0.7));
              resolve();
            };
          } else {
            const cachedQR = qrImageCache.get(data.file);
            const qrImage = new Image();
            qrImage.src = cachedQR!;
            qrImage.onload = () => {
              ctx.drawImage(qrImage, 30, 175, 385, 385);
              resolve();
            };
          }
        };
      });
    
      // Ensure the image is properly loaded before adding it to the PDF
      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      pdf.addImage(imgData, "JPEG", xOffset, yOffset, cardWidth, cardHeight);
    
      xOffset += cardWidth + spacing;
    
      // Move to the next row after every two cards
      if ((i + 1) % cardsPerRow === 0) {
        xOffset = xMargin;
        yOffset += cardHeight;
      }
    
      // Add a new page after 5 rows (10 cards)
      if ((i + 1) % (cardsPerRow * cardsPerColumn) === 0) {
        pdf.addPage();
        xOffset = xMargin;
        yOffset = yMargin;
      }
    }
    
    // Save PDF
    pdf.save(`ems_printed_ids-${Date.now()}.pdf`);

    // Get the existing logs from localStorage or initialize an empty array
    const existingLogs = JSON.parse(localStorage.getItem("logs") || "[]");

    // Transform the current groupedLocations into the structured format
    const structuredData = Object.entries(groupedLocations).map(
      ([province, municipals]) => {
        const municipalNames = Object.keys(municipals);
        const barangayNames = municipalNames.reduce<string[]>(
          (acc, municipal) => [...acc, ...Array.from(municipals[municipal])],
          []
        );

        // Count the total number of files for this province
        const provinceFileCount = files?.filter((file) => {
          const details = extractLocationDetails(file);
          return details?.province === province;
        }).length;

        return {
          province,
          municipals: municipalNames,
          barangay: barangayNames,
          count: provinceFileCount || 0,
          createdAt: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
        };
      }
    );

    // Filter out any provinces that already exist in the logs
    const newLogs = structuredData.filter(
      (newLog) =>
        !existingLogs.some(
          (existingLog: any) =>
            existingLog.province === newLog.province &&
            JSON.stringify(existingLog.municipals) ===
              JSON.stringify(newLog.municipals) &&
            JSON.stringify(existingLog.barangay) ===
              JSON.stringify(newLog.barangay)
        )
    );

    // Combine the new unique logs with the existing ones
    const updatedLogs = [...existingLogs, ...newLogs];

    // Save the updated logs back to localStorage
    localStorage.setItem("logs", JSON.stringify([...updatedLogs]));
    
    setConverting(false);
  };

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="hidden md:block shadow-sm p-0 md:col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-700">
                Files
              </CardTitle>
              <div className="flex flex-col items-end space-x-2">
                <span className="text-gray-700 text-sm">
                  Total Files: {totalFiles}
                </span>
                <span className="text-gray-700 text-sm">
                  Total Size: {totalSize}
                </span>
              </div>
            </div>
          </CardHeader>
          <ScrollArea className="w-full h-48 lg:h-96">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files &&
                    files.map((file, i) => (
                      <TableRow key={file.name + i}>
                        <TableCell className="font-mono text-sm">
                          {file.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {file.size}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </ScrollArea>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-700">
              Conversion Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-4 space-y-2">
              {Object.keys(groupedLocations).map((province) => (
                <div key={province} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-lg font-medium">Province</label>
                    <span className="text-lg font-bold">
                      {" "}
                      {province}
                    </span>
                  </div>

                  <ScrollArea className="w-full h-52">
                    {Object.keys(groupedLocations[province]).map(
                      (municipality) => (
                        <div key={municipality} className="border-b-2 pb-1">
                          <div className="space-y-4 mt-2">
                            <label className="text-lg font-medium">
                              Municipal
                            </label>
                            <span className="text-lg font-bold">
                              {" "}
                              {municipality}
                            </span>
                          </div>
                          <label className="text-lg">Barangay:</label>
                          <ul className="ml-6 list-decimal">
                            {Array.from(groupedLocations[province][municipality]).map((barangay) => {
                              const barangayFileCount = files?.filter((file) => {
                                const details = extractLocationDetails(file);
                                return details?.province === province &&
                                      details?.municipality === municipality &&
                                      details?.barangay === barangay;
                              }).length || 0;

                              return (
                                <li key={barangay} className="text-sm">
                                  {barangay} <span className="font-bold text-gray-600">({barangayFileCount})</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )
                    )}
                  </ScrollArea>
                  <div>
                    <div className="flex flex-col xl:flex-row items-center justify-between">
                      <div className="text-green-600 flex gap-1">
                        <CircleCheck />{" "}
                        <span className="font-bold">Ready Print</span>
                      </div>
                      <Button onClick={handleConvert} disabled={converting}>
                        {converting ? <span className='flex gap-1'><Loader2 className='animate-spin' /> Downloading...</span> : 'Download PDF'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
