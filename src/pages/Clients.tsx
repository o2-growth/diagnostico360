import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart3, Building2, FileText, Plus, Search, TrendingUp } from 'lucide-react';
import SidePanel from '@/components/SidePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { hydrateLatestClientSnapshot } from '@/utils/clientAssessmentState';
import type { Client } from '@/types/client';

interface ClientSnapshotSummary {
  id: string;
  client_id: string | null;
  completed_at: string;
  overall_score: number;
}

interface ClientStats {
  count: number;
  latestScore: number | null;
  latestDate: string | null;
}

const emptyStats: ClientStats = { count: 0, latestScore: null, latestDate: null };

const Clients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clients, activeClientId, loading, setActiveClientId } = useClients();
  const [menuOpen, setMenuOpen] = useState(() => window.innerWidth >= 768);
  const [search, setSearch] = useState('');
  const [snapshots, setSnapshots] = useState<ClientSnapshotSummary[]>([]);
  const [snapshotsLoading, setSnapshotsLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshots = async () => {
      if (!user) {
        setSnapshots([]);
        setSnapshotsLoading(false);
        return;
      }

      setSnapshotsLoading(true);
      const { data, error } = await supabase
        .from('assessment_snapshots')
        .select('id, client_id, completed_at, overall_score')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (!error && data) {
        setSnapshots(data as unknown as ClientSnapshotSummary[]);
      }
      setSnapshotsLoading(false);
    };

    fetchSnapshots();
  }, [user]);

  const statsByClient = useMemo(() => {
    return snapshots.reduce<Record<string, ClientStats>>((acc, snapshot) => {
      if (!snapshot.client_id) return acc;
      const current = acc[snapshot.client_id] ?? { ...emptyStats };
      current.count += 1;
      if (!current.latestDate || new Date(snapshot.completed_at) > new Date(current.latestDate)) {
        current.latestDate = snapshot.completed_at;
        current.latestScore = snapshot.overall_score;
      }
      acc[snapshot.client_id] = current;
      return acc;
    }, {});
  }, [snapshots]);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((client) =>
      [client.name, client.company_name, client.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [clients, search]);

  const handleSelectClient = async (client: Client, destination: 'dashboard' | 'history' | 'assessment') => {
    setActiveClientId(client.id);
    if (destination === 'assessment') {
      navigate('/assessment');
      return;
    }
    if (user) {
      await hydrateLatestClientSnapshot(user.id, client.id);
    }
    navigate('/dashboard', { state: { activeTab: destination === 'history' ? 'evolution' : 'dashboard' } });
  };

  const renderClient = (client: Client) => {
    const stats = statsByClient[client.id] ?? emptyStats;
    const isSelected = client.id === activeClientId;

    return (
      <article
        key={client.id}
        className={`dashboard-card transition-all duration-200 ${isSelected ? 'border-dashboard-accent3/60 shadow-lg shadow-green-500/10' : ''}`}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-dashboard-accent3/15 border border-dashboard-accent3/20 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-dashboard-accent3" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-dashboard-light truncate">{client.name}</h2>
                {client.company_name && <p className="text-sm text-dashboard-muted truncate">{client.company_name}</p>}
                {client.email && <p className="text-xs text-dashboard-muted truncate mt-1">{client.email}</p>}
              </div>
            </div>
            {isSelected && (
              <span className="rounded-full border border-dashboard-accent3/30 bg-dashboard-accent3/10 px-3 py-1 text-xs font-semibold text-dashboard-accent3">
                Selecionado
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-dashboard-muted">Diagnósticos</p>
              <p className="text-2xl font-semibold text-dashboard-light mt-1">{stats.count}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-dashboard-muted">Último score</p>
              <p className="text-2xl font-semibold text-dashboard-accent3 mt-1">{stats.latestScore !== null ? `${stats.latestScore}%` : '—'}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs text-dashboard-muted">Último período</p>
              <p className="text-sm font-medium text-dashboard-light mt-2">
                {stats.latestDate ? format(new Date(stats.latestDate), 'dd/MM/yy', { locale: ptBR }) : '—'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => handleSelectClient(client, 'dashboard')} className="flex-1 gap-2 bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90">
              <BarChart3 className="h-4 w-4" />
              Ver resultado
            </Button>
            <Button onClick={() => handleSelectClient(client, 'history')} variant="outline" className="flex-1 gap-2" disabled={stats.count === 0}>
              <TrendingUp className="h-4 w-4" />
              Histórico
            </Button>
            <Button onClick={() => handleSelectClient(client, 'assessment')} variant="ghost" className="flex-1 gap-2">
              <FileText className="h-4 w-4" />
              Novo diagnóstico
            </Button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-dashboard-dark">
      <SidePanel onTabChange={() => undefined} onMenuToggle={setMenuOpen} />
      <main className={`transition-all duration-300 ${menuOpen ? 'md:pl-64' : 'md:pl-16'} pl-0`}>
        <div className="p-4 md:p-8">
          <header className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-dashboard-accent3 mb-2">Carteira de clientes</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-dashboard-light">Clientes</h1>
              <p className="text-dashboard-muted mt-2 max-w-2xl">
                Selecione um cliente para rever resultados, acessar o histórico mensal ou iniciar um novo diagnóstico vinculado.
              </p>
            </div>
            <Button onClick={() => navigate('/')} className="gap-2 bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90">
              <Plus className="h-4 w-4" />
              Cadastrar cliente
            </Button>
          </header>

          <div className="relative mb-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dashboard-muted" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por cliente, empresa ou e-mail..." className="pl-9" />
          </div>

          {loading || snapshotsLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredClients.map(renderClient)}
            </div>
          ) : (
            <div className="dashboard-card min-h-[280px] flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-dashboard-accent3/15 border border-dashboard-accent3/20 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-dashboard-accent3" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dashboard-light">Nenhum cliente encontrado</h2>
                <p className="text-dashboard-muted mt-1">Cadastre ou ajuste a busca para selecionar um cliente.</p>
              </div>
              <Button onClick={() => navigate('/')} className="gap-2 bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90">
                <Plus className="h-4 w-4" />
                Cadastrar cliente
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Clients;