"use client"

import React, { useEffect, useRef } from 'react'

type Data = {
  file: File;
  fullName: string;
  precinct: string;
  size: number;
  type: string;
}

export default function IDCard(data : Data) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if(!ctx) return;

      // Load Template ID Card
      const template = new Image();
      template.src = '/template.png';

      template.onload = () => {
        ctx.drawImage(template, 0, 0, 600, 400);

        // Add name and precinct
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(data.fullName, 200, 250);
        ctx.fillText(data.precinct, 200, 300);

        // Add QR Code
        const qrImage = new Image();
        qrImage.src = URL.createObjectURL(data.file);
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 50, 200, 100, 100);
        };
      }
    }
  }, [data])

  return <canvas ref={canvasRef} width={600} height={400} />;
}
