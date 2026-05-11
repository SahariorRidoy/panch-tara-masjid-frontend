import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import { EventsSection, CoursesSection, BlogSection, AboutImamPrayerSection, MissionSection, GallerySection } from "@/components/home/Sections";
import { DonationSection, Footer } from "@/components/home/BottomSections";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import QuranSectionClient from "@/components/home/QuranSectionClient";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MarqueeBanner />
      <main>
        <HeroSection />
        <AboutImamPrayerSection />
        <EventsSection />
        <MissionSection />
        <CoursesSection />
        <DonationSection />
        <QuranSectionClient />
        <GallerySection />
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}
