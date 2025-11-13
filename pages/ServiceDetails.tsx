import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Service } from "../types";
import Spinner from "../components/Spinner";
import { createBooking } from "../services/api";
import { ArrowLeft, Printer } from "lucide-react";

const API_BASE_URL = "https://trueline.onrender.com";

const ADMIN_WHATSAPP_NUMBER = "97517781187";

// Quote Form Component remains unchanged...
interface QuoteFormProps {
  serviceName: string;
}
const QuoteForm: React.FC<QuoteFormProps> = ({ serviceName }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({ name: false, phone: false, address: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const newErrors = { name: !name.trim(), phone: !phone.trim(), address: !address.trim() };
    setValidationErrors(newErrors);
    if (Object.values(newErrors).some(isError => isError)) {
      setError("Please fill in all required fields highlighted in red.");
      return;
    }
    setLoading(true);
    const submissionData = {
      name,
      phone,
      address,
      notes,
      serviceType: serviceName,
      preferredDateTime: new Date().toISOString(),
    };
    try {
      await createBooking(submissionData);
      setSuccess("Your quote request has been sent! We will contact you shortly.");
      const message = `\nNew Quote Request!\nService: ${submissionData.serviceType}\nName: ${submissionData.name}\nPhone: ${submissionData.phone}\nSurub: ${submissionData.address}\nNotes: ${submissionData.notes || "N/A"}\n      `;
      window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
      setName("");
      setPhone("");
      setAddress("");
      setNotes("");
      setValidationErrors({ name: false, phone: false, address: false });
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
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-none mb-6">{error}</div>
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
              onChange={(e) => {
                setPhone(e.target.value);
                if (validationErrors.phone) setValidationErrors((p) => ({ ...p, phone: false }));
              }}
              className={getInputClasses(validationErrors.phone)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Surub
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (validationErrors.address) setValidationErrors((p) => ({ ...p, address: false }));
            }}
            className={getInputClasses(validationErrors.address)}
          />
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

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/services/${id}`);
        if (!res.ok) throw new Error("Service could not be found.");
        const data = await res.json();
        setService(data);
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
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mt-2">{service.name}</h1>
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
            <div data-aos="fade-right">
              {service.imageUrl ? (
                <img
                  src={`backend/${service.imageUrl.replace(/\\/g, "/")}`}
                  alt={service.name}
                  className="w-full h-auto object-cover rounded-none shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 rounded-none shadow-lg">
                  No image available
                </div>
              )}
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary font-montserrat mb-4">{service.name}</h2>

              {/* ✅ Added service description */}
              {service.description && (
                <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                  {service.description}
                </p>
              )}  
            
              <div
                className="prose max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.details }}
              />
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
