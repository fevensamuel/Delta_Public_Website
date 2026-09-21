import { useEffect, useState } from 'react';
import { getContactSettingsApi } from '../api/client';

interface ContactSettings {
  whatsappNumber: string;
  phoneNumber: string;
  smsNumber: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  whatsappNumber: '+251910136747',
  phoneNumber: '+251910136747',
  smsNumber: '+251910136747',
};

let cachedSettings: ContactSettings | null = null;

export function useContactSettings(): ContactSettings {
  const [settings, setSettings] = useState<ContactSettings>(
    cachedSettings || DEFAULT_SETTINGS
  );

  useEffect(() => {
    let mounted = true;
    getContactSettingsApi()
      .then((data) => {
        if (!mounted) return;
        const merged: ContactSettings = {
          whatsappNumber: data?.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
          phoneNumber: data?.phoneNumber || DEFAULT_SETTINGS.phoneNumber,
          smsNumber: data?.smsNumber || DEFAULT_SETTINGS.smsNumber,
        };
        cachedSettings = merged;
        setSettings(merged);
      })
      .catch(() => {
        // keep defaults
      });
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}