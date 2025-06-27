'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { CustomGPT } from '@/lib/db/schema';

type GptContextType = {
  gpts: CustomGPT[];
  loading: boolean;
  error: string | null;
  refreshGpts: () => void;
};

const GptContext = createContext<GptContextType | undefined>(undefined);

export function GptProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [gpts, setGpts] = useState<CustomGPT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGpts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gpts');
      if (!res.ok) throw new Error('Failed to load GPTs');
      const data = await res.json();
      setGpts(data.gpts || []);
    } catch (err) {
      setError('Error fetching GPTs');
      toast.error('Failed to load GPT agents');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGpts();
  }, [fetchGpts]);

  return (
    <GptContext.Provider
      value={{ gpts, loading, error, refreshGpts: fetchGpts }}
    >
      {children}
    </GptContext.Provider>
  );
}

export function useGptContext() {
  const context = useContext(GptContext);
  if (!context) {
    throw new Error('useGptContext must be used within a GptProvider');
  }
  return context;
}
