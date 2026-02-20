import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        method: "POST",
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Erro ao iniciar pagamento",
        description: "Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A0A0A", color: "#FFFFFF" }}
    >
      <LPNavbar onCheckout={handleCheckout} loading={loading} />
      <LPHero onCheckout={handleCheckout} loading={loading} />
      <LPSocialProof />
      <LPHowItWorks />
      <LPAreas />
      <LPResults />
      <LPTestimonials />
      <LPPricing onCheckout={handleCheckout} loading={loading} />
      <LPFAQ />
      <LPFooter onCheckout={handleCheckout} loading={loading} />
    </div>
  );
};

export default LandingPage;
