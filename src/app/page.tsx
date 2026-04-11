import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import CTA from "../components/landing/CTA";

const HomePage = () => {
  return (
     <main className="bg-black min-h-screen text-white selection:bg-orange-500/30 selection:text-orange-100">
        <Hero/>
        <Features/>
        <About/>
        <Testimonials/>
        <Pricing/>
        <CTA/>
    </main>
  );
};
export default HomePage;
