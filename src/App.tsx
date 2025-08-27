import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectsPage from "./pages/SubjectsPage";
import DistrictsPage from "./pages/DistrictsPage";
import DistrictYearsPage from "./pages/DistrictYearsPage";
import PYQYearsPage from "./pages/PYQYearsPage";
import ModelSetsPage from "./pages/ModelSetsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/quiz/:examType/subject" element={<SubjectsPage />} />
          <Route path="/quiz/:examType/district" element={<DistrictsPage />} />
          <Route path="/quiz/:examType/district/:district" element={<DistrictYearsPage />} />
          <Route path="/quiz/:examType/pyq" element={<PYQYearsPage />} />
          <Route path="/quiz/:examType/pyq/:year" element={<QuizPage />} />
          <Route path="/quiz/:examType/model_papers" element={<ModelSetsPage />} />
          <Route path="/quiz/:examType/model_papers/:set" element={<QuizPage />} />
          <Route path="/quiz/:examType/:section" element={<QuizPage />} />
          <Route path="/results/:attemptId" element={<ResultsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
