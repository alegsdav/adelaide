import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Artwork } from '../types';
import { useUI } from './UI';
import { Link } from 'react-router-dom';

interface Props {
  artworks: Artwork[];
}

export const HorizontalScroll: React.FC<Props> = ({ artworks }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { setViewMode } = useUI();
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">
            {/* Title Card */}
            <div className="flex-shrink-0 w-[400px] h-[60vh] flex flex-col justify-end pb-12">
                <h2 className="text-6xl font-bold leading-tight">
                    Selected<br/>
                    <span className="text-[#00C896]">Works</span>
                </h2>
                <div className="w-12 h-1 bg-white mt-8 mb-4"></div>
                <p className="text-neutral-400 max-w-xs">Drag or scroll to explore the complete collection.</p>
            </div>

            {/* Art Cards */}
            {artworks.map((art) => (
                <div 
                    key={art.id} 
                    className="relative w-[80vw] md:w-[60vh] h-[60vh] flex-shrink-0 bg-neutral-800 group"
                    onMouseEnter={() => setViewMode('view')}
                    onMouseLeave={() => setViewMode('default')}
                >
                    <Link to={`/art/${art.slug}`} className="block w-full h-full overflow-hidden">
                         <img 
                            src={art.heroMedia} 
                            alt={art.title} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 border-[1px] border-white/10 group-hover:border-[#00C896] transition-colors duration-300"></div>
                        <div className="absolute -bottom-8 left-0 group-hover:bottom-0 transition-all duration-300 opacity-0 group-hover:opacity-100 bg-black/80 p-4 w-full backdrop-blur-sm">
                            <h4 className="font-bold text-lg">{art.title}</h4>
                            <span className="text-xs text-[#00C896] uppercase tracking-wider">{art.medium}</span>
                        </div>
                    </Link>
                </div>
            ))}
            
            {/* End Card */}
             <div className="flex-shrink-0 w-[400px] h-[60vh] flex items-center justify-center">
                 <Link to="/portfolio" className="text-4xl font-bold hover:text-[#00C896] underline transition-colors">
                    View All
                 </Link>
             </div>
        </motion.div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-12 left-12 right-12 h-[2px] bg-neutral-800">
            <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} className="h-full bg-[#00C896] w-full" />
        </div>
      </div>
    </section>
  );
};