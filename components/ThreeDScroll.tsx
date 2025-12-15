import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Artwork } from '../types';
import { useUI } from './UI';
import { Link } from 'react-router-dom';

interface CardProps {
  artwork: Artwork;
  index: number;
  scrollYProgress: MotionValue<number>;
  total: number;
}

const Card: React.FC<CardProps> = ({ artwork, index, scrollYProgress, total }) => {
    const { setViewMode } = useUI();
    // Calculate the 'active' range for this card in the scroll progress
    const step = 1 / total;
    const start = index * step;
    const end = start + step;

    // Transform logic: As scroll progresses, item moves from deep Z to camera, then fades
    // We simulate Z space using scale and opacity
    
    // Scale: starts small (far away), grows to 1 (focus), then massive (passes camera)
    const scale = useTransform(scrollYProgress, [start, end], [0.5, 1.2]);
    
    // Opacity: fades in, stays visible, fades out quickly as it "hits" the camera
    const opacity = useTransform(scrollYProgress, [start, start + step * 0.2, end - step * 0.1, end], [0, 1, 1, 0]);
    
    // Z-index trick: ensure current is on top
    const zIndex = useTransform(scrollYProgress, (pos) => {
        if (pos >= start && pos < end) return 10;
        return 0;
    });

    // Blur: clear when active, blurry when far
    const blur = useTransform(scrollYProgress, [start, start + step * 0.5, end], ['10px', '0px', '20px']);

  return (
    <motion.div
      style={{ scale, opacity, zIndex, filter: `blur(${blur})` }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
        <div className="relative w-[80vw] h-[60vh] md:w-[60vw] md:h-[70vh] pointer-events-auto">
            <Link 
                to={`/art/${artwork.slug}`}
                onMouseEnter={() => setViewMode('view')}
                onMouseLeave={() => setViewMode('default')}
                className="block w-full h-full relative overflow-hidden group"
            >
                <img 
                    src={artwork.heroMedia} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-4xl md:text-6xl font-bold text-white">{artwork.title}</h3>
                    <p className="text-[#00C896] font-mono mt-2">{artwork.year} — {artwork.medium}</p>
                </div>
            </Link>
        </div>
    </motion.div>
  );
};

interface Props {
  artworks: Artwork[];
}

export const ThreeDScroll: React.FC<Props> = ({ artworks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className="h-[400vh] relative bg-neutral-950">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <h2 className="absolute top-12 md:top-24 text-neutral-800 font-black text-[12vw] tracking-tighter z-0 pointer-events-none select-none">
            DEPTH
        </h2>
        {artworks.map((art, i) => (
          <Card 
            key={art.id} 
            artwork={art} 
            index={i} 
            total={artworks.length} 
            scrollYProgress={scrollYProgress} 
          />
        ))}
        
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="absolute bottom-12 text-neutral-500 animate-bounce"
        >
            Scroll to dive in
        </motion.div>
      </div>
    </div>
  );
};