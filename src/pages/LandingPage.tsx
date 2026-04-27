import { LPNavbar } from "@/components/landing/LPNavbar";
import { LPHero } from "@/components/landing/LPHero";
import { LPSocialProof } from "@/components/landing/LPSocialProof";
import { LPHowItWorks } from "@/components/landing/LPHowItWorks";
import { LPAreas } from "@/components/landing/LPAreas";
import { LPResults } from "@/components/landing/LPResults";
import { LPTestimonials } from "@/components/landing/LPTestimonials";
import { LPPricing } from "@/components/landing/LPPricing";
import { LPFAQ } from "@/components/landing/LPFAQ";
import { LPFooter } from "@/components/landing/LPFooter";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A0A0A", color: "#FFFFFF" }}
    >
      <LPNavbar onLogin={handleLogin} />
      <LPHero onLogin={handleLogin} />
      <LPSocialProof />
      <LPHowItWorks />
      <LPAreas />
      <LPResults />
      <LPTestimonials />
      <LPPricing onLogin={handleLogin} />
      <LPFAQ />
      <LPFooter onLogin={handleLogin} />
    </div>
  );
};

export default LandingPage;
