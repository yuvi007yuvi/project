import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface QRCodeDisplayProps {
  qrCodeId: string;
  locationName: string;
  area: string;
  supervisorName: string;
  contactNumber: string;
  uploadUrl: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeId,
  locationName,
  area,
  supervisorName,
  contactNumber,
  uploadUrl,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = await html2canvas(qrRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (210 - imgWidth) / 2; // Center on A4 page
      const y = 30;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`QR_${qrCodeId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    if (!qrRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${qrCodeId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .qr-container { text-align: center; max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrRef.current.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Generated QR Code
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      <div
        ref={qrRef}
        className="bg-white p-8 border-2 border-gray-300 rounded-lg"
      >
        <div className="text-center mb-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <QRCodeSVG
              value={uploadUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-left space-y-2 text-sm">
            <div className="flex">
              <span className="font-semibold w-32">QRCODEID:</span>
              <span className="text-blue-600 font-mono">{qrCodeId}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">LOCATION:</span>
              <span>{locationName}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">AREA:</span>
              <span>{area}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">SUPERVISOR:</span>
              <span>{supervisorName}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">HELPLINE NO.:</span>
              <span className="text-green-600 font-medium">
                {contactNumber}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Printing Date:</span>
              <span>{new Date().toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
