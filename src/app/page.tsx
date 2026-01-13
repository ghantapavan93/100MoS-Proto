import { HeroSection } from "@/components/landing/HeroSection";
import { QuantumVision } from "@/components/landing/QuantumVision";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { WaveDivider } from "@/components/landing/WaveDivider";
import { MissionSection } from "@/components/landing/MissionSection";
import { SignatureExperiences } from "@/components/landing/SignatureExperiences";
import { EmailSubscribe } from "@/components/landing/EmailSubscribe";
import { ShopSection } from "@/components/landing/ShopSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <QuantumVision />
      <MarqueeSection />
      <WaveDivider />
      <MissionSection />
      <SignatureExperiences />
      <ShopSection />
      <EmailSubscribe />
      <Footer />
    </div>
  );
}
