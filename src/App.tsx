import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import TeamLogin from "./pages/TeamLogin";
import AdminLogin from "./pages/AdminLogin";
import Game from "./pages/Game";
import Completion from "./pages/Completion";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<TeamLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* TEAM PROTECTED ROUTES */}
            <Route
              path="/game"
              element={
                <ProtectedRoute role="team">
                  <Game />
                </ProtectedRoute>
              }
            />

            <Route
              path="/completion"
              element={
                <ProtectedRoute role="team">
                  <Completion />
                </ProtectedRoute>
              }
            />

            {/* ADMIN PROTECTED ROUTE */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
