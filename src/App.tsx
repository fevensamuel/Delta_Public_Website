import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Currency,
  PageId, 
  PackageItem, 
  SmsSubscriber 
} from './types';
import { fetchPackages } from './api/client';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SmsToastNotifier } from './components/SmsToastNotifier';
import { PackageDetailModal } from './components/PackageDetailModal';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Packages } from './pages/Packages';
import { HotelsFlights } from './pages/HotelsFlights';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
<<<<<<< HEAD
import { FAQs } from './pages/FAQs';
import { Office } from './pages/Office';
=======
import { FAQs } from './pages/FAQs'; // Add this import
>>>>>>> 92dfad2bcb1bc4a01ca92195b7057a11bf89c73d

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [lang, setLang] = useState<Language>('EN');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Application Data States
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [subscribers, setSubscribers] = useState<SmsSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Toast States
  const [selectedPkgModal, setSelectedPkgModal] = useState<PackageItem | null>(null);
  const [smsToast, setSmsToast] = useState<{ id: string; phone: string; message: string } | null>(null);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Load packages from backend on mount
  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await fetchPackages();
      setPackages(data);
    } catch (error) {
      console.error('Failed to load packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Triggering SMS Notification Toast
  const triggerSmsToast = (phone: string, message: string) => {
    const toastObj = {
      id: `toast-${Date.now()}`,
      phone,
      message
    };
    setSmsToast(toastObj);

    setTimeout(() => {
      setSmsToast((current) => (current?.id === toastObj.id ? null : current));
    }, 6000);
  };

  // Handle SMS Lead Subscription
  const handleSubscribeSms = (phone: string) => {
    if (!subscribers.some((s) => s.phone === phone)) {
      setSubscribers((prev) => [
        {
          id: `sub-${Date.now()}`,
          phone,
          channel: 'Web Lead Banner',
          subscribedAt: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
    }

    triggerSmsToast(
      phone,
      "DELTA TRAVEL: Welcome to Delta SMS Alerts! You'll receive instant Umrah package and departure updates."
    );
  };

  const fontClass = lang === 'AR' ? 'font-arabic' : lang === 'AM' ? 'font-amharic' : 'font-sans';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#F9F9F9] text-slate-800 ${fontClass}`} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      
      {/* Global Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Page Render */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            onSelectPackage={(pkg) => setSelectedPkgModal(pkg)}
            onSubscribeSms={handleSubscribeSms}
            lang={lang}
            currency={currency}
          />
        )}

        {activePage === 'about' && (
          <About setActivePage={setActivePage} lang={lang} />
        )}

        {activePage === 'packages' && (
          <Packages
            packages={packages}
            onSelectPackage={(pkg) => setSelectedPkgModal(pkg)}
            lang={lang}
            currency={currency}
          />
        )}

        {activePage === 'hotels-flights' && (
          <HotelsFlights lang={lang} />
        )}

        {activePage === 'gallery' && (
          <Gallery lang={lang} />
        )}

        {activePage === 'contact' && (
          <Contact onTriggerSmsToast={triggerSmsToast} lang={lang} />
        )}

<<<<<<< HEAD
        {activePage === 'faqs' && (
          <FAQs lang={lang} />
        )}

        {activePage === 'office' && (
          <Office setActivePage={setActivePage} lang={lang} />
=======
        {/* Add FAQs route */}
        {activePage === 'faqs' && (
          <FAQs lang={lang} />
>>>>>>> 92dfad2bcb1bc4a01ca92195b7057a11bf89c73d
        )}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} lang={lang} />

      {/* Floating WhatsApp Chat Launcher */}
      <FloatingWhatsApp />

      {/* Real-time SMS Toast Notifier */}
      <SmsToastNotifier
        toast={smsToast}
        onClose={() => setSmsToast(null)}
      />

      {/* Package Detail Modal */}
      <PackageDetailModal
        pkg={selectedPkgModal}
        onClose={() => setSelectedPkgModal(null)}
        lang={lang}
        currency={currency}
      />

    </div>
  );
}