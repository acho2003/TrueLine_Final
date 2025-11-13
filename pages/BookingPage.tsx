import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, getServices } from '../services/api';
import { Service } from '../types';
import Spinner from '../components/Spinner';

const ADMIN_WHATSAPP_NUMBER = '97517781187'; // Bhutan number without +
const ADMIN_PHONE_NUMBER = '+97517781187'; // For SMS

const BookingPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isIOS, setIsIOS] = useState(false);

  const [contactMethod, setContactMethod] = useState<'sms' | 'whatsapp'>('whatsapp');

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    phone: false,
    address: false,
    services: false,
  });

  // ✅ Detect iPhone/iOS
  useEffect(() => {
    const iOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsIOS(iOSDevice);
  }, []);

  // ✅ Fetch Services
  useEffect(() => {
    const fetchServicesForChecklist = async () => {
      try {
        const data = await getServices();
        setAllServices(data);
      } catch (err) {
        console.error('Could not load services', err);
        setError('Could not load services. Please refresh.');
      }
    };
    fetchServicesForChecklist();
  }, []);

  const handleServiceChange = (serviceName: string) => {
    if (validationErrors.services) {
      setValidationErrors((prev) => ({ ...prev, services: false }));
    }
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newErrors = {
      name: !name.trim(),
      phone: !phone.trim(),
      address: !address.trim(),
      services: selectedServices.length === 0,
    };

    setValidationErrors(newErrors);
    if (Object.values(newErrors).some((isError) => isError)) {
      setError('Please fill in all required fields highlighted in red.');
      return;
    }

    setLoading(true);

    const submissionData = {
      name,
      phone,
      address,
      serviceType: selectedServices.join(', '),
      preferredDateTime: new Date().toISOString(),
      notes,
    };

    try {
      // ✅ Send to backend
      await createBooking(submissionData);
      setSuccess('Your quote request has been sent!');

      // ✅ Prepare message
      const message = `
New Quote Request!
Name: ${submissionData.name}
Phone: ${submissionData.phone}
Address: ${submissionData.address}
Services: ${submissionData.serviceType}
Notes: ${submissionData.notes || 'N/A'}
      `;

      // ✅ Platform-specific WhatsApp handling
      const encodedMsg = encodeURIComponent(message);
      const whatsappDeepLink = `whatsapp://send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodedMsg}`;
      const whatsappWebLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMsg}`;
      const smsURL = `sms:${ADMIN_PHONE_NUMBER}?body=${encodedMsg}`;

      // ✅ Open based on contact method and device
      if (contactMethod === 'whatsapp') {
        if (isIOS) {
          // Use deep link for iPhone
          window.location.href = whatsappDeepLink;
          // fallback to web after delay if app is not installed
          setTimeout(() => window.open(whatsappWebLink, '_blank'), 1000);
        } else {
          // Android / Desktop
          window.open(whatsappWebLink, '_blank');
        }
      } else if (contactMethod === 'sms') {
        window.location.href = smsURL;
      }

      // ✅ Reset form
      setName('');
      setPhone('');
      setAddress('');
      setSelectedServices([]);
      setNotes('');
      setValidationErrors({ name: false, phone: false, address: false, services: false });

      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (hasError: boolean) => {
    const baseClasses =
      'mt-1 block w-full px-3 py-2 border rounded-none shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50';
    return hasError
      ? `${baseClasses} border-2 border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClasses} border-gray-300 focus:border-primary focus:ring-primary`;
  };

  return (
    <div className="bg-gray-50 py-20 font-open-sans -mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-2xl rounded-none">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-black font-montserrat">Get a Quote</h1>
            <p className="text-gray-600 mt-2">
              Let us know what you're looking for, and we'll provide a free, no-obligation quote.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-none mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-none mb-6 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name)
                      setValidationErrors((prev) => ({ ...prev, name: false }));
                  }}
                  required
                  className={getInputClasses(validationErrors.name)}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationErrors.phone)
                      setValidationErrors((prev) => ({ ...prev, phone: false }));
                  }}
                  required
                  className={getInputClasses(validationErrors.phone)}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address (Surub)
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (validationErrors.address)
                    setValidationErrors((prev) => ({ ...prev, address: false }));
                }}
                required
                className={getInputClasses(validationErrors.address)}
              />
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services of Interest
              </label>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border bg-gray-50 rounded-none ${
                  validationErrors.services ? 'border-2 border-red-500' : 'border-gray-200'
                }`}
              >
                {allServices.map((service) => (
                  <label key={service._id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.name)}
                      onChange={() => handleServiceChange(service.name)}
                      className="h-5 w-5 text-primary border-gray-300 rounded-sm focus:ring-primary"
                    />
                    <span className="text-gray-800 font-medium">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:border-primary focus:ring-primary"
              ></textarea>
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={contactMethod === 'whatsapp'}
                    onChange={() => setContactMethod('whatsapp')}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span>WhatsApp</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="sms"
                    checked={contactMethod === 'sms'}
                    onChange={() => setContactMethod('sms')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-block w-full sm:w-auto relative group/button font-bold py-3 px-12 text-lg rounded-none border-2 border-primary text-primary transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover/button:w-full z-0"></span>
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover/button:text-white transition-colors duration-300">
                  {loading ? <Spinner size="sm" /> : 'Request My Quote'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
