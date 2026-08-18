import React, { useEffect, useState } from 'react';
import { getFaqsApi } from '../api/faqs';
import { FAQItem, Language } from '../types';
import { translations } from '../translations';
import { Plus, Minus, Loader2, HelpCircle } from 'lucide-react';

interface FAQsProps {
  lang: Language;
}

export const FAQs: React.FC<FAQsProps> = ({ lang }) => {
  const t = translations[lang] || translations.EN;
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFaqsApi();
      setFaqs(data);
    } catch (error) {
      setError('Failed to load FAQs. Please refresh the page.');
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
        <p className="text-xs font-semibold">Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error}</p>
        <button onClick={loadFaqs} className="mt-4 text-[#C8102E] underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 bg-[#F9F9F9] text-slate-800">
      
      {/* Header Banner */}
      <section className="bg-[#0b0f19] text-white py-12 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            {t.faqs || 'Frequently Asked Questions'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            {t.faqsTitle || 'Common Questions About Umrah'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {t.faqsSubtitle || 'Find answers to the most frequently asked questions about our Umrah packages, services, and travel requirements.'}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
            <span>{faqs.length} Questions</span>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8">
        {faqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <HelpCircle className="w-12 h-12 mx-auto text-[#E2E8F0]" />
            <p className="text-slate-500 font-semibold">No FAQs available yet</p>
            <p className="text-xs text-slate-400">Check back later for frequently asked questions about our Umrah services.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;

              return (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-[#C8102E] font-bold text-sm">Q{index + 1}.</span>
                      <h3 className="font-semibold text-slate-900 text-sm">{faq.question}</h3>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {isExpanded ? (
                        <Minus className="w-5 h-5 text-[#C8102E]" />
                      ) : (
                        <Plus className="w-5 h-5 text-[#C8102E]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 pt-1 border-t border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <span className="font-bold text-[#C8102E]">A:</span> {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Still Have Questions CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0b0f19] text-white rounded-2xl p-6 sm:p-8 text-center border border-slate-800 shadow-lg">
          <h3 className="text-lg font-bold mb-2">{t.stillHaveQuestions || 'Still Have Questions?'}</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto mb-4">
            {t.contactUsForFaqs || 'Our Umrah experts are ready to help. Contact us directly for personalized assistance.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/251910136747?text=Assalamu%20Alaikum%20Delta%20Travel!%20I%20have%20a%20question%20about%20Umrah."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <span>📱</span> {t.chatWhatsapp || 'Chat on WhatsApp'}
            </a>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-[#C8102E]/20"
            >
              {t.contact || 'Contact Us'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};