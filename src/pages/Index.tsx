import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import ExamTypes from "@/components/sections/ExamTypes";
import Stats from "@/components/sections/Stats";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <ExamTypes />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;