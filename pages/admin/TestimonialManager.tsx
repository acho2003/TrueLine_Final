import React, { useState, useEffect, useCallback } from 'react';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../../services/api';
import { Testimonial } from '../../types'; // Ensure this type exists
import Spinner from '../../components/Spinner';
import { PlusCircle, Trash2, X, Star } from 'lucide-react';

const TestimonialManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    const fetchTestimonials = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (err: any) {
            setError('Failed to fetch testimonials.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createTestimonial({ name, location, rating, reviewText });
            setName('');
            setLocation('');
            setRating(5);
            setReviewText('');
            setIsFormVisible(false);
            fetchTestimonials();
        } catch (err: any) {
            setError('Failed to create testimonial.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this review?')) {
            try {
                await deleteTestimonial(id);
                fetchTestimonials();
            } catch (err) {
                setError('Failed to delete review.');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Manage Testimonials</h1>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
                >
                    {isFormVisible ? <X size={20} /> : <PlusCircle size={20} />}
                    {isFormVisible ? 'Cancel' : 'Add Review'}
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}

            {isFormVisible && (
                <div className="bg-white p-6 mb-8 rounded-lg shadow-sm animate-fadeInUp border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Client Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Location (e.g. Perth, WA)" value={location} onChange={e => setLocation(e.target.value)} required className="w-full p-2 border rounded" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full p-2 border rounded">
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        <textarea placeholder="Review Content..." value={reviewText} onChange={e => setReviewText(e.target.value)} required rows={4} className="w-full p-2 border rounded" />

                        <div className="flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary-dark disabled:bg-gray-400">
                                {isSubmitting ? 'Saving...' : 'Save Review'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? <div className="flex justify-center p-8"><Spinner /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map(item => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <div className="flex text-yellow-400">
                                        {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{item.location}</p>
                                <p className="text-gray-700 italic">"{item.reviewText}"</p>
                            </div>
                            <button onClick={() => handleDelete(item._id)} className="self-end text-red-500 mt-4 hover:text-red-700">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestimonialManager;