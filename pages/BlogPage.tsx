// src/pages/BlogPage.tsx
import React, { useState, useEffect } from "react";
import { getBlogPosts, BlogPost } from "../services/api";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs"; // A nice arrow for the button

const API_BASE_URL = "https://trueline.onrender.com";

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-md my-8 container mx-auto">
        {error}
      </div>
    );

  return (
    <div className="font-open-sans -mt-10">
      {/* --- Banner Section --- */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="container mx-auto px-4" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-montserrat">
            Our Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore stories, insights, and tips from our team — crafted to
            inspire and inform your outdoor projects.
          </p>
        </div>
      </section>

      {/* --- Main Blog Grid --- */}
      <div className="bg-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 text-xl py-10">
              No blog posts yet. Stay tuned!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <article
                  key={post._id}
                  className="group bg-white rounded-none overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* --- Image --- */}
                  <div className="relative overflow-hidden h-64">
                    <Link to={`/blog/${post._id}`}>
                      <img
                        // ✅ FIX: fetch image from backend correctly
                        src={`backend/${post.imageUrl.replace(/\\/g, "/")}`}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                  </div>

                  {/* --- Content --- */}
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <h2 className="text-2xl font-bold text-primary mb-3 leading-snug transition-colors duration-300 font-montserrat group-hover:text-secondary">
                      <Link to={`/blog/${post._id}`}>{post.title}</Link>
                    </h2>

                    <div
                      className="text-gray-600 text-base leading-relaxed flex-grow line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: post.content.substring(0, 150) + "...",
                      }}
                    />

                    {/* --- Read More Button --- */}
                    <div className="mt-6">
                      <Link
                        to={`/blog/${post._id}`}
                        className="inline-block relative overflow-hidden group/button font-bold py-2 px-6 rounded-none border-2 border-primary text-primary transition-all duration-300"
                      >
                        <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover/button:w-full z-0"></span>
                        <span className="relative z-10 flex items-center gap-2 group-hover/button:text-white transition-colors duration-300">
                          Read More
                          <BsArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
