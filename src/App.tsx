import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import UniversPage from "./pages/UniversPage";
import UniversDetailPage from "./pages/UniversDetailPage";
import PersonnagesPage from "./pages/PersonnagesPage";
import PersonnageDetailPage from "./pages/PersonnageDetailPage";
import RacesPage from "./pages/RacesPage";
import FactionsPage from "./pages/FactionsPage";
import ChronologiePage from "./pages/ChronologiePage";
import LieuxPage from "./pages/LieuxPage";
import BestiairePage from "./pages/BestiairePage";
import CartesPage from "./pages/CartesPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/univers" element={<UniversPage />} />
            <Route path="/univers/:id" element={<UniversDetailPage />} />
            <Route path="/personnages" element={<PersonnagesPage />} />
            <Route path="/personnages/:id" element={<PersonnageDetailPage />} />
            <Route path="/races" element={<RacesPage />} />
            <Route path="/factions" element={<FactionsPage />} />
            <Route path="/chronologie" element={<ChronologiePage />} />
            <Route path="/lieux" element={<LieuxPage />} />
            <Route path="/bestiaire" element={<BestiairePage />} />
            <Route path="/cartes" element={<CartesPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
