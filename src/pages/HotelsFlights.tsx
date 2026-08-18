import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { AIRLINE_PARTNERS } from '../data/airlines';
import { 
  Plane, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Utensils, 
  Clock,
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import { trackAndOpenWhatsApp } from '../api/client';

interface HotelsFlightsProps {
  lang: Language;
}

export const HotelsFlights: React.FC<HotelsFlightsProps> = ({ lang }) => {
  const t = translations[lang] || translations.EN;

  return (
    <div className="space-y-12 pb-16 bg-[#F9F9F9] text-slate-800">
      
      {/* Banner */}
      <section className="bg-[#0b0f19] text-white py-12 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            Trusted Flight Partners
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            Official Airline Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            We partner exclusively with two world-class flag carriers to ensure your Umrah journey from Addis Ababa is comfortable, direct, and seamless.
          </p>
        </div>
      </section>

      {/* AIRLINES SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">Direct Routes to Holy Cities</span>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Plane className="w-6 h-6 text-[#C8102E]" />
              <span>Ethiopian Airlines & Saudia</span>
            </h2>
          </div>
        </div>

        {/* 2 Airline Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {AIRLINE_PARTNERS.map((airline) => (
            <div 
              key={airline.id}
              className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-700/80 flex flex-col justify-between space-y-6 group"
            >
              {/* Background Aircraft Photo with Dark Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${airline.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950/85" />

              {/* Card Content Overlay */}
              <div className="relative z-10 space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl">{airline.flag}</span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">{airline.name}</h3>
                        <p className="text-xs text-slate-300 font-semibold">IATA Code: {airline.code}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-900/80 text-red-300 text-[11px] font-extrabold uppercase rounded-full border border-red-700/60 shadow-sm backdrop-blur-md">
                      {airline.badge}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/70 space-y-2.5 text-xs text-slate-200">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">Hub & Gateways:</span> {airline.hub}
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">{airline.destinations}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <Clock className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span><strong className="text-white">Flight Frequency:</strong> {airline.frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                      <Plane className="w-3.5 h-3.5 text-red-400" /> Fleet
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{airline.aircraft}</p>
                  </div>

                  <div className="p-3.5 bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-red-400" /> Baggage
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{airline.baggageAllowance}</p>
                  </div>

                  <div className="p-3.5 bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                      <Utensils className="w-3.5 h-3.5 text-red-400" /> In-Flight
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{airline.catering}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Direct Assistance CTA - Contact via WhatsApp/Phone only */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 text-center md:text-left rtl:md:text-right">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-red-400" /> Dedicated Flight Support
            </span>
            <h3 className="text-xl font-extrabold text-white">Need Custom Flight Bookings or Group Seats?</h3>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => trackAndOpenWhatsApp(undefined, 'Flight Booking Inquiry')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </button>
            <a
              href="tel:+251911234567"
              className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +251 91 123 4567</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};