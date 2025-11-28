import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Removed unused chart imports for cleaner code
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Booking, BookingStatus } from '../../types';
import { getBookings, updateBookingStatus, deleteBooking } from '../../services/api';
import Spinner from '../../components/Spinner';
import BookingModal from '../../components/BookingModal';

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

    return (
        <>
            {error && <div className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</div>}
            
            <h2 className="text-xl font-bold mb-4">Bookings Management</h2>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {Object.values(BookingStatus).map(status => (
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