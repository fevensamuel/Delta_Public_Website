import React, { useState } from 'react';
import { MessageSquare, Phone, Send, X, ShieldCheck, CheckCircle2, Mail } from 'lucide-react';
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
    className="bg-[#C8102E] hover:bg-[#a60d25] text-white py-2.5 px-3 rounded-l-xl shadow-lg flex flex-col items-center justify-center min-w-[70px] h-[60px] transition-transform hover:-translate-x-1 border-y border-l border-red-700"
    title="WhatsApp Chat"
  >
    {/* WhatsApp SVG Icon - Clean version */}
    <svg 
      className="w-5 h-5 mb-0.5 fill-white" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </button>

  {/* Call Us Button */}
  <a
    href="tel:+966501234567"
    className="bg-[#C8102E] hover:bg-[#a60d25] text-white py-2.5 px-3 rounded-l-xl shadow-lg flex flex-col items-center justify-center min-w-[70px] h-[60px] transition-transform hover:-translate-x-1 border-y border-l border-red-700"
    title="Call Us"
  >
    <Phone className="w-5 h-5 mb-0.5" />
  </a>

  {/* Send SMS Button */}
<a
    href="sms:+966501234567"
    className="bg-[#C8102E] hover:bg-[#a60d25] text-white py-2.5 px-3 rounded-l-xl shadow-lg flex flex-col items-center justify-center min-w-[70px] h-[60px] transition-transform hover:-translate-x-1 border-y border-l border-red-700"
    title="Send SMS"
  >
    <MessageSquare className="w-5 h-5 mb-0.5" />
  </a>
</div>
    </div>
  );
};

