import React, { useEffect, useState, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Instagram, Twitter, Mail } from 'lucide-react';
import { ACCENT_COLOR } from '../constants';
import { ViewMode } from '../types';

// --- Context for Cursor & View Mode ---
interface UIContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const UIContext = createContext<UIContextType>({
  viewMode: 'default',
  setViewMode: () => {},
  isMenuOpen: false,
  setMenuOpen: () => {},
});

export const useUI = () => useContext(UIContext);

// --- Custom Cursor ---
export const CustomCursor: React.FC = () => {
  const { viewMode } = useUI();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const variants = {
    default: { height: 16, width: 16, x: -8, y: -8, backgroundColor: "#ffffff", mixBlendMode: "difference" as any },
    view: { height: 64, width: 64, x: -32, y: -32, backgroundColor: ACCENT_COLOR, mixBlendMode: "normal" as any, opacity: 0.8 },
    drag: { height: 48, width: 48, x: -24, y: -24, backgroundColor: "transparent", border: `2px solid ${ACCENT_COLOR}` },
    play: { height: 64, width: 64, x: -32, y: -32, backgroundColor: "transparent", border: `2px solid ${ACCENT_COLOR}` },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] rounded-full pointer-events-none hidden md:flex items-center justify-center"
      animate={viewMode}
      variants={variants}
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
        {viewMode === 'view' && <span className="text-black text-[10px] font-bold tracking-widest uppercase">View</span>}
        {viewMode === 'drag' && <ArrowRight className="text-[#008f4f] w-4 h-4" />}
        {viewMode === 'play' && <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#008f4f] border-b-[6px] border-b-transparent ml-1" />}
    </motion.div>
  );
};

// --- Navigation Overlay ---
export const Navigation: React.FC = () => {
  const { isMenuOpen, setMenuOpen } = useUI();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location, setMenuOpen]);

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Creator Area', path: '/admin' },
  ];

  return (
    <>
      {/* Header Bar */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <Link to="/" className="text-white font-bold text-2xl tracking-tighter hover:text-[#008f4f] transition-colors">
          Adelaide
        </Link>
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="text-white hover:text-[#008f4f] transition-colors flex items-center gap-2 group"
        >
          <span className="uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Menu</span>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-neutral-900/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col gap-8 text-center">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="text-5xl md:text-7xl font-bold text-neutral-400 hover:text-white transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#008f4f] transition-all group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="absolute bottom-12 flex gap-6"
            >
                <Instagram className="text-white hover:text-[#008f4f] cursor-pointer" />
                <Twitter className="text-white hover:text-[#008f4f] cursor-pointer" />
                <Mail className="text-white hover:text-[#008f4f] cursor-pointer" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Footer = () => (
  <footer className="bg-neutral-950 py-24 px-6 md:px-12 border-t border-neutral-900">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
            <h2 className="text-3xl font-bold mb-4">Let's create together.</h2>
            <Link to="/contact" className="inline-flex items-center text-[#008f4f] border-b border-[#008f4f] pb-1 hover:opacity-80 transition-opacity">
                Start a project <ArrowRight size={16} className="ml-2" />
            </Link>
        </div>
        <div className="grid grid-cols-2 gap-12 text-sm text-neutral-500">
            <div className="flex flex-col gap-2">
                <span className="text-white font-medium mb-2">Socials</span>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Twitter/X</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-white font-medium mb-2">Legal</span>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
        </div>
    </div>
    <div className="max-w-7xl mx-auto mt-24 text-neutral-700 text-xs flex justify-between">
        <span>© 2024 ADELAIDE TEMPLATE</span>
        <span>DESIGNED FOR ARTISTS</span>
    </div>
  </footer>
);