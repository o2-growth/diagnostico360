import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ACTIVE_CLIENT_STORAGE_KEY } from '@/constants/client';
import type { Client } from '@/types/client';

interface ClientFormInput {
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export const useClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClientId, setActiveClientIdState] = useState<string | null>(() => localStorage.getItem(ACTIVE_CLIENT_STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('clients' as any)
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setClients(data as unknown as Client[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (!activeClientId) return;
    if (clients.length > 0 && !clients.some((client) => client.id === activeClientId)) {
      localStorage.removeItem(ACTIVE_CLIENT_STORAGE_KEY);
      setActiveClientIdState(null);
    }
  }, [activeClientId, clients]);

  const activeClient = useMemo(
    () => clients.find((client) => client.id === activeClientId) ?? null,
    [clients, activeClientId]
  );

  const setActiveClientId = useCallback((clientId: string | null) => {
    if (clientId) {
      localStorage.setItem(ACTIVE_CLIENT_STORAGE_KEY, clientId);
    } else {
      localStorage.removeItem(ACTIVE_CLIENT_STORAGE_KEY);
    }
    setActiveClientIdState(clientId);
  }, []);

  const createClient = useCallback(async (input: ClientFormInput) => {
    if (!user) return { data: null, error: new Error('Usuário não autenticado') };

    const { data, error } = await supabase
      .from('clients' as any)
      .insert({
        owner_id: user.id,
        name: input.name.trim(),
        company_name: input.company_name?.trim() || null,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        notes: input.notes?.trim() || null,
      })
      .select('*')
      .single();

    if (!error && data) {
      const newClient = data as unknown as Client;
      setClients((prev) => [newClient, ...prev]);
      setActiveClientId(newClient.id);
      return { data: newClient, error: null };
    }

    return { data: null, error };
  }, [setActiveClientId, user]);

  return {
    clients,
    activeClient,
    activeClientId,
    loading,
    fetchClients,
    createClient,
    setActiveClientId,
  };
};
