import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ContasFixas from "./pages/ContasFixas";
import Parceladas from "./pages/Parceladas";
import Cartoes from "./pages/Cartoes";
import ComprasCredito from "./pages/ComprasCredito";
import Entradas from "./pages/Entradas";
import Movimentacao from "./pages/Movimentacao";
import NotFound from "./pages/NotFound";
import { isAuthenticated } from "@/services/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contas-fixas" element={<ContasFixas />} />
            <Route path="/parceladas" element={<Parceladas />} />
            <Route path="/cartoes" element={<Cartoes />} />
            <Route path="/compras-credito" element={<ComprasCredito />} />
            <Route path="/entradas" element={<Entradas />} />
            <Route path="/movimentacao" element={<Movimentacao />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
