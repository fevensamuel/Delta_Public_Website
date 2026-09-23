// src/components/FlightBookingModal.tsx

import React, { useState } from 'react';
import { X, Plane, Calendar, Users, Send, Clock, MapPin } from 'lucide-react';
import { AIRLINE_PARTNERS } from '../data/airlines';
import { useContactSettings } from '../hooks/useContactSettings';

interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FlightBookingForm {
  airline: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  cabinClass: string;
  destination: string;
  from: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export const FlightBookingModal: React.FC<FlightBookingModalProps> = ({ isOpen, onClose }) => {
  const { whatsappNumber } = useContactSettings();

  const [formData, setFormData] = useState<FlightBookingForm>({
    airline: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'Economy',
    destination: '',
    from: 'Addis Ababa (ADD)',
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAirline = AIRLINE_PARTNERS.find(a => a.id === formData.airline);

    // Format a yyyy-mm-dd value as e.g. "17 Sep 2026" (falls back to raw value)
    const prettyDate = (value: string) => {
      if (!value) return '';
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const tripType = formData.returnDate ? 'Return trip' : 'One way';
    const passengerWord = Number(formData.passengers) === 1 ? 'passenger' : 'passengers';

    // Only include lines the user actually filled in, so the message
    // never shows empty values like "N/A".
    const lines: string[] = [
      'Hello Delta Travel & Tour,',
      '',
      "I'd like a quote for the following flight:",
      '',
      `Route: ${formData.from} to ${formData.destination}`,
      `Departing: ${prettyDate(formData.departureDate)}`,
    ];

    if (formData.returnDate) {
      lines.push(`Returning: ${prettyDate(formData.returnDate)}`);
    }

    lines.push(`Trip type: ${tripType}`);
    lines.push(`Travellers: ${formData.passengers} ${passengerWord}`);
    lines.push(`Cabin class: ${formData.cabinClass}`);

    if (selectedAirline) {
      lines.push(`Preferred airline: ${selectedAirline.name}`);
    }

    lines.push('');
    lines.push(`My name is ${formData.fullName} and you can reach me on ${formData.phone}.`);

    if (formData.email) {
      lines.push(`Email: ${formData.email}`);
    }

    if (formData.notes) {
      lines.push('');
      lines.push(`A few extra details: ${formData.notes}`);
    }

    lines.push('');
    lines.push('Could you send me the available options and pricing? Thank you.');

    const message = lines.join('\n');

    // ✅ Dynamic WhatsApp number from admin settings
    const cleanWhatsApp = (whatsappNumber || '251910136747').replace(/[^0-9]/g, '');

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/[0.08] px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F1EBE0] border border-[#A6853A]/50 text-[#A6853A] flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-[#1A1712]">Request a Flight Quote</h2>
              <p className="text-[12px] text-[#6B655A]">We'll reply on WhatsApp with options and pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F1EBE0] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B655A]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Airline Selection */}
          <div>
            <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
              Select Airline <span className="text-[#7A0C1F]">*</span>
            </label>
            <select
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
            >
              <option value="">Choose an airline...</option>
              {AIRLINE_PARTNERS.map((airline) => (
                <option key={airline.id} value={airline.id}>
                  {airline.flag} {airline.name} ({airline.code})
                </option>
              ))}
            </select>
          </div>

          {/* Route Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                From <span className="text-[#7A0C1F]">*</span>
              </label>
              <select
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              >
                <option value="Addis Ababa (ADD)">Addis Ababa (ADD)</option>
                <option value="Other City">Other City</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                Destination <span className="text-[#7A0C1F]">*</span>
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              >
                <option value="">Select destination...</option>
                <option value="Jeddah (JED)">Jeddah (JED)</option>
                <option value="Madinah (MED)">Madinah (MED)</option>
                <option value="Dubai (DXB)">Dubai (DXB)</option>
                <option value="Istanbul (IST)">Istanbul (IST)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                Departure Date <span className="text-[#7A0C1F]">*</span>
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                Return Date (Optional)
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                min={formData.departureDate}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              />
            </div>
          </div>

          {/* Passengers & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                Number of Passengers <span className="text-[#7A0C1F]">*</span>
              </label>
              <input
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                min="1"
                max="50"
                required
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                Cabin Class <span className="text-[#7A0C1F]">*</span>
              </label>
              <select
                name="cabinClass"
                value={formData.cabinClass}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              >
                <option value="Economy">Economy Class</option>
                <option value="Business">Business Class</option>
                <option value="First">First Class</option>
              </select>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#1A1712] pt-2 border-t border-black/[0.06]">Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                  Full Name <span className="text-[#7A0C1F]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                  Phone Number <span className="text-[#7A0C1F]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+251 9XX XXX XXX"
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12px] tracking-wide text-[#4A463F] mb-1.5">
              Special Requests / Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special requirements, preferred flight times, etc."
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-black/10 text-sm text-[#1A1712] focus:outline-none focus:border-[#7A0C1F] transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#7A0C1F] hover:bg-[#580815] text-white text-xs tracking-wide py-4 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Inquiry via WhatsApp</span>
          </button>

          <p className="text-center text-[11px] text-[#9A9488]">
            Your inquiry will be sent directly to Delta Travel & Tour team
          </p>
        </form>
      </div>
    </div>
  );
};