import jsPDF from "jspdf";
import { Button } from './ui/button';
import { type Data } from './PrintQRIDCardButton';


type Props = {
  datas: Data[];
  setData: (data: Data[] | null) => void;
};

const DownloadPDF = ({ datas, setData }: Props) => {
  
  const handleDownload = async () => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const cardWidth = 216; // 3 inches in points
    const cardHeight = 144; // 2 inches in points
    const pageWidth = 595; // A4 width in points
    const xMargin = (pageWidth - 2 * cardWidth - 20) / 2; // Dynamic horizontal margin
    const yMargin = 30; // Top and bottom margin
    const spacing = 20; // Spacing between cards
    const cardsPerRow = 2; // Number of cards in each row
    const cardsPerColumn = 6; // Number of cards in each column

    let xOffset = xMargin;
    let yOffset = yMargin;

    const qrImageCache = new Map<File, string>();

    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const canvas = document.createElement("canvas");
      canvas.width = 900; // Reduce dimensions if not necessary
      canvas.height = 600;

      const ctx = canvas.getContext("2d");
      const template = new Image();
      template.src = "/template.png";

      await new Promise<void>((resolve) => {
        template.onload = () => {
          ctx?.drawImage(template, 0, 0, 900, 600);

          if(!ctx) return;

          // Add text
          ctx.font = "26px Arial"; // Adjust font size for smaller card
          ctx.fillStyle = "black";
          ctx.fillText(`${data.fullName}`, 390, 320); // Adjusted coordinates
          ctx.fillText(`${data.precinct}`, 390, 410);

          // Add QR Code
          if (!qrImageCache.has(data.file)) {
            const qrImage = new Image();
            qrImage.src = URL.createObjectURL(data.file);

            qrImage.onload = () => {
              ctx.drawImage(qrImage, 50, 200, 300, 300); // Adjusted QR code size
              const compressedQR = canvas
                .toDataURL("image/jpeg", 0.7) // Compress QR image
                .slice(); // Save compressed image in cache
              qrImageCache.set(data.file, compressedQR);
              resolve();
            };
          } else {
            const cachedQR = qrImageCache.get(data.file);
            const qrImage = new Image();
            qrImage.src = cachedQR ? cachedQR : "";
            qrImage.onload = () => {
              ctx.drawImage(qrImage, 50, 200, 300, 300);
              resolve();
            };
          }
        };
        setData(null)
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.7); // Compress final card as JPEG

      // Draw the border
      pdf.setDrawColor(0); // Black border
      pdf.setLineWidth(2); // 1pt thickness
      pdf.rect(xOffset, yOffset, cardWidth, cardHeight); // Add border rectangle

      pdf.addImage(imgData, "JPEG", xOffset, yOffset, cardWidth, cardHeight);

      xOffset += cardWidth + spacing;

      // Move to the next row if the current row is full
      if ((i + 1) % cardsPerRow === 0) {
        xOffset = xMargin;
        yOffset += cardHeight + spacing;
      }

      // Add a new page if the current page is full
      if ((i + 1) % (cardsPerRow * cardsPerColumn) === 0) {
        pdf.addPage();
        xOffset = xMargin;
        yOffset = yMargin;
      }
    }

    pdf.save("Membership_IDs.pdf");
  };

  return <Button onClick={handleDownload}>Download PDF</Button>;
};

export default DownloadPDF;