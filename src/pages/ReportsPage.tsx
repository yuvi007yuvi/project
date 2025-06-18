import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getAllLocations } from "../services/firebaseService";
import { Location } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const ReportsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "before-only" | "complete"
  >("all");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data);
        setFilteredLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    let filtered = locations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (location) =>
          location.locationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.supervisorName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          location.qrCodeId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((location) => {
        const hasBefore = !!location.beforePhoto;
        const hasAfter = !!location.afterPhoto;

        switch (filterStatus) {
          case "pending":
            return !hasBefore && !hasAfter;
          case "before-only":
            return hasBefore && !hasAfter;
          case "complete":
            return hasBefore && hasAfter;
          default:
            return true;
        }
      });
    }

    setFilteredLocations(filtered);
  }, [locations, searchTerm, filterStatus]);

  const getStatusBadge = (location: Location) => {
    const hasBefore = !!location.beforePhoto;
    const hasAfter = !!location.afterPhoto;

    if (hasBefore && hasAfter) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Complete
        </span>
      );
    } else if (hasBefore) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Calendar className="h-3 w-3 mr-1" />
          Before Only
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const exportToCSV = () => {
    const headers = [
      "QR Code ID",
      "Location",
      "Area",
      "Supervisor",
      "Contact",
      "Status",
      "Before Photo",
      "After Photo",
      "Created Date",
    ];
    const csvData = filteredLocations.map((location) => [
      location.qrCodeId,
      location.locationName,
      location.area,
      location.supervisorName,
      location.contactNumber,
      getStatusText(location),
      location.beforePhoto ? "Yes" : "No",
      location.afterPhoto ? "Yes" : "No",
      location.createdAt.toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `municipal_reports_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusText = (location: Location) => {
    const hasBefore = !!location.beforePhoto;
    const hasAfter = !!location.afterPhoto;

    if (hasBefore && hasAfter) return "Complete";
    if (hasBefore) return "Before Only";
    return "Pending";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reports Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor photo upload status and manage location documentation
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {locations.length}
            </div>
            <div className="text-sm text-gray-600">Total Locations</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {locations.filter((l) => l.beforePhoto && l.afterPhoto).length}
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {locations.filter((l) => l.beforePhoto && !l.afterPhoto).length}
            </div>
            <div className="text-sm text-gray-600">Before Only</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-600">
              {locations.filter((l) => !l.beforePhoto && !l.afterPhoto).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, area, supervisor, or QR code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="before-only">Before Only</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supervisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {location.locationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          QR: {location.qrCodeId} • {location.area}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {location.supervisorName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.contactNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(location)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <span
                          className={`flex items-center ${location.beforePhoto ? "text-green-600" : "text-gray-400"}`}
                        >
                          {location.beforePhoto ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Before
                        </span>
                        <span
                          className={`flex items-center ${location.afterPhoto ? "text-green-600" : "text-gray-400"}`}
                        >
                          {location.afterPhoto ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          After
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedLocation(location)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No locations found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Location Detail Modal */}
        {selectedLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Location Details
                  </h3>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Location Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      QR Code ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {selectedLocation.qrCodeId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedLocation)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLocation.locationName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Area
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLocation.area}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Supervisor
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLocation.supervisorName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLocation.contactNumber}
                    </p>
                  </div>
                </div>

                {/* Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Before Photo
                    </h4>
                    {selectedLocation.beforePhoto ? (
                      <div>
                        <img
                          src={selectedLocation.beforePhoto.url}
                          alt="Before"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Uploaded:{" "}
                          {selectedLocation.beforePhoto.uploadedAt.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-500">No photo uploaded</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      After Photo
                    </h4>
                    {selectedLocation.afterPhoto ? (
                      <div>
                        <img
                          src={selectedLocation.afterPhoto.url}
                          alt="After"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Uploaded:{" "}
                          {selectedLocation.afterPhoto.uploadedAt.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-500">No photo uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
