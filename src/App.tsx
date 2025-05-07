
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { LanguageProvider } from "@/contexts/language";
import { AuthProvider } from "@/contexts/auth";
import { AIComplianceProvider } from "@/contexts/ai-compliance";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <LanguageProvider>
          <AIComplianceProvider>
            <AppRoutes />
            <Toaster />
          </AIComplianceProvider>
        </LanguageProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
