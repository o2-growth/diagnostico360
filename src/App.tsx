
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Department from "./pages/Department";
import Assessment from "./pages/Assessment";
import OngoingAssessment from "./pages/OngoingAssessment";
import Auth from "./pages/Auth";
import Report from "./pages/Report";
import HistoryDetail from "./pages/HistoryDetail";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ThemeToggle />
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <BrowserRouter>
                <Routes>
                <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/department/:id" element={<ProtectedRoute><Department /></ProtectedRoute>} />
                  <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                  <Route path="/ongoing-assessment" element={<ProtectedRoute><OngoingAssessment /></ProtectedRoute>} />
                  <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                  <Route path="/history/:snapshotId" element={<ProtectedRoute><HistoryDetail /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
