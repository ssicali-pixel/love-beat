import { useEffect, useRef } from 'react';
import Navbar   from './Navbar';
import Hero     from './Hero';
import About    from './About';
import Events   from './Events';
import Gallery  from './Gallery';
import Partners from './Partners';
import Ratings  from './Ratings';
import Contact  from './Contact';
import Footer   from './Footer';
import { LangProvider } from './LangContext';
import { trackPage, trackClick } from './analytics';
import { useScrollReveal } from './useScrollReveal';

const SECTION_IDS = ['home', 'about', 'lineup', 'gallery', 'partners', 'ratings', 'contact'];

function Reveal({ children }) {
  const ref = useRef(null);
  useScrollReveal(ref);
  return <div ref={ref} className="sr-wrap">{children}</div>;
}

export default function App() {
  useEffect(() => {
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

    function handleClick(e) {
      const target  = e.target.closest('button, a');
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

  useEffect(() => {
    const dot      = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!dot || !follower) return;

    function onMove(e) {
      const x = e.clientX, y = e.clientY;
      dot.style.transform      = `translate(${x - 4}px, ${y - 4}px)`;
      follower.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
    }

    function onOver(e) {
      if (e.target.closest('a, button, [role="button"]')) {
        follower.classList.add('cursor-hover');
      }
    }

    function onOut(e) {
      if (e.target.closest('a, button, [role="button"]')) {
        follower.classList.remove('cursor-hover');
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-follower" />
      <LangProvider>
        <Navbar />
        <Reveal><Hero /></Reveal>
        <Reveal><About /></Reveal>
        <Reveal><Events /></Reveal>
        <Reveal><Gallery /></Reveal>
        <Reveal><Partners /></Reveal>
        <Reveal><Ratings /></Reveal>
        <Reveal><Contact /></Reveal>
        <Reveal><Footer /></Reveal>
      </LangProvider>
    </>
  );
}
