import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { uploadPhotos } from '../services/api'; // Only need the upload API call here
import Spinner from './Spinner'; // Assuming Spinner is in the components folder

interface BookingModalProps {
  booking: Booking;
  onClose: () => void;
  onStatusUpdate: (id: string, status: BookingStatus) => Promise<void>;
  onPhotosUploaded: () => void;
}

// Replace with your backend API
const API_BASE_URL = 'http://localhost:5000';
// Admin WhatsApp number (include country code, no +)
const ADMIN_WHATSAPP_NUMBER = '97517781187';

const BookingModal: React.FC<BookingModalProps> = ({ booking, onClose, onStatusUpdate, onPhotosUploaded }) => {
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<'before' | 'after' | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState(false);

  // Upload photos
  
  // Status update
  const handleLocalStatusUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingStatus(true);
    setModalError(null);
    try {
      await onStatusUpdate(booking._id, e.target.value as BookingStatus);
    } catch (error: any) {
      console.error('Status update failed', error);
      setModalError(error.message || 'Could not update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Send WhatsApp notification (Click-to-Chat)
  const handleSendWhatsapp = () => {
    setIsSendingWhatsapp(true);
    const message = `
New Booking Received!
Name: ${booking.name}
Phone: ${booking.phone}
Address: ${booking.address}
Service: ${booking.serviceType}
Preferred Date & Time: ${new Date(booking.preferredDateTime).toLocaleString()}
Notes: ${booking.notes || 'N/A'}
    `;
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    setIsSendingWhatsapp(false);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full animate-fadeInUp">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Booking Details: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{booking._id}</span>
                </h3>

                {/* Booking Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><strong>Customer:</strong> {booking.name}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  <p className="md:col-span-2"><strong>Surub:</strong> {booking.address}</p>
                  <p><strong>Service:</strong> {booking.serviceType}</p>
                  <p><strong>Requested:</strong> {new Date(booking.preferredDateTime).toLocaleString()}</p>
                  <div className="md:col-span-2">
                    <strong>Notes:</strong>
                    <p className="p-2 bg-gray-50 rounded mt-1 text-xs border border-gray-200 min-h-[60px] overflow-y-auto">
                      {booking.notes || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Update Status</label>
                  <div className="flex items-center gap-2">
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
                      defaultValue={booking.status}
                      onChange={handleLocalStatusUpdate}
                      disabled={isUpdatingStatus}
                    >
                      {Object.values(BookingStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    {isUpdatingStatus && <div className="mt-1"><Spinner size="sm" /></div>}
                  </div>
                </div>

                {/* Send WhatsApp */}
                <div className="mt-4">
                  <button
                    onClick={handleSendWhatsapp}
                    disabled={isSendingWhatsapp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold"
                  >
                    {isSendingWhatsapp ? 'Opening WhatsApp...' : 'Send WhatsApp Notification'}
                  </button>
                </div>

                {/* Error Display */}
                {modalError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-4" role="alert">
                    <span className="block sm:inline">{modalError}</span>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
