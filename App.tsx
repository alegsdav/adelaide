import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UIContext, Navigation, CustomCursor, Footer } from './components/UI';
import { Home, Portfolio, ArtworkDetail, About, Contact } from './pages/PublicPages';
import { AdminDashboard } from './pages/AdminPages';
import { MOCK_ARTWORKS, COLLECTIONS } from './constants';
import { ViewMode, Artwork } from './types';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  // Lifting state up for the "Dashboard" requirement so edits persist in session
  const [artworks, setArtworks] = useState<Artwork[]>(MOCK_ARTWORKS);

  return (
    <UIContext.Provider value={{ viewMode, setViewMode, isMenuOpen, setMenuOpen }}>
      <HashRouter>
        <ScrollToTop />
        <CustomCursor />
        <Navigation />
        
        <main className={`min-h-screen transition-opacity duration-500 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
            <Routes>
                <Route path="/" element={<Home artworks={artworks} collections={COLLECTIONS} />} />
                <Route path="/portfolio" element={<Portfolio artworks={artworks} collections={COLLECTIONS} />} />
                <Route path="/art/:slug" element={<ArtworkDetail artworks={artworks} collections={COLLECTIONS} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminDashboard artworks={artworks} setArtworks={setArtworks} collections={COLLECTIONS} />} />
            </Routes>
        </main>
        
        <Footer />
      </HashRouter>
    </UIContext.Provider>
  );
};

export default App;
