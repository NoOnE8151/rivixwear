// app/page.js
import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";
import CollectionSection from "./sections/CollectionSection";
import WhyUsSection from "./sections/WhyUsSection";
import BrandStorySection from "./sections/BrandStorySection";
import FinalCTASection from "./sections/FinalCTASection";
import Footer from "./sections/Footer";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#0a0a0a] text-[#fafafa] text-center py-2.5 px-6 text-[11px] tracking-[0.2em] uppercase font-normal">
        Free shipping on all orders &nbsp;·&nbsp;{" "}
        <span style={{ color: "#b8965a" }}>COD Available</span>
        &nbsp;·&nbsp; New Drop: Oversized Essentials — Limited Stock
      </div>

      <Navbar />

      <main>
        <HeroSection />
        <CollectionSection />
        <WhyUsSection />
        <BrandStorySection />
        <FinalCTASection /> 
      </main>

      <Footer />
    </>
  );
}