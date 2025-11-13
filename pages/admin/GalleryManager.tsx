// src/pages/admin/GalleryManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { getManagedGalleryItems, createGalleryItem, deleteGalleryItem, GalleryItem } from '../../services/api';
import Spinner from '../../components/Spinner';
import { PlusCircle, Trash2, UploadCloud, X } from 'lucide-react';


const API_BASE_URL = 'https://trueline.onrender.com/api';

const GalleryManager: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Form State
    const [serviceType, setServiceType] = useState('');
    const [description, setDescription] = useState('');
    const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
    const [afterFiles, setAfterFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await getManagedGalleryItems();
            setItems(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch gallery items.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const resetForm = () => {
        setServiceType('');
        setDescription('');
        setBeforeFiles([]);
        setAfterFiles([]);
        setIsFormVisible(false);
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceType || !description || beforeFiles.length === 0 || afterFiles.length === 0) {
            setError('Please fill all fields and select both before and after photos.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('serviceType', serviceType);
        formData.append('description', description);
        beforeFiles.forEach(file => formData.append('beforePhotos', file));
        afterFiles.forEach(file => formData.append('afterPhotos', file));

        try {
            await createGalleryItem(formData);
            resetForm();
            fetchItems(); // Refresh the list
        } catch (err: any) {
            setError(err.message || 'Failed to create gallery item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this gallery item?')) {
            try {
                setError('');
                await deleteGalleryItem(id);
                fetchItems(); // Refresh the list
            } catch (err: any) {
                setError(err.message || 'Failed to delete item.');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Manage Gallery</h1>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-colors"
                >
                    {isFormVisible ? <X size={20} /> : <PlusCircle size={20} />}
                    {isFormVisible ? 'Cancel' : 'Add New Work'}
                </button>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
            
            {/* --- Add/Edit Form --- */}
            {isFormVisible && (
                <div className="bg-white p-6 mb-8 border border-gray-200 rounded-lg shadow-sm animate-fadeInUp">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
                            <input id="serviceType" type="text" value={serviceType} onChange={e => setServiceType(e.target.value)} required placeholder="e.g., Garden Restoration" className="mt-1 w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="A brief description of the work performed." className="mt-1 w-full rounded-md border-gray-300 shadow-sm"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Before Photos</label>
                                <input type="file" multiple accept="image/*" onChange={e => setBeforeFiles(Array.from(e.target.files || []))} className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">After Photos</label>
                                <input type="file" multiple accept="image/*" onChange={e => setAfterFiles(Array.from(e.target.files || []))} className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                             <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                                {isSubmitting ? <><Spinner size="sm" /> Submitting...</> : <><UploadCloud size={20} /> Create Work</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- Gallery Items List --- */}
            {isLoading ? <div className="flex justify-center p-8"><Spinner /></div> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800">{item.serviceType}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-gray-200">
                                {item.beforePhotos.map((url, i) => <img key={i} src={`backend/${url}`} alt="Before" className="w-full h-32 object-cover" />)}
                                {item.afterPhotos.map((url, i) => <img key={i} src={`backend/${url}`} alt="After" className="w-full h-32 object-cover" />)}
                            </div>
                            <div className="p-2 bg-gray-50 flex justify-end">
                                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isLoading && items.length === 0 && <p className="text-center text-gray-500 mt-8">No gallery items found. Click "Add New Work" to get started.</p>}
        </div>
    );
};

export default GalleryManager;