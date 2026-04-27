import { useMemo, useState } from 'react';
import { Building2, Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useClients } from '@/hooks/useClients';
import type { Client } from '@/types/client';

interface ClientManagerProps {
  onStartDiagnosis: () => void;
  onContinueDiagnosis: () => void;
  hasOngoingAssessment: boolean;
}

const ClientManager = ({ onStartDiagnosis, onContinueDiagnosis, hasOngoingAssessment }: ClientManagerProps) => {
  const { clients, activeClient, activeClientId, loading, createClient, setActiveClientId } = useClients();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', company_name: '', email: '', phone: '', notes: '' });
  const { toast } = useToast();

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter((client) =>
      [client.name, client.company_name, client.email]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [clients, search]);

  const handleCreateClient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Nome obrigatório', description: 'Informe o nome do cliente.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const { error } = await createClient(form);
    setSaving(false);

    if (error) {
      toast({ title: 'Erro ao cadastrar cliente', description: error.message, variant: 'destructive' });
      return;
    }

    setForm({ name: '', company_name: '', email: '', phone: '', notes: '' });
    setOpen(false);
    toast({ title: 'Cliente cadastrado', description: 'Cliente selecionado para o próximo diagnóstico.' });
  };

  const renderClientCard = (client: Client) => {
    const selected = client.id === activeClientId;
    return (
      <button
        key={client.id}
        onClick={() => setActiveClientId(client.id)}
        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
          selected
            ? 'border-dashboard-accent3 bg-dashboard-accent3/10 shadow-lg shadow-green-500/10'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-accent3/15 border border-dashboard-accent3/20 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-dashboard-accent3" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-dashboard-light truncate">{client.name}</p>
            {client.company_name && <p className="text-sm text-dashboard-text truncate">{client.company_name}</p>}
            {client.email && <p className="text-xs text-dashboard-muted truncate mt-1">{client.email}</p>}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="dashboard-card w-full max-w-5xl mx-auto mt-10 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-dashboard-accent3 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Clientes do CFO</span>
          </div>
          <h2 className="text-2xl font-semibold text-dashboard-light">Selecione um cliente para diagnosticar</h2>
          <p className="text-dashboard-muted mt-1">
            Cada diagnóstico e histórico ficará salvo separadamente por cliente.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nome do cliente</Label>
                <Input id="client-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Acme Ltda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Razão social ou empresa</Label>
                <Input id="company-name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Opcional" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input id="client-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Telefone</Label>
                  <Input id="client-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Opcional" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-notes">Observações</Label>
                <Textarea id="client-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Contexto do cliente, segmento, porte..." />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90">
                {saving ? 'Salvando...' : 'Salvar Cliente'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dashboard-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-dashboard-muted text-sm">Carregando clientes...</p>
            ) : filteredClients.length > 0 ? (
              filteredClients.map(renderClientCard)
            ) : (
              <div className="md:col-span-2 border border-dashed border-white/10 rounded-xl p-8 text-center text-dashboard-muted">
                Nenhum cliente encontrado. Cadastre o primeiro cliente para começar.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between gap-5">
          <div>
            <p className="text-sm text-dashboard-muted mb-2">Cliente selecionado</p>
            {activeClient ? (
              <>
                <h3 className="text-xl font-semibold text-dashboard-light">{activeClient.name}</h3>
                {activeClient.company_name && <p className="text-dashboard-text mt-1">{activeClient.company_name}</p>}
                <p className="text-xs text-dashboard-muted mt-3">
                  Os novos diagnósticos serão vinculados a este cliente.
                </p>
              </>
            ) : (
              <p className="text-dashboard-muted">Selecione ou cadastre um cliente para iniciar.</p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={onStartDiagnosis}
              disabled={!activeClient}
              className="w-full bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90"
            >
              Iniciar novo diagnóstico
            </Button>
            {hasOngoingAssessment && (
              <Button onClick={onContinueDiagnosis} variant="outline" disabled={!activeClient} className="w-full">
                Continuar diagnóstico em andamento
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
