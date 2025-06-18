import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scan,
  Upload,
  Camera,
  QrCode,
  ArrowRight,
  Smartphone,
  Globe,
} from "lucide-react";
import QRScanner from "../components/QRScanner";

const ScannerPage: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string>("");
  const navigate = useNavigate();

  const handleScanSuccess = (result: string) => {
    setScannedUrl(result);
    setShowScanner(false);

    // Extract QR code ID from the scanned URL
    try {
      const url = new URL(result);
      const pathParts = url.pathname.split("/");
      const uploadIndex = pathParts.indexOf("upload");

      if (uploadIndex !== -1 && pathParts[uploadIndex + 1]) {
        const qrCodeId = pathParts[uploadIndex + 1];
        // Navigate to the upload page
        navigate(`/upload/${qrCodeId}`);
      } else {
        // If it's not a valid upload URL, show error
        alert(
          "Invalid QR code. Please scan a valid municipal photo system QR code.",
        );
      }
    } catch (error) {
      // If URL parsing fails, try to extract QR code ID directly
      const qrCodeMatch = result.match(/\/upload\/([^\/\?]+)/);
      if (qrCodeMatch) {
        navigate(`/upload/${qrCodeMatch[1]}`);
      } else {
        alert(
          "Invalid QR code format. Please scan a valid municipal photo system QR code.",
        );
      }
    }
  };

  const startScanning = () => {
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <QrCode className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Municipal Photo Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scan QR codes to upload before and after photos for municipal
            documentation
          </p>
        </div>

        {/* Main Scanner Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Scan className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Ready to Scan
            </h2>
            <p className="text-gray-600">
              Click the button below to start scanning QR codes
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={startScanning}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Camera className="h-6 w-6 mr-3" />
              Start QR Scanner
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Scan QR Code
              </h4>
              <p className="text-gray-600">
                Use your device camera to scan the QR code at the location
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Photos
              </h4>
              <p className="text-gray-600">
                Take and upload before and after photos of the location
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Complete
              </h4>
              <p className="text-gray-600">
                Photos are automatically saved and documented in the system
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Smartphone className="h-8 w-8 text-blue-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">
                Mobile Optimized
              </h4>
            </div>
            <p className="text-gray-600">
              Works perfectly on smartphones and tablets with responsive design
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-green-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">
                No App Required
              </h4>
            </div>
            <p className="text-gray-600">
              Works directly in your web browser - no need to download any apps
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-8">
          <h4 className="text-lg font-semibold text-amber-800 mb-3">
            📱 Camera Permissions Required
          </h4>
          <div className="text-amber-700 space-y-2">
            <p>• Allow camera access when prompted by your browser</p>
            <p>• Make sure you're using HTTPS (secure connection)</p>
            <p>• For best results, use the back camera on mobile devices</p>
            <p>• Ensure good lighting when scanning QR codes</p>
          </div>
        </div>
      </div>

      {/* QR Scanner Component */}
      <QRScanner
        isActive={showScanner}
        onScanSuccess={handleScanSuccess}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};

export default ScannerPage;
