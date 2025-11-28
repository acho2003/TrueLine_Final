import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookingManager from './BookingManager';
import ServiceManager from './ServiceManager';
import GalleryManager from './GalleryManager';
import BlogManager from './BlogManager'; // <-- 1. IMPORT the new BlogManager component
import TestimonialManager from './TestimonialManager';

// Define the type for our tabs to ensure type safety
// V V V 2. ADD 'Blog' to the list of possible tab types V V V
type AdminTab = 'Bookings' | 'Services' | 'Gallery' | 'Blog' | 'Testimonials';

const AdminDashboardPage: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdminTab>('Bookings');

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    // This function decides which manager component to render based on the active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'Bookings':
                return <BookingManager />;
            case 'Services':
                return <ServiceManager />;
            case 'Gallery':
                return <GalleryManager />;
            case 'Blog': // <-- 3. ADD a case for the 'Blog' tab
                return <BlogManager />;
            case 'Testimonials':
                return <TestimonialManager />;
            default:
                return <div>Select a tab to get started.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            {/* Reusable Header */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
                    <div>
                        <span className="mr-4 hidden sm:inline">Welcome, {user?.name}</span>
                        <button onClick={handleLogout} className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Tab Navigation */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {/* V V V 4. ADD 'Blog' to the array of tabs to be rendered V V V */}
                        {(['Bookings', 'Services', 'Gallery', 'Blog','Testimonials'] as AdminTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                
                {/* Rendered Content Area */}
                <section className="p-6 bg-white rounded-lg shadow-lg">
                    {renderContent()}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboardPage;