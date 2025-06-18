import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Camera,
  Upload,
  MapPin,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getLocationByQRCode, uploadPhoto } from "../services/firebaseService";
import { Location } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const UploadPage: React.FC = () => {
  const { qrcodeid } = useParams<{ qrcodeid: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    before?: boolean;
    after?: boolean;
  }>({});

  useEffect(() => {
    const fetchLocation = async () => {
      if (!qrcodeid) {
        setError("Invalid QR Code");
        setLoading(false);
        return;
      }

      try {
        const locationData = await getLocationByQRCode(qrcodeid);
        if (!locationData) {
          setError("Location not found. Please check the QR code.");
        } else {
          setLocation(locationData);
          setUploadStatus({
            before: !!locationData.beforePhoto,
            after: !!locationData.afterPhoto,
          });
        }
      } catch (err) {
        setError("Failed to load location data.");
        console.error("Error fetching location:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [qrcodeid]);

  const handleFileUpload = async (file: File, type: "before" | "after") => {
    if (!location) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    try {
      if (type === "before") {
        setUploadingBefore(true);
      } else {
        setUploadingAfter(true);
      }

      await uploadPhoto(location.id, { file, type });

      setUploadStatus((prev) => ({
        ...prev,
        [type]: true,
      }));

      // Refresh location data to get updated photo URLs
      const updatedLocation = await getLocationByQRCode(qrcodeid!);
      if (updatedLocation) {
        setLocation(updatedLocation);
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert(`Failed to upload ${type} photo. Please try again.`);
    } finally {
      if (type === "before") {
        setUploadingBefore(false);
      } else {
        setUploadingAfter(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading location data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Photo Upload Portal
            </h1>
            <p className="text-gray-600">
              Upload before and after photos for documentation
            </p>
          </div>

          {/* Location Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 w-32">
                QR Code ID:
              </span>
              <span className="text-blue-600 font-mono">
                {location.qrCodeId}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-semibold text-gray-700 w-28">
                Location:
              </span>
              <span>{location.locationName}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 w-32 ml-6">
                Area:
              </span>
              <span>{location.area}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-semibold text-gray-700 w-28">
                Supervisor:
              </span>
              <span>{location.supervisorName}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-semibold text-gray-700 w-28">Contact:</span>
              <span className="text-green-600">{location.contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before Photo Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Before Photo
              </h3>
              {uploadStatus.before && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </div>

            {location.beforePhoto ? (
              <div className="space-y-4">
                <img
                  src={location.beforePhoto.url}
                  alt="Before"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <div className="text-sm text-gray-600">
                  Uploaded: {location.beforePhoto.uploadedAt.toLocaleString()}
                </div>
                <p className="text-green-600 text-sm font-medium">
                  ✓ Before photo uploaded successfully
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload the before photo</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "before");
                      }}
                      disabled={uploadingBefore}
                    />
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
                      {uploadingBefore ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photo
                        </>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* After Photo Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                After Photo
              </h3>
              {uploadStatus.after && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </div>

            {location.afterPhoto ? (
              <div className="space-y-4">
                <img
                  src={location.afterPhoto.url}
                  alt="After"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <div className="text-sm text-gray-600">
                  Uploaded: {location.afterPhoto.uploadedAt.toLocaleString()}
                </div>
                <p className="text-green-600 text-sm font-medium">
                  ✓ After photo uploaded successfully
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload the after photo</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "after");
                      }}
                      disabled={uploadingAfter}
                    />
                    <span className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50">
                      {uploadingAfter ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photo
                        </>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {uploadStatus.before && uploadStatus.after && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <h4 className="text-green-800 font-semibold">
                  Upload Complete!
                </h4>
                <p className="text-green-700">
                  Both before and after photos have been uploaded successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
