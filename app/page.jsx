
// app/page.js
import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";
import CollectionSection from "./sections/CollectionSection";
import WhyUsSection from "./sections/WhyUsSection";
import BrandStorySection from "./sections/BrandStorySection";
import FinalCTASection from "./sections/FinalCTASection";
import Footer from "./sections/Footer";
import { SignOutButton } from "@clerk/nextjs";
import ActiveOrders from "./components/utils/ActiveOrders";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Announcement bar */}
      <div className="w-full bg-[#0a0a0a] text-[#fafafa] text-center py-2.5 px-4 sm:px-6 text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-normal leading-relaxed sm:leading-normal">
        Free shipping on all orders &nbsp;·&nbsp;{" "}
        <span style={{ color: "#b8965a" }}>COD Available</span>
        &nbsp;·&nbsp; New Drop: Oversized Essentials — Limited Stock
      </div>

      <Navbar />

      <main className="w-full">
        <HeroSection />
        <CollectionSection />
        <WhyUsSection />
        <BrandStorySection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}