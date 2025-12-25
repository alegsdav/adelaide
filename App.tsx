import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { UIContext, Navigation, CustomCursor, Footer } from './components/UI';
import { Home, Portfolio, ArtworkDetail, About, Contact } from './pages/PublicPages';
import { MOCK_ARTWORKS, COLLECTIONS } from './constants';
import { ViewMode, Artwork } from './types';

const ScrollToTop = ({ lenisRef }: { lenisRef: React.MutableRefObject<Lenis | null> }) => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, lenisRef]);
    return null;
}

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  
  const [artworks] = useState<Artwork[]>(MOCK_ARTWORKS);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <UIContext.Provider value={{ viewMode, setViewMode, isMenuOpen, setMenuOpen }}>
      <HashRouter>
        <ScrollToTop lenisRef={lenisRef} />
        <CustomCursor />
        <Navigation />
        
        <main className={`min-h-screen transition-opacity duration-500 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
            <Routes>
                <Route path="/" element={<Home artworks={artworks} collections={COLLECTIONS} />} />
                <Route path="/portfolio" element={<Portfolio artworks={artworks} collections={COLLECTIONS} />} />
                <Route path="/art/:slug" element={<ArtworkDetail artworks={artworks} collections={COLLECTIONS} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </main>
        
        <Footer />
      </HashRouter>
    </UIContext.Provider>
  );
};

export default App;
