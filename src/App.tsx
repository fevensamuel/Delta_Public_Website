import React, { useState, useEffect } from 'react';
import { 
  Currency,
  PageId, 
  PackageItem, 
  SmsSubscriber 
} from './types';
import { fetchPackages } from './api/client';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

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

function MainLayout() {
  const { language, setLanguage, isRtl, dir, currentOption } = useLanguage();
  const [activePage, setActivePage] = useState<PageId>('home');
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

  const fontClass = currentOption.fontClass;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]" dir={dir} lang={language}>
        <div className="flex flex-col items-center gap-4">
          {/* Logo with pulse animation */}
          <div className="relative animate-pulse">
            <div className="absolute -inset-4 rounded-full bg-[#C8102E]/10 animate-ping" />
            <img 
              src="/logo/logo.jpg" 
              alt="Delta Travel & Tour" 
              className="w-20 h-20 rounded-full object-cover relative z-10 border-2 border-[#C8102E] p-1 bg-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23C8102E" rx="40"/%3E%3Ctext x="40" y="48" text-anchor="middle" dy=".3em" fill="white" font-size="28" font-family="sans-serif" font-weight="bold"%3EΔ%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-slate-700">Loading...</p>
            <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#C8102E] rounded-full animate-loading-bar" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#F9F9F9] text-slate-800 ${fontClass} transition-colors duration-200`} 
      dir={dir}
      lang={language}
    >
      
      {/* Global Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        lang={language}
        setLang={setLanguage}
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
            lang={language}
            currency={currency}
          />
        )}

        {activePage === 'about' && (
          <About setActivePage={setActivePage} lang={language} />
        )}

        {activePage === 'packages' && (
          <Packages
            packages={packages}
            onSelectPackage={(pkg) => setSelectedPkgModal(pkg)}
            lang={language}
            currency={currency}
          />
        )}

        {activePage === 'gallery' && (
          <Gallery lang={language} />
        )}

        {activePage === 'contact' && (
          <Contact 
            setActivePage={setActivePage} 
            currency={currency} 
            onTriggerSmsToast={triggerSmsToast} 
            lang={language} 
          />
        )}

      </main>

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} lang={language} />

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
        lang={language}
        currency={currency}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
}