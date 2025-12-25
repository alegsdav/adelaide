import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Artwork } from '../types';
import { useUI } from './UI';
import { Link } from 'react-router-dom';

interface Props {
  artworks: Artwork[];
}

export const HorizontalScroll: React.FC<Props> = ({ artworks }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { setViewMode } = useUI();
  const [maxScroll, setMaxScroll] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(200); // Default height in vh
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"]
  });

  // Separate scroll progress for background color - starts when section is fully in view
  const { scrollYProgress: colorScrollProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"] // Start tracking when section top reaches viewport top
  });

  // Calculate the maximum scroll distance and section height based on content
  // Section height scales with content to maintain constant scroll speed
  useEffect(() => {
    const calculateDimensions = () => {
      if (contentRef.current) {
        // Use scrollWidth to get the total width of the content including overflow
        const contentWidth = contentRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const startPadding = viewportWidth * 0.5; // 50vw - start at 50% from right edge
        const viewAllWidth = 400;
        
        // Calculate how much we need to scroll horizontally
        const buffer = viewportWidth * 0.23; // Keep 30% of viewport width as buffer
        const scrollDistance = startPadding + contentWidth - viewAllWidth - viewportWidth - buffer;
        const horizontalDistance = Math.max(0, scrollDistance);
        setMaxScroll(horizontalDistance);
        
        // Calculate section height based on horizontal distance with fixed scroll speed
        // Fixed speed: 1 viewport height per 1200 pixels of horizontal scroll (faster = shorter section)
        const scrollSpeed = 1200; // pixels of horizontal scroll per viewport height
        const baseHeight = 150; // Base height in vh (reduced from 200)
        const additionalHeight = (horizontalDistance / scrollSpeed) * 100; // Convert to vh
        const totalHeight = baseHeight + additionalHeight;
        setSectionHeight(Math.max(150, totalHeight)); // Minimum 150vh
      }
    };

    // Wait for images to load and content to render
    const timeoutId = setTimeout(calculateDimensions, 300);
    
    // Also calculate when images load
    const images = contentRef.current?.querySelectorAll('img');
    if (images && images.length > 0) {
      let loadedCount = 0;
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          calculateDimensions();
        }
      };
      images.forEach(img => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
        }
      });
    }
    
    // Also calculate on resize
    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [artworks]);

  // Diagonal effect: content moves up vertically while scrolling horizontally
  // Vertical animation completes in first 20% of scroll (fixed duration)
  // Then only horizontal scrolling continues for the rest
  // Use a reasonable default if maxScroll hasn't been calculated yet
  const effectiveMaxScroll = maxScroll || 1500; // fallback value
  const verticalAnimationEnd = 0.1; // Vertical animation completes at 20% of scroll
  
  const x = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, -effectiveMaxScroll]
  );
  
  // Vertical animation completes quickly in first 10% of scroll, then stays at 0
  // Start much closer to center (20vh instead of 100vh)
  const y = useTransform(scrollYProgress, [0, verticalAnimationEnd, 1], ["20vh", "0vh", "0vh"]);

  // Background color gradually changes from dark green to white as we scroll
  // Use separate scroll progress that starts when section is fully in viewport
  const backgroundColor = useTransform(
    colorScrollProgress,
    [0, 1],
    ['#3D492C', '#f0eddd']
  );

  return (
    <motion.section 
      ref={targetRef} 
      className="relative" 
      style={{ 
        height: `${sectionHeight}vh`,
        backgroundColor 
      }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={contentRef} style={{ x, y }} className="flex gap-[120px] items-center pl-[100vw]">
            {/* Art Cards */}
            {artworks.map((art) => (
                <div 
                    key={art.id} 
                    className="relative w-[80vw] md:w-[60vh] h-[60vh] flex-shrink-0 bg-neutral-800 group rounded-xl overflow-hidden"
                    onMouseEnter={() => setViewMode('view')}
                    onMouseLeave={() => setViewMode('default')}
                >
                    <Link to={`/art/${art.slug}`} className="block w-full h-full overflow-hidden rounded-xl">
                         <img 
                            src={art.heroMedia} 
                            alt={art.title} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105 rounded-xl"
                        />
                    </Link>
                </div>
            ))}
            
            {/* End Card */}
             <div className="flex-shrink-0 w-[400px] h-[60vh] flex items-center justify-center">
                 <Link to="/portfolio" className="text-4xl font-bold text-[#1a1a1a] hover:text-[#bdcda7] underline transition-colors">
                    View All
                 </Link>
             </div>
        </motion.div>
      </div>
    </motion.section>
  );
};