import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUI } from '../components/UI';
import { ThreeDScroll } from '../components/ThreeDScroll';
import { HorizontalScroll } from '../components/HorizontalScroll';
import { Artwork, Collection } from '../types';
import { ArrowDown, ArrowUpRight, Check, Copy } from 'lucide-react';
import { ACCENT_COLOR } from '../constants';

interface Props {
  artworks: Artwork[];
  collections: Collection[];
}

// --- HOME PAGE ---
export const Home: React.FC<Props> = ({ artworks }) => {
  const featured = artworks.filter(a => a.featured);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden">
         <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="z-10"
         >
            <h1 className="text-[14vw] leading-[0.85] font-black tracking-tighter uppercase mix-blend-difference">
                Adelaide<br/>
                <span className="text-transparent stroke-text hover:text-[#008f4f] transition-colors duration-500" style={{ WebkitTextStroke: '2px white' }}>Davis</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl max-w-xl font-light text-neutral-400">
                A portfolio of my work. <br/>
                Explorations in watercolor, acrylic, and sketching.
            </p>
         </motion.div>
         
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 right-12 flex items-center gap-4 animate-pulse"
         >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ArrowDown size={16} className="text-[#008f4f]" />
         </motion.div>
      </section>

      {/* 3D Depth Section */}
      <ThreeDScroll artworks={featured.slice(0, 5)} />

      {/* Horizontal Gallery */}
      <HorizontalScroll artworks={featured} />
      
      {/* About Teaser */}
      <section className="py-32 px-6 md:px-12 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Not just pixels. <br/> A digital philosophy.</h2>
            <p className="text-neutral-400 text-lg mb-12">My work bridges the gap between traditional painting techniques and generative algorithms, creating spaces that feel both alien and intimately familiar.</p>
            <Link to="/about" className="inline-block border border-neutral-700 px-8 py-4 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-medium">
                Read Artist Statement
            </Link>
        </div>
      </section>
    </div>
  );
};

