import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Booking, BookingStatus } from '../../types';
import { getBookings, updateBookingStatus, deleteBooking, uploadPhotos } from '../../services/api';
import Spinner from '../../components/Spinner';
import BookingModal from '../../components/BookingModal'; // Make sure this path is correct

const statusColors: { [key in BookingStatus]: string } = {
    [BookingStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.Approved]: 'bg-blue-100 text-blue-800',
    [BookingStatus.InProgress]: 'bg-indigo-100 text-indigo-800',
    [BookingStatus.Completed]: 'bg-green-100 text-green-800',
    [BookingStatus.Canceled]: 'bg-red-100 text-red-800',
};

const BookingManager: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<BookingStatus>(BookingStatus.Pending);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBookings();
            setBookings(data);
        } catch (err: any) {
            console.error('Failed to fetch bookings', err);
            setError(err.message || 'Could not fetch bookings.');
            if (err.message.includes('Not authorized')) {
                logout();
                navigate('/admin');
            }
        } finally {
            setLoading(false);
        }
    }, [logout, navigate]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleStatusUpdate = async (id: string, status: BookingStatus) => {
        await updateBookingStatus(id, status);
        fetchBookings();
        setSelectedBooking(prev => prev ? { ...prev, status } : null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            await deleteBooking(id);
            fetchBookings();
            setSelectedBooking(null);
        }
    }

    const filteredBookings = useMemo(() => bookings.filter(b => b.status === activeTab), [bookings, activeTab]);

    const analyticsData = useMemo(() => {
        const serviceCounts = bookings.reduce((acc, booking) => {
            acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(serviceCounts).map(([name, count]) => ({ name, count }));
    }, [bookings]);

    const monthlyTrends = useMemo(() => {
        const trends: Record<string, number> = {};
        bookings.forEach(booking => {
            const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            trends[month] = (trends[month] || 0) + 1;
        });
        return Object.entries(trends).map(([name, count]) => ({ name, count })).reverse();
    }, [bookings]);

    return (
        <>
            {error && <div className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</div>}
            
            {/* <section className="mb-8 p-6 bg-gray-50 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ minHeight: '300px' }}>
                    <div style={{ width: '100%', height: '300px' }}>
                        <h3 className="text-lg font-semibold text-center mb-2">Popular Services</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#313647" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ width: '100%', height: '300px' }}>
                        <h3 className="text-lg font-semibold text-center mb-2">Monthly Bookings</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#9EB78B" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section> */}

            <h2 className="text-xl font-bold mb-4">Bookings Management</h2>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {Object.values(BookingStatus).map(status => (
                        // --- FIX #1: Add a unique 'key' to the status button ---
                        // The 'status' string itself ('Pending', 'Approved', etc.) is unique here.
                        <button 
                            key={status} 
                            onClick={() => setActiveTab(status)}
                            className={`${activeTab === status ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {status} ({bookings.filter(b => b.status === status).length})
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-4">
                {loading ? <Spinner /> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map(booking => (
                                    // --- FIX #2: Add a unique 'key' to the table row ---
                                    // The booking._id from MongoDB is the perfect unique key.
                                    <tr key={booking._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                                            <div className="text-sm text-gray-500">{booking.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.serviceType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.preferredDateTime).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[booking.status]}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => setSelectedBooking(booking)} className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                                            <button onClick={() => handleDelete(booking._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredBookings.length === 0 && <p className="text-center py-4">No bookings found in this category.</p>}
                    </div>
                )}
            </div>
            {selectedBooking && (
                <BookingModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)} 
                    onStatusUpdate={handleStatusUpdate} 
                    onPhotosUploaded={fetchBookings} 
                />
            )}
        </>
    );
};

export default BookingManager;