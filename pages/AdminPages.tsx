import React, { useState } from 'react';
import { Artwork, Collection } from '../types';
import { Plus, Trash, Edit, Save, Upload } from 'lucide-react';

interface Props {
  artworks: Artwork[];
  setArtworks: React.Dispatch<React.SetStateAction<Artwork[]>>;
  collections: Collection[];
}

export const AdminDashboard: React.FC<Props> = ({ artworks, setArtworks, collections }) => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Artwork>>({});

    const handleEdit = (art: Artwork) => {
        setFormData(art);
        setEditingId(art.id);
        setView('form');
    };

    const handleNew = () => {
        setFormData({
            title: '',
            slug: '',
            year: new Date().getFullYear().toString(),
            medium: '',
            dimensions: '',
            description: '',
            tags: [],
            availability: 'for_sale',
            featured: false,
            heroMedia: 'https://picsum.photos/1000/1000', // Placeholder
            galleryMedia: []
        });
        setEditingId(null);
        setView('form');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setArtworks(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } as Artwork : a));
        } else {
            const newArt = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Artwork;
            setArtworks(prev => [newArt, ...prev]);
        }
        setView('list');
    };

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure?")) {
            setArtworks(prev => prev.filter(a => a.id !== id));
        }
    };


    if (view === 'list') {
        return (
            <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold">Creator Dashboard</h1>
                    <button onClick={handleNew} className="bg-[#008f4f] text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90">
                        <Plus size={20} /> New Artwork
                    </button>
                </div>

                <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                            <tr>
                                <th className="p-4">Artwork</th>
                                <th className="p-4">Year</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artworks.map(art => (
                                <tr key={art.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                                    <td className="p-4 flex items-center gap-4">
                                        <img src={art.heroMedia} className="w-12 h-12 object-cover rounded" alt="" />
                                        <div>
                                            <div className="font-bold">{art.title}</div>
                                            <div className="text-xs text-neutral-500">{art.collectionId}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-neutral-400">{art.year}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${art.availability === 'for_sale' ? 'bg-green-900 text-green-300' : 'bg-neutral-700 text-neutral-300'}`}>
                                            {art.availability.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(art)} className="p-2 hover:bg-neutral-700 rounded"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(art.id)} className="p-2 hover:bg-red-900/50 text-red-500 rounded"><Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen">
            <button onClick={() => setView('list')} className="text-neutral-500 hover:text-white mb-6">&larr; Back to Dashboard</button>
            <h1 className="text-3xl font-bold mb-8">{editingId ? 'Edit Artwork' : 'New Artwork'}</h1>
            
            <form onSubmit={handleSave} className="space-y-6 bg-neutral-900 p-8 rounded-xl border border-neutral-800">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Title</label>
                        <input className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-[#008f4f] outline-none" 
                            value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} required />
                    </div>
                    <div>
                         <label className="block text-sm font-bold mb-2">Slug</label>
                         <input className="w-full bg-black border border-neutral-800 rounded p-3 text-neutral-500" 
                            value={formData.slug || ''} readOnly />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                     <div>
                        <label className="block text-sm font-bold mb-2">Year</label>
                        <input className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-[#008f4f] outline-none" 
                            value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} />
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-2">Medium</label>
                        <input className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-[#008f4f] outline-none" 
                            value={formData.medium || ''} onChange={e => setFormData({...formData, medium: e.target.value})} />
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-2">Availability</label>
                        <select className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-[#008f4f] outline-none"
                             value={formData.availability || 'for_sale'} onChange={e => setFormData({...formData, availability: e.target.value as any})}>
                                 <option value="for_sale">For Sale</option>
                                 <option value="sold">Sold</option>
                                 <option value="nfs">Not For Sale</option>
                         </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Description</label>
                    <textarea className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-[#008f4f] outline-none h-32" 
                            value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                
                 <div>
                        <label className="block text-sm font-bold mb-2">Collection</label>
                        <select className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-[#008f4f] outline-none"
                             value={formData.collectionId || ''} onChange={e => setFormData({...formData, collectionId: e.target.value})}>
                                 <option value="">Select Collection...</option>
                                 {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                         </select>
                </div>
                
                <div className="border-t border-neutral-800 pt-6 flex justify-end gap-4">
                     <button type="button" onClick={() => setView('list')} className="px-6 py-3 rounded text-neutral-400 hover:text-white">Cancel</button>
                     <button type="submit" className="bg-white text-black px-6 py-3 rounded font-bold hover:bg-[#008f4f] flex items-center gap-2">
                         <Save size={16} /> Save Artwork
                     </button>
                </div>
            </form>
        </div>
    );
};