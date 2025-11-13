// src/pages/admin/BlogManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { getBlogPosts, createBlogPost, deleteBlogPost, BlogPost } from '../../services/api';
import Spinner from '../../components/Spinner';
import { PlusCircle, Trash2, X, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';;

const BlogManager: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await getBlogPosts();
            setPosts(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch posts.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImageFile(null);
        setIsFormVisible(false);
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !imageFile) {
            setError('Please fill all fields and select an image.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', imageFile); // 'image' must match the backend upload field name

        try {
            await createBlogPost(formData);
            resetForm();
            fetchPosts();
        } catch (err: any) {
            setError(err.message || 'Failed to create post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteBlogPost(id);
                fetchPosts();
            } catch (err: any) {
                setError(err.message || 'Failed to delete post.');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Manage Blog</h1>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-colors"
                >
                    {isFormVisible ? <X size={20} /> : <PlusCircle size={20} />}
                    {isFormVisible ? 'Cancel' : 'Add New Post'}
                </button>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
            
            {isFormVisible && (
                <div className="bg-white p-6 mb-8 border border-gray-200 rounded-lg shadow-sm animate-fadeInUp">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Post Title" className="mt-1 w-full text-2xl font-bold rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={10} placeholder="Write your blog content here..." className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="flex justify-end pt-2">
                             <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                                {isSubmitting ? <><Spinner size="sm" /> Publishing...</> : 'Publish Post'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? <div className="flex justify-center p-8"><Spinner /></div> : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post._id} className="bg-white rounded-lg shadow-md flex items-center p-4">
                            <img src={`backend/${post.imageUrl}`} alt={post.title} className="w-32 h-20 object-cover rounded-md mr-4" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                                <p className="text-sm text-gray-500">Published on: {new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogManager;