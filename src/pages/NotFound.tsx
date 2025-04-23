
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-justice-dark to-black">
      <div className="max-w-md w-full p-8 rounded-lg backdrop-blur-sm bg-black/40 border border-justice-primary/30">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-justice-primary/10 text-justice-primary">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-5xl font-bold mb-2 text-white">404</h1>
          <p className="text-xl text-gray-400 mb-6">Page not found</p>
          <p className="text-gray-500 mb-8">
            The resource at <span className="text-justice-primary">{location.pathname}</span> could not be located in the FastTrackJusticeAI system.
          </p>
          <Button asChild className="bg-justice-primary hover:bg-justice-secondary transition-all">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