// --- PORTFOLIO HUB ---
export const Portfolio: React.FC<Props> = ({ artworks, collections }) => {
    const [filter, setFilter] = useState('all');
    const filteredArtworks = filter === 'all' ? artworks : artworks.filter(a => a.collectionId === filter);

    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 bg-neutral-950">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-neutral-800 pb-8">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter">ARCHIVE</h1>
                <div className="flex gap-4 mt-8 md:mt-0 overflow-x-auto pb-2 md:pb-0">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest border transition-all ${filter === 'all' ? `border-[#008f4f] text-[#008f4f]` : 'border-neutral-800 text-neutral-500 hover:border-white'}`}
                    >
                        All
                    </button>
                    {collections.map(c => (
                        <button 
                            key={c.id}
                            onClick={() => setFilter(c.id)}
                            className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest border transition-all whitespace-nowrap ${filter === c.id ? `border-[#008f4f] text-[#008f4f]` : 'border-neutral-800 text-neutral-500 hover:border-white'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 pb-32">
                {filteredArtworks.map(art => (
                    <Link to={`/art/${art.slug}`} key={art.id} className="group">
                        <div className="aspect-[4/5] overflow-hidden bg-neutral-900 mb-4 relative">
                            <img src={art.heroMedia} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                {art.year}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-[#008f4f] transition-colors inline-flex items-center gap-2">
                            {art.title} <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </h3>
                        <p className="text-neutral-500 text-sm mt-1">{art.medium}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// --- ARTWORK DETAIL ---
export const ArtworkDetail: React.FC<Props> = ({ artworks }) => {
    const { slug } = useParams();
    const artwork = artworks.find(a => a.slug === slug);
    const { setViewMode } = useUI();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!artwork) return <div className="pt-40 text-center">Artwork not found</div>;

    return (
        <div className="min-h-screen bg-neutral-950 pb-24">
            {/* Hero */}
            <motion.div 
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="w-full h-[80vh] relative"
            >
                <img src={artwork.heroMedia} alt={artwork.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">{artwork.title}</h1>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 space-y-8 text-neutral-400 font-mono text-sm border-r border-neutral-900 pr-8">
                     <div>
                        <span className="block text-white font-bold mb-1">Year</span>
                        {artwork.year}
                    </div>
                    <div>
                        <span className="block text-white font-bold mb-1">Medium</span>
                        {artwork.medium}
                    </div>
                    <div>
                        <span className="block text-white font-bold mb-1">Dimensions</span>
                        {artwork.dimensions}
                    </div>
                    <div>
                        <span className="block text-white font-bold mb-1">Availability</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs text-black font-bold uppercase ${artwork.availability === 'for_sale' ? 'bg-[#008f4f]' : 'bg-white'}`}>
                            {artwork.availability.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <p className="text-xl md:text-2xl leading-relaxed text-neutral-200 mb-12 font-light">
                        {artwork.description}
                    </p>
                    
                    {/* Gallery Grid */}
                    <div className="space-y-12">
                        {artwork.galleryMedia.map((img, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={i}
                                className="w-full"
                                onMouseEnter={() => setViewMode('view')}
                                onMouseLeave={() => setViewMode('default')}
                            >
                                <img src={img} alt="Detail" className="w-full h-auto" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            
             {/* Next Project Nav (Simple prev/next logic could go here) */}
             <div className="max-w-7xl mx-auto px-6 md:px-12 mt-32 pt-12 border-t border-neutral-900 flex justify-between">
                <Link to="/portfolio" className="text-neutral-500 hover:text-white">Back to Archive</Link>
             </div>
        </div>
    );
};

// --- ABOUT & CONTACT ---
export const About: React.FC = () => (
    <div className="pt-40 px-6 md:px-12 min-h-screen max-w-5xl mx-auto">
        <h1 className="text-6xl font-black mb-12 text-[#008f4f]">MANIFESTO</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-xl leading-relaxed space-y-6 text-neutral-300">
                <p>I believe that digital art is not just a replication of physical reality, but a portal into the unseen structures of our universe.</p>
                <p>Using code, 3D modelling, and traditional composition, I explore the tension between the perfect geometry of machines and the chaotic decay of nature.</p>
                <p>Based in Tokyo, working globally.</p>
            </div>
            <div className="space-y-8 font-mono text-sm text-neutral-400">
                <div>
                    <h3 className="text-white font-bold mb-4 border-b border-neutral-800 pb-2">Exhibitions</h3>
                    <ul className="space-y-2">
                        <li className="flex justify-between"><span>Neo-Tokyo Digital Art Fair</span> <span>2024</span></li>
                        <li className="flex justify-between"><span>Void Space London</span> <span>2023</span></li>
                        <li className="flex justify-between"><span>Ars Electronica (Group)</span> <span>2022</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export const Contact: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    }

    return (
        <div className="pt-40 px-6 md:px-12 min-h-screen max-w-4xl mx-auto">
             <h1 className="text-6xl font-black mb-4">INQUIRIES</h1>
             <p className="text-neutral-400 mb-12 text-xl">Available for commissions and collaborations.</p>

             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Name</label>
                        <input type="text" className="bg-transparent border-b border-neutral-800 py-4 text-xl focus:border-[#008f4f] focus:outline-none transition-colors" placeholder="Jane Doe" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Email</label>
                        <input type="email" className="bg-transparent border-b border-neutral-800 py-4 text-xl focus:border-[#008f4f] focus:outline-none transition-colors" placeholder="jane@example.com" required />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Subject</label>
                        <select className="bg-transparent border-b border-neutral-800 py-4 text-xl focus:border-[#008f4f] focus:outline-none transition-colors bg-black">
                            <option>Commission Inquiry</option>
                            <option>Print Purchase</option>
                            <option>Press / Collaboration</option>
                            <option>Other</option>
                        </select>
                </div>
                 <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Message</label>
                        <textarea rows={4} className="bg-transparent border-b border-neutral-800 py-4 text-xl focus:border-[#008f4f] focus:outline-none transition-colors resize-none" placeholder="Tell me about your project..." required />
                </div>
                <button 
                    type="submit" 
                    className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#008f4f] transition-colors flex items-center gap-2"
                >
                    {submitted ? <><Check size={20} /> Sent</> : 'Send Message'}
                </button>
             </form>
        </div>
    );
};