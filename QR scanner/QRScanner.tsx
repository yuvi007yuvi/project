import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, X, Scan, AlertCircle, CheckCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
  isActive: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [scanResult, setScanResult] = useState<string>('');

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const initScanner = async () => {
      try {
        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);

        if (!hasCamera) {
          setError('No camera found on this device');
          return;
        }

        // Initialize QR Scanner
        const scanner = new QrScanner(
          videoRef.current!,
          (result) => {
            setScanResult(result.data);
            setIsScanning(false);
            onScanSuccess(result.data);
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Use back camera
            maxScansPerSecond: 5,
          }
        );

        scannerRef.current = scanner;
        await scanner.start();
        setIsScanning(true);
        setError('');
      } catch (err) {
        console.error('Error initializing scanner:', err);
        setError('Failed to access camera. Please check permissions.');
        setHasCamera(false);
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [isActive, onScanSuccess]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    onClose();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <div className="flex items-center text-white">
            <Scan className="h-6 w-6 mr-2" />
            <span className="font-semibold">Scan QR Code</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          {hasCamera && !error ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-64 h-64 border-2 border-white border-opacity-50 relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400"></div>
                    
                    {/* Scanning line animation */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-20 left-4 right-4 text-center">
                <div className="bg-black bg-opacity-70 rounded-lg p-4 text-white">
                  <p className="text-sm">
                    {isScanning ? 'Position QR code within the frame' : 'Starting camera...'}
                  </p>
                  {scanResult && (
                    <div className="mt-2 flex items-center justify-center text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-xs">QR Code detected!</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Error State */
            <div className="flex flex-col items-center justify-center text-white p-8">
              <AlertCircle className="h-16 w-16 mb-4 text-red-400" />
              <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
              <p className="text-center text-gray-300 mb-6">
                {error || 'Please allow camera access to scan QR codes'}
              </p>
              <div className="space-y-3 text-sm text-gray-400">
                <p>• Make sure your device has a camera</p>
                <p>• Allow camera permissions when prompted</p>
                <p>• Try refreshing the page if needed</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;