import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import CookiePolicy from "./pages/CookiePolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import VerificationProcess from "./pages/VerificationProcess";
import CampaignDetails from "./pages/CampaignDetails";
import ScrollToTop from "./components/ScrollToTop";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import IndividualDashboard from "./pages/IndividualDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCampaign from "./pages/CreateCampaign";
import DatabaseSeeder from "./components/DatabaseSeeder";
import Onboarding from "./pages/Onboarding";

import { AuthProvider } from "./context/AuthContext";
import { CampaignProvider } from "./context/CampaignContext";

function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/verification-process" element={<VerificationProcess />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/dashboard/donor" element={<DonorDashboard />} />
            <Route path="/dashboard/nonprofit" element={<NgoDashboard />} />
            <Route path="/dashboard/ngo" element={<NgoDashboard />} />
            <Route path="/dashboard/individual" element={<IndividualDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/seed" element={<DatabaseSeeder />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </BrowserRouter>
      </CampaignProvider>
    </AuthProvider>
  );
}

export default App;