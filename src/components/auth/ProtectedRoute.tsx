import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasPaid, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admins always have access
  if (!hasPaid && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Acesso Bloqueado</h1>
          <p className="text-muted-foreground">
            Seu acesso ainda não foi liberado. Para utilizar o Diagnóstico 360°, é necessário adquirir o produto.
          </p>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
            onClick={() => window.open('https://chk.eduzz.com/60EE8Z5K03', '_blank')}
          >
            Adquirir Diagnóstico 360°
          </Button>
          <button
            onClick={async () => {
              const { supabase } = await import('@/integrations/supabase/client');
              await supabase.auth.signOut();
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
