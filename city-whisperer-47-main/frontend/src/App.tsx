import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Track from "./pages/Track";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Navbar } from "@/components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./admin/Login";
import AdminDashboard from "./admin/Dashboard";
import AdminRequireAuth from "./admin/AdminRequireAuth";
import Overview from "./admin/pages/Overview";
import UsersPage from "./admin/pages/Users";
import IssuesPage from "./admin/pages/Issues";
import FeedbackPage from "./admin/pages/Feedback";
import AnalyticsPage from "./admin/pages/Analytics";
import Feedback from "./pages/Feedback";
import RequireRole from "@/components/RequireRole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/report" element={<Report />} />
          <Route path="/track" element={<Track />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRequireAuth>
                <AdminDashboard />
              </AdminRequireAuth>
            }
          >
            <Route index element={<Overview />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="issues" element={<IssuesPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
          <Route path="/feedback/:issueId" element={<Feedback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
