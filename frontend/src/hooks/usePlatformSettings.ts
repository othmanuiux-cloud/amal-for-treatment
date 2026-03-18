import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function usePlatformSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'أمل للعلاج',
    site_description: '',
    support_email: '',
    whatsapp_number: '',
    primary_color: '#0f172a',
    site_logo: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/settings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data?.data) {
        const settingsObj: Record<string, string> = {};
        response.data.data.forEach((item: any) => {
          settingsObj[item.key] = item.value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { settings, isLoading, reload: loadSettings };
}
