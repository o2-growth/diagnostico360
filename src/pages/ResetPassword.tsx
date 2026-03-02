import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let resolved = false;

    const markRecovery = () => {
      if (!resolved) {
        resolved = true;
        setIsRecovery(true);
        setChecking(false);
      }
    };

    // Set up auth listener FIRST to catch PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        markRecovery();
      } else if (event === 'SIGNED_IN' && session) {
        // Recovery tokens trigger SIGNED_IN after processing
        markRecovery();
      }
    });

    const checkRecovery = async () => {
      // Check URL hash and query params
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      if (hash.includes('type=recovery') || hash.includes('access_token') || params.get('type') === 'recovery') {
        markRecovery();
        return;
      }

      // Check if session already exists (token was already processed by Supabase)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        markRecovery();
        return;
      }

      // Wait a bit more for the token to be processed by Supabase
      await new Promise(r => setTimeout(r, 2000));
      
      if (!resolved) {
        // Final check
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          markRecovery();
        } else {
          setChecking(false);
        }
      }
    };

    checkRecovery();

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Erro', description: 'A senha deve ter no mínimo 6 caracteres.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: 'Senha atualizada com sucesso!' });
      navigate('/home', { replace: true });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard-dark px-4">
        <p className="text-dashboard-muted">Verificando link de recuperação...</p>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard-dark px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Link inválido</h1>
          <p className="text-dashboard-muted">Este link de recuperação é inválido ou expirou.</p>
          <Button onClick={() => navigate('/auth')} variant="outline" className="border-white/10">
            Voltar ao login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboard-dark px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-dashboard-accent3 to-green-400 text-transparent bg-clip-text">
            Nova Senha
          </h1>
          <p className="mt-2 text-dashboard-muted">Digite sua nova senha abaixo</p>
        </div>

        <div className="dashboard-card space-y-6">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90 transition-all duration-300 text-white"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
