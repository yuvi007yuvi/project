import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import UploadPage from "./pages/UploadPage";
import ReportsPage from "./pages/ReportsPage";
// import ScannerPage from '../QR scanner/ScannerPage';
import { useState } from "react";
import { Menu, X } from "lucide-react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes without navbar */}
          <Route path="/upload/:qrcodeid" element={<UploadPage />} />
          <Route path="/scanner" element={<ScannerPage />} />

          {/* Admin routes with navbar */}
          <Route
            path="*"
            element={
              <div className="flex">
                <Navbar
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
                <button
                  onClick={toggleSidebar}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 z-50 lg:hidden"
                >
                  {isSidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                <div
                  className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"} lg:ml-64 p-4 md:p-8`}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100vh-32px)]">
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/reports" element={<ReportsPage />} />
                    </Routes>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
