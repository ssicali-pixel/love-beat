import { useEffect } from 'react';
import Navbar   from './Navbar';
import Hero     from './Hero';
import About    from './About';
import Events   from './Events';
import Areas    from './Areas';
import Tickets  from './Tickets';
import Gallery  from './Gallery';
import Partners from './Partners';
import Ratings  from './Ratings';
import Contact  from './Contact';
import Footer   from './Footer';
import { trackPage, trackClick } from './analytics';

const SECTION_IDS = ['home', 'about', 'lineup', 'schedule', 'areas', 'tickets', 'gallery', 'partners', 'ratings', 'contact'];

export default function App() {
  useEffect(() => {
    // Track section visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) trackPage(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Track button/link clicks by section via event delegation
    function handleClick(e) {
      const target = e.target.closest('button, a');
      if (!target) return;
      const section = target.closest('section[id]');
      if (section) trackClick(section.id);
    }
    document.addEventListener('click', handleClick);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Events />
      <Areas />
      <Tickets />
      <Gallery />
      <Partners />
      <Ratings />
      <Contact />
      <Footer />
    </>
  );
}
