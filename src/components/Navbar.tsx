import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  QrCode,
  FileText,
  Upload,
  Scan,
  Menu,
  X,
} from "lucide-react";
import { FC } from "react";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: FC<NavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`bg-white shadow-md border-r border-gray-200 w-64 flex flex-col h-screen fixed top-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        <Building2 className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">
          Municipal Photo System
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
              isActive("/")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Link>
          <Link
            to="/reports"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
              isActive("/reports")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Link>
          <Link
            to="/scanner"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
              isActive("/scanner")
                ? "bg-green-100 text-green-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Scan className="h-4 w-4 mr-2" />
            QR Scanner
          </Link>
          <div className="px-3 py-2 text-sm text-gray-400 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload via QR
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
