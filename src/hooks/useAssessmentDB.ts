import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { STORAGE_KEYS } from '@/constants/storage';
import { ACTIVE_CLIENT_STORAGE_KEY } from '@/constants/client';

export const useAssessmentDB = (options: { hydrateLatestSnapshot?: boolean } = {}) => {
  const { hydrateLatestSnapshot = true } = options;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Load assessment from DB on mount
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const activeClientId = localStorage.getItem(ACTIVE_CLIENT_STORAGE_KEY);
    if (!activeClientId) {
      localStorage.removeItem(STORAGE_KEYS.ANSWERS);
      localStorage.removeItem(STORAGE_KEYS.GATES);
      localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
      setLoading(false);
      return;
    }

    const loadFromDB = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.id)
          .eq('client_id', activeClientId)
          .eq('status', 'in_progress')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error loading assessment from DB:', error);
          return;
        }

        if (data) {
          setAssessmentId(data.id);
          // Sync DB -> localStorage
          if (data.answers && Object.keys(data.answers as object).length > 0) {
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(data.answers));
          }
          if (data.gates && Object.keys(data.gates as object).length > 0) {
            localStorage.setItem(STORAGE_KEYS.GATES, JSON.stringify(data.gates));
          }
          if (data.recommendations && Object.keys(data.recommendations as object).length > 0) {
            localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(data.recommendations));
          }
          return;
        }

        if (hydrateLatestSnapshot) {
          const { data: snapshot, error: snapshotError } = await (supabase as any)
            .from('assessment_snapshots')
            .select('answers,gates')
            .eq('user_id', user.id)
            .eq('client_id', activeClientId)
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!snapshotError && snapshot) {
            if (snapshot.answers && Object.keys(snapshot.answers as object).length > 0) {
              localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(snapshot.answers));
            } else {
              localStorage.removeItem(STORAGE_KEYS.ANSWERS);
            }
            if (snapshot.gates && Object.keys(snapshot.gates as object).length > 0) {
              localStorage.setItem(STORAGE_KEYS.GATES, JSON.stringify(snapshot.gates));
            } else {
              localStorage.removeItem(STORAGE_KEYS.GATES);
            }
          }
        }
      } catch (err) {
        console.error('Error loading assessment from DB:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFromDB();
  }, [user, hydrateLatestSnapshot]);

  const ensureAssessment = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    const activeClientId = localStorage.getItem(ACTIVE_CLIENT_STORAGE_KEY);
    if (!activeClientId) return null;
    if (assessmentId) return assessmentId;

    try {
      const { data, error } = await (supabase as any)
        .from('user_assessments')
        .insert({ user_id: user.id, client_id: activeClientId } as any)
        .select('id')
        .single();

      if (error) {
        console.error('Error creating assessment:', error);
        return null;
      }

      if (data) {
        setAssessmentId(data.id);
        return data.id;
      }
    } catch (err) {
      console.error('Error creating assessment:', err);
    }
    return null;
  }, [user, assessmentId]);

  const syncToDB = useCallback(async () => {
    if (!user) return;
    const id = await ensureAssessment();
    if (!id) return;

    try {
      const answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
      const gates = JSON.parse(localStorage.getItem(STORAGE_KEYS.GATES) || '{}');
      const recommendations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS) || '{}');

      const { error } = await (supabase as any)
        .from('user_assessments')
        .update({
          answers,
          gates,
          recommendations,
        } as any)
        .eq('id', id);

      if (error) {
        console.error('Error syncing to DB:', error);
      }
    } catch (err) {
      console.error('Error syncing to DB:', err);
    }
  }, [user, ensureAssessment]);

  const completeAssessment = useCallback(async () => {
    if (!user) return;
    const id = await ensureAssessment();
    if (!id) return;

    try {
      const answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
      const gates = JSON.parse(localStorage.getItem(STORAGE_KEYS.GATES) || '{}');
      const recommendations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS) || '{}');

      const { error } = await (supabase as any)
        .from('user_assessments')
        .update({
          answers,
          gates,
          recommendations,
          status: 'completed',
          completed_at: new Date().toISOString(),
        } as any)
        .eq('id', id);

      if (error) {
        console.error('Error completing assessment:', error);
        return;
      }

      setAssessmentId(null);
    } catch (err) {
      console.error('Error completing assessment:', err);
    }
  }, [user, ensureAssessment]);

  return {
    loading,
    assessmentId,
    syncToDB,
    completeAssessment,
  };
};
