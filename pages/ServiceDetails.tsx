// src/pages/ServiceDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Service } from "../types";
import Spinner from "../components/Spinner";
import { createBooking } from "../services/api";
import { ArrowLeft, Printer, CheckCircle } from "lucide-react"; // Changed to CheckCircle (Safer for older Lucide versions)

const API_BASE_URL = "https://trueline.onrender.com";
const ADMIN_WHATSAPP_NUMBER = "97517781187";
const ADMIN_PHONE_NUMBER = "+97517781187";

// ============================================================================
// Quote Form Component
// ============================================================================
interface QuoteFormProps {
  serviceName: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ serviceName }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitHouseNumber, setUnitHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    phone: false,
    unitHouseNumber: false,
    streetName: false,
    state: false,
  });

  const [contactMethod, setContactMethod] = useState<"sms" | "whatsapp">("whatsapp");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    setPhone(numeric);
    if (validationErrors.phone && numeric.trim()) {
      setValidationErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const newErrors = {
      name: !name.trim(),
      phone: !phone.trim(),
      unitHouseNumber: !unitHouseNumber.trim(),
      streetName: !streetName.trim(),
      state: !state.trim(),
    };
    setValidationErrors(newErrors);

    if (Object.values(newErrors).some((isError) => isError)) {
      setError("Please fill in all required fields highlighted in red.");
      return;
    }

    setLoading(true);

    const fullAddress = `${unitHouseNumber} ${streetName}, ${state}`;
    const submissionData = {
      name,
      phone,
      address: fullAddress,
      notes,
      serviceType: serviceName,
      preferredDateTime: new Date().toISOString(),
    };

    try {
      await createBooking(submissionData);
      setSuccess("Your quote request has been sent! We will contact you shortly.");

      const message = `
New Quote Request!
Service: ${submissionData.serviceType}
Name: ${submissionData.name}
Phone: ${submissionData.phone}
Address: ${submissionData.address}
Notes: ${submissionData.notes || "N/A"}
      `;
      const encodedMsg = encodeURIComponent(message);
      const whatsappWebLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMsg}`;
      const smsURL = `sms:${ADMIN_PHONE_NUMBER}?body=${encodedMsg}`;

      if (isMobile) {
        if (contactMethod === "whatsapp") {
          window.open(whatsappWebLink, "_blank");
        } else if (contactMethod === "sms") {
          window.location.href = smsURL;
        }
      } else {
        window.open(whatsappWebLink, "_blank");
      }

      setName("");
      setPhone("");
      setUnitHouseNumber("");
      setStreetName("");
      setState("");
      setNotes("");
      setValidationErrors({
        name: false,
        phone: false,
        unitHouseNumber: false,
        streetName: false,
        state: false,
      });
      setContactMethod("whatsapp");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (hasError: boolean) => {
    const base =
      "mt-1 block w-full px-3 py-2 border rounded-none shadow-sm focus:outline-none focus:ring-1 focus:ring-opacity-50";
    return hasError
      ? `${base} border-2 border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${base} border-gray-300 focus:border-primary focus:ring-primary`;
  };

  return (
    <div className="bg-white p-8 sm:p-12 shadow-2xl rounded-none w-full">
      <div className="text-center mb-10">
        <p className="font-semibold text-secondary">READY TO START?</p>
        <h2 className="text-3xl font-bold text-black font-montserrat">
          Request a Quote for {serviceName}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-none mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-none mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
                if (validationErrors.name) setValidationErrors((p) => ({ ...p, name: false }));
              }}
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
              onChange={handlePhoneChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className={getInputClasses(validationErrors.phone)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="unitHouseNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Unit/House Number
            </label>
            <input
              type="text"
              id="unitHouseNumber"
              value={unitHouseNumber}
              onChange={(e) => {
                setUnitHouseNumber(e.target.value);
                if (validationErrors.unitHouseNumber)
                  setValidationErrors((p) => ({ ...p, unitHouseNumber: false }));
              }}
              className={getInputClasses(validationErrors.unitHouseNumber)}
            />
          </div>
          <div>
            <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">
              Street Name
            </label>
            <input
              type="text"
              id="streetName"
              value={streetName}
              onChange={(e) => {
                setStreetName(e.target.value);
                if (validationErrors.streetName)
                  setValidationErrors((p) => ({ ...p, streetName: false }));
              }}
              className={getInputClasses(validationErrors.streetName)}
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                if (validationErrors.state) setValidationErrors((p) => ({ ...p, state: false }));
              }}
              className={getInputClasses(validationErrors.state)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={getInputClasses(false)}
          ></textarea>
        </div>

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
                  checked={contactMethod === "whatsapp"}
                  onChange={() => setContactMethod("whatsapp")}
                  className="text-green-600 focus:ring-green-500"
                />
                <span>WhatsApp</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value="sms"
                  checked={contactMethod === "sms"}
                  onChange={() => setContactMethod("sms")}
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
            className="inline-block w-full sm:w-auto relative group font-bold py-3 px-12 text-lg rounded-none border-2 border-primary text-primary transition-all duration-300 overflow-hidden disabled:opacity-50"
          >
            <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
              {loading ? <Spinner size="sm" /> : "Submit Request"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// Main Service Details Page
// ============================================================================
const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ✅ Prevent crash: Initialize as empty array
  const [detailsList, setDetailsList] = useState<string[]>([]); 

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/services/${id}`);
        if (!res.ok) throw new Error("Service could not be found.");
        const data = await res.json();
        setService(data);

        // ✅ SAFE PARSING LOGIC:
        // 1. If 'details' exists and is a String, split it.
        // 2. If 'details' is already an Array (from DB), use it directly.
        // 3. Otherwise, use an empty array.
        let parsedDetails: string[] = [];
        if (data.details) {
            if (typeof data.details === "string") {
                parsedDetails = data.details.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
            } else if (Array.isArray(data.details)) {
                parsedDetails = data.details;
            }
        }
        setDetailsList(parsedDetails);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!service) return <div className="text-center py-20">Service not found.</div>;

  return (
    <div className="font-open-sans">
      <section className="bg-blue-50 text-primary py-16 md:py-20 print-hide">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold tracking-widest uppercase">Our Services</p>
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mt-2">
            {service.name}
          </h1>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white relative print-section">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12 md:mb-0 print-hide">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors duration-300"
            >
              <Printer size={20} />
              Print Details
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Back to Services
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start pt-0 md:pt-0 print-stack">
            {/* Left Column: Image (Safe Check Added) */}
            <div data-aos="fade-right">
              {service.imageUrl && typeof service.imageUrl === 'string' ? (
                <img
                  src={`${service.imageUrl.replace(/\\/g, "/")}`}
                  alt={service.name}
                  className="w-full h-auto object-cover rounded-none shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 rounded-none shadow-lg">
                  No image available
                </div>
              )}
            </div>

            {/* Right Column: Title and The Key Points List */}
            <div data-aos="fade-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary font-montserrat mb-4">
                {service.name}
              </h2>

              {/* Display Main Description if available */}
              {service.description && (
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>
              )}

              {/* ✅ MODIFIED: DISPLAY LIST SAFELY */}
              {detailsList.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-primary font-montserrat mb-4">
                    Key Features & Details
                  </h3>
                  <ul className="space-y-4">
                    {detailsList.map((item, index) => (
                      <li key={index} className="flex items-start">
                        {/* Green Check Icon */}
                        <CheckCircle
                          className="w-6 h-6 text-secondary mt-1 mr-3 flex-shrink-0"
                        />
                        {/* The Text Item */}
                        <span className="text-gray-700 text-lg leading-relaxed">
                          {item}
                          {/* Add a period at the end for neatness if missing */}
                          {item.endsWith(".") ? "" : "."}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="quote-form-section" className="bg-gray-50 py-20 lg:py-28 print-hide">
        <div className="container mx-auto px-4 max-w-4xl">
          <QuoteForm serviceName={service.name} />
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;