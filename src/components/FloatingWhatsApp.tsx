import React, { useState } from 'react';
import { MessageSquare, Phone, Send, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const phone = '966501234567';

  const handleSend = (text?: string) => {
    const finalMsg = encodeURIComponent(text || userMsg || 'Assalamu Alaikum, I would like to inquire about Delta Travel Umrah packages.');
    window.open(`https://wa.me/${phone}?text=${finalMsg}`, '_blank');
    setUserMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-2 pr-0.5">
      {/* Popover Chat Box if WhatsApp clicked */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="mr-3 mb-2 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800"
          >
            {/* Header */}
            <div className="bg-[#C8102E] text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
                    DT
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Delta Travel Support</h4>
                  <p className="text-[11px] text-red-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-white" /> Online 24/7
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-red-100 hover:text-white transition-colors p-1 rounded-lg hover:bg-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-slate-50 space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                <p className="font-medium text-slate-800">
                  Assalamu Alaikum! 🕋 How can Delta Travel & Tour assist your sacred journey today?
                </p>
              </div>

              {/* Quick Inquiry Options */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => handleSend("Inquiry: Standard Umrah Package Details ($1,250)")}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-red-50 text-slate-800 border border-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>🕋 Umrah Package Quotes</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                </button>
                <button
                  onClick={() => handleSend("Inquiry: Umrah E-Visa Processing Time & Documents")}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-red-50 text-slate-800 border border-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>📋 Umrah Visa Guidance</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                </button>
              </div>

              {/* Custom Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  onClick={() => handleSend()}
                  className="bg-[#C8102E] hover:bg-red-700 text-white p-2 rounded-xl transition-colors shadow"
                  title="Send via WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons Stack on Right Edge */}
      <div className="flex flex-col items-end space-y-1.5 font-sans text-xs">
        {/* WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#C8102E] hover:bg-[#a60d25] text-white py-2.5 px-3 rounded-l-xl shadow-lg flex flex-col items-center justify-center min-w-[70px] transition-transform hover:-translate-x-1 border-y border-l border-red-700"
          title="WhatsApp Chat"
        >
          <MessageSquare className="w-5 h-5 mb-0.5 fill-white/20" />
          <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
        </button>

        {/* Call Us Button */}
        <a
          href="tel:+966501234567"
          className="bg-[#C8102E] hover:bg-[#a60d25] text-white py-2.5 px-3 rounded-l-xl shadow-lg flex flex-col items-center justify-center min-w-[70px] transition-transform hover:-translate-x-1 border-y border-l border-red-700"
          title="Call Us"
        >
          <Phone className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Call Us</span>
        </a>

        {/* Send SMS Button */}
        <a
          href="sms:+966501234567?body=Hello%20Delta%20Travel"
          className="bg-[#C8102E] hover:bg-[#a60d25] text-white py-2.5 px-3 rounded-l-xl shadow-lg flex flex-col items-center justify-center min-w-[70px] transition-transform hover:-translate-x-1 border-y border-l border-red-700"
          title="Send SMS"
        >
          <Send className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Send SMS</span>
        </a>
      </div>
    </div>
  );
};

