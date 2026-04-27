import { ACTIVE_CLIENT_STORAGE_KEY } from '@/constants/client';
import { STORAGE_KEYS } from '@/constants/storage';
import { supabase } from '@/integrations/supabase/client';

export const clearAssessmentState = () => {
  localStorage.removeItem(STORAGE_KEYS.ANSWERS);
  localStorage.removeItem(STORAGE_KEYS.GATES);
  localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
};

export const hydrateLatestClientSnapshot = async (userId: string, clientId?: string | null) => {
  const targetClientId = clientId ?? localStorage.getItem(ACTIVE_CLIENT_STORAGE_KEY);
  if (!targetClientId) {
    clearAssessmentState();
    return;
  }

  const { data, error } = await (supabase as any)
    .from('assessment_snapshots')
    .select('answers,gates')
    .eq('user_id', userId)
    .eq('client_id', targetClientId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    clearAssessmentState();
    return;
  }

  if (data.answers && Object.keys(data.answers as object).length > 0) {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(data.answers));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
  }

  if (data.gates && Object.keys(data.gates as object).length > 0) {
    localStorage.setItem(STORAGE_KEYS.GATES, JSON.stringify(data.gates));
  } else {
    localStorage.removeItem(STORAGE_KEYS.GATES);
  }

  localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
};

export const clearInProgressAssessment = async (userId: string, clientId: string) => {
  await (supabase as any)
    .from('user_assessments')
    .delete()
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .eq('status', 'in_progress');
};