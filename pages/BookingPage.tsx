import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, getServices } from '../services/api';
import { Service } from '../types';
import Spinner from '../components/Spinner';

const ADMIN_WHATSAPP_NUMBER = '97517781187';
const ADMIN_PHONE_NUMBER = '+97517781187';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [unitHouseNumber, setUnitHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [state, setState] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contactMethod, setContactMethod] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    phone: false,
    email: false,
    unitHouseNumber: false,
    streetName: false,
    state: false,
    services: false,
  });

  // Detect mobile vs desktop by viewport width
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768); // < md breakpoint
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchServicesForChecklist = async () => {
      try {
        const data = await getServices();
        setAllServices(data);
      } catch (err) {
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
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName]
    );
  };

  // Phone change handler that only keeps digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, ''); // keep only 0–9
    setPhone(numeric);

    if (validationErrors.phone && numeric.trim()) {
      setValidationErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError('');
    setSuccess('');

    const newErrors = {
      name: !name.trim(),
      phone: !phone.trim(),
      email: !email.trim() || !email.includes('@'),
      unitHouseNumber: !unitHouseNumber.trim(),
      streetName: !streetName.trim(),
      state: !state.trim(),
      services: selectedServices.length === 0,
    };

    setValidationErrors(newErrors);
    if (Object.values(newErrors).some((isError) => isError)) {
      setError('Please fill in all required fields highlighted in red.');
      return;
    }

    setLoading(true);
    setError('');
    
    const fullAddress = `${unitHouseNumber} ${streetName}, ${state}`;
    const submissionData = {
      name,
      phone,
      email,
      address: fullAddress,
      serviceType: selectedServices.join(', '),
      preferredDateTime: new Date().toISOString(),
      notes,
    };

    try {
      await createBooking(submissionData);
      setSuccess('Your quote request has been sent!');
      const message = `
New Quote Request!
Name: ${submissionData.name}
Phone: ${submissionData.phone}
Email: ${submissionData.email}
Address: ${submissionData.address}
Services: ${submissionData.serviceType}
Notes: ${submissionData.notes || 'N/A'}
      `;
      const encodedMsg = encodeURIComponent(message);
      const whatsappWebLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMsg}`;
      const smsURL = `sms:${ADMIN_PHONE_NUMBER}?body=${encodedMsg}`;

      if (isMobile) {
        // On mobile: respect user choice (WhatsApp or SMS)
        if (contactMethod === 'whatsapp') {
          window.open(whatsappWebLink, '_blank');
        } else if (contactMethod === 'sms') {
          window.location.href = smsURL;
        }
      } else {
        // On desktop: always open WhatsApp (SMS won't work)
        window.open(whatsappWebLink, '_blank');
      }

      // Reset form and submission tracker
      setName('');
      setPhone('');
      setEmail('');
      setUnitHouseNumber('');
      setStreetName('');
      setState('');
      setSelectedServices([]);
      setNotes('');
      setValidationErrors({
        name: false,
        phone: false,
        email: false,
        unitHouseNumber: false,
        streetName: false,
        state: false,
        services: false,
      });
      setFormSubmitted(false);
      setContactMethod('whatsapp');

      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
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
  
  const getLabelClasses = (hasError: boolean) => {
    const baseClasses = 'block text-sm font-medium mb-1';
    return hasError ? `${baseClasses} text-red-600` : `${baseClasses} text-gray-700`;
  };

  return (
    <div className="bg-gray-50 py-20 font-open-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-2xl rounded-none">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-black font-montserrat">Get a Quote</h1>
            <p className="text-gray-600 mt-2">
              Let us know what you're looking for, and we'll provide a no-obligation quote.
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

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={getLabelClasses(validationErrors.name)}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({ ...prev, name: false }));
                    }
                  }}
                  className={getInputClasses(validationErrors.name)}
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-600 mt-1">* This field is required.</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className={getLabelClasses(validationErrors.phone)}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={getInputClasses(validationErrors.phone)}
                />
                {validationErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">* This field is required.</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className={getLabelClasses(validationErrors.email)}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: false }));
                  }
                }}
                className={getInputClasses(validationErrors.email)}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-600 mt-1">
                  * A valid email is required (e.g., name@example.com).
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="unitHouseNumber"
                  className={getLabelClasses(validationErrors.unitHouseNumber)}
                >
                  Unit/House Number
                </label>
                <input
                  type="text"
                  id="unitHouseNumber"
                  value={unitHouseNumber}
                  onChange={(e) => {
                    setUnitHouseNumber(e.target.value);
                    if (validationErrors.unitHouseNumber) {
                      setValidationErrors((prev) => ({ ...prev, unitHouseNumber: false }));
                    }
                  }}
                  className={getInputClasses(validationErrors.unitHouseNumber)}
                />
                {validationErrors.unitHouseNumber && (
                  <p className="text-xs text-red-600 mt-1">* Required.</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="streetName"
                  className={getLabelClasses(validationErrors.streetName)}
                >
                  Street Name
                </label>
                <input
                  type="text"
                  id="streetName"
                  value={streetName}
                  onChange={(e) => {
                    setStreetName(e.target.value);
                    if (validationErrors.streetName) {
                      setValidationErrors((prev) => ({ ...prev, streetName: false }));
                    }
                  }}
                  className={getInputClasses(validationErrors.streetName)}
                />
                {validationErrors.streetName && (
                  <p className="text-xs text-red-600 mt-1">* Required.</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className={getLabelClasses(validationErrors.state)}>
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (validationErrors.state) {
                      setValidationErrors((prev) => ({ ...prev, state: false }));
                    }
                  }}
                  className={getInputClasses(validationErrors.state)}
                />
                {validationErrors.state && (
                  <p className="text-xs text-red-600 mt-1">* Required.</p>
                )}
              </div>
            </div>

            <div>
              <label className={getLabelClasses(validationErrors.services)}>
                Services of Interest
              </label>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border bg-gray-50 rounded-none ${
                  validationErrors.services ? 'border-2 border-red-500' : 'border-gray-200'
                }`}
              >
                {allServices.map((service) => (
                  <label
                    key={service._id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
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
              {validationErrors.services && (
                <p className="text-xs text-red-600 mt-1">
                  * Please select at least one service.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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

            {/* Contact method only visible on mobile */}
            {isMobile && (
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
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`inline-block w-full sm:w-auto relative group/button font-bold py-3 px-12 text-lg rounded-none border-2 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
                  ${formSubmitted && error ? 'border-red-500 text-red-500' : 'border-primary text-primary'}
                `}
              >
                <span
                  className={`absolute top-0 left-0 w-0 h-full transition-all duration-300 ease-in-out group-hover/button:w-full z-0 ${
                    formSubmitted && error ? 'bg-red-500' : 'bg-[#6FAF4B]'
                  }`}
                ></span>
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
