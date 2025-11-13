// src/pages/BlogDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPosts, BlogPost } from '../services/api';
import Spinner from '../components/Spinner';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

// ✅ Use environment variable or fallback
const API_BASE_URL = "https://trueline.onrender.com";


const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const allPosts = await getBlogPosts();
        const selectedPost = allPosts.find((p) => p._id === id);
        if (!selectedPost) throw new Error('Post not found');
        setPost(selectedPost);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

      // Scroll to top
      window.scrollTo(0, 0);
    };
    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-md my-8">
        {error}
      </div>
    );

  if (!post) return null;

  // ✅ Normalize image path (fixes slashes and removes backend prefix)
  const normalizedPath = post.imageUrl
    .replace(/^backend[\\/]+/, '')
    .replace(/\\/g, '/');

  const imageUrl = `${API_BASE_URL}/${normalizedPath}`;

  // Social sharing
  const postUrl = window.location.href;
  const shareText = `Check out this article from TrueLine: ${post.title}`;

  return (
    <div className="bg-white py-20 lg:py-28 font-open-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <main className="lg:col-span-2">
            <article>
              {/* Back Link */}
              <Link
                to="/blog"
                className="inline-block text-secondary font-semibold mb-8 hover:underline"
              >
                &larr; Back to All Posts
              </Link>

              {/* Post Header */}
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-primary font-montserrat leading-tight">
                  {post.title}
                </h1>
                <p className="text-gray-500 text-base mt-4">
                  Posted on{' '}
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  by <span className="font-semibold text-primary">TrueLine Team</span>
                </p>
              </header>

              {/* ✅ Feature Image */}
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-auto object-cover shadow-lg mb-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; // fallback image if missing
                }}
              />

              {/* Post Content */}
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Social Sharing */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-bold font-montserrat text-lg text-primary mb-4">
                  Share This Post
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-500 hover:border-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${postUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-500 hover:border-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${post.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-500 hover:border-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
