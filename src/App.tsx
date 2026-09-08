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
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';

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
      <div className="flex flex-col items-center gap-6">
        {/* Logo with spinning animation */}
        <div className="relative">
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#C8102E] border-t-transparent animate-spin" />
          
          {/* Logo image */}
          <img 
            src="/logo/logo.jpg" 
            alt="Delta Travel & Tour" 
            className="w-20 h-20 rounded-full object-cover relative z-10 p-1 bg-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23C8102E" rx="40"/%3E%3Ctext x="40" y="48" text-anchor="middle" dy=".3em" fill="white" font-size="28" font-family="sans-serif" font-weight="bold"%3EΔ%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-slate-700">Loading...</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#C8102E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#C8102E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#C8102E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
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


        {activePage === 'gallery' && (
          <Gallery lang={lang} />
        )}

        {activePage === 'contact' && (
          <Contact onTriggerSmsToast={triggerSmsToast} lang={lang} />
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