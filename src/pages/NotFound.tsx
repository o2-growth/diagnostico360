import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboard-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dashboard-accent3 mb-4">404</h1>
        <p className="text-xl text-dashboard-muted mb-6">Página não encontrada</p>
        <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
      </div>
    </div>
  );
};
export default NotFound;
