import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnalysisSelector from "./pages/AnalysisSelector";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import VideoAnalysis from "./pages/VideoAnalysis";
import VideoResults from "./pages/VideoResults";
import InstagramAnalysis from "./pages/InstagramAnalysis";
import InstagramResults from "./pages/InstagramResults";
import ChannelComparison from "./pages/ChannelComparison";
import AnalysisHistory from "./pages/AnalysisHistory";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/select" element={<AnalysisSelector />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/video-analysis" element={<VideoAnalysis />} />
          <Route path="/video-results" element={<VideoResults />} />
          <Route path="/instagram-analysis" element={<InstagramAnalysis />} />
          <Route path="/instagram-results" element={<InstagramResults />} />
          <Route path="/channel-comparison" element={<ChannelComparison />} />
          <Route path="/history" element={<AnalysisHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
