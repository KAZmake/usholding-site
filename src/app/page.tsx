import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Companies } from '@/components/Companies';
import { Portfolio } from '@/components/Portfolio';
import { WhySection } from '@/components/WhySection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';

export default function Home() {
  return (
    <>
      <JsonLd />
      <Nav />
      <main>
        <Hero />
        <About />
        <Companies />
        <Portfolio />
        <WhySection />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
