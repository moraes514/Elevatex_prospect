import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Star, Link as LinkIcon, Phone, ChevronRight, Database, Zap, Trash2 } from 'lucide-react';
import LeadModal from './components/LeadModal';

type Tab = 'search' | 'crm';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [niche, setNiche] = useState('');
  const [region, setRegion] = useState('');
  const [limit, setLimit] = useState(20);
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isTransient, setIsTransient] = useState(false);

  const fetchCrmLeads = async () => {
    const res = await fetch('http://localhost:3333/api/leads');
    if (res.ok) setCrmLeads(await res.json());
  };

  useEffect(() => { fetchCrmLeads(); }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch('http://localhost:3333/api/collector/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, region, limit, filterBy })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.leads || []);
        setActiveTab('search');
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openTransientLead = (lead: any) => {
    setSelectedLead(lead);
    setIsTransient(true);
  };

  const openCrmLead = async (id: string) => {
    const res = await fetch(`http://localhost:3333/api/leads/${id}`);
    if (res.ok) {
      setSelectedLead(await res.json());
      setIsTransient(false);
    }
  };

  const handleLeadSaved = (_: any, transientId: string) => {
    setSearchResults(prev => prev.filter(l => l.id !== transientId));
    fetchCrmLeads();
    setSelectedLead(null);
  };

  const handleClearCrm = async () => {
    if (!confirm('Tem certeza? Isso vai apagar TODOS os leads do CRM.')) return;
    await fetch('http://localhost:3333/api/leads/clear', { method: 'DELETE' });
    fetchCrmLeads();
  };

  const currentLeads = activeTab === 'search' ? searchResults : crmLeads;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-10 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-emerald-200 tracking-tight">
            Descubra Novos Clientes
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Busque negócios locais, confira scores e crie abordagens inteligentes em segundos.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col gap-3 p-3 sm:p-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl text-left">
            {/* Linha 1: Nicho + Região */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center px-4 bg-white/5 rounded-xl focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                <Building2 className="w-5 h-5 text-emerald-500/70 shrink-0" />
                <input
                  value={niche} onChange={e => setNiche(e.target.value)}
                  placeholder="Nicho: Ex: Clínica Odontológica"
                  className="w-full bg-transparent border-none outline-none text-white px-3 py-3 sm:py-4 text-sm placeholder:text-zinc-500"
                  required
                />
              </div>
              <div className="flex-1 flex items-center px-4 bg-white/5 rounded-xl focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                <MapPin className="w-5 h-5 text-emerald-500/70 shrink-0" />
                <input
                  value={region} onChange={e => setRegion(e.target.value)}
                  placeholder="Região: Ex: Perdizes, São Paulo"
                  className="w-full bg-transparent border-none outline-none text-white px-3 py-3 sm:py-4 text-sm placeholder:text-zinc-500"
                  required
                />
              </div>
            </div>

            {/* Linha 2: Filtro + Limite + Botão */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterBy} onChange={e => setFilterBy(e.target.value)}
                className="flex-1 bg-white/5 border border-transparent outline-none text-zinc-300 font-medium px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all" className="bg-[#111] text-zinc-200">🔍 Geral — Todos (Com ou Sem site)</option>
                <option value="no_website" className="bg-[#111] text-emerald-400 font-bold">💎 Foco — Apenas SEM SITE</option>
              </select>

              <div className="flex-[0.5] sm:w-36 flex items-center px-4 bg-white/5 rounded-xl focus-within:ring-1 focus-within:ring-emerald-500 border border-transparent">
                <span className="text-zinc-500 text-sm whitespace-nowrap">Limite:</span>
                <input
                  type="number" min="1" max="100"
                  value={limit} onChange={e => setLimit(Number(e.target.value))}
                  className="w-full bg-transparent border-none outline-none text-white px-3 py-3 sm:py-4 text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !niche || !region}
                className="flex-1 sm:w-52 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading
                  ? <div className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                {loading ? 'Buscando...' : 'Buscar Leads'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'search' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400 hover:text-white'}`}
        >
          <Zap className="w-4 h-4" />
          Busca Rápida
          {searchResults.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'search' ? 'bg-white/20 text-white' : 'bg-white/10 text-zinc-300'}`}>
              {searchResults.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('crm')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'crm' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400 hover:text-white'}`}
        >
          <Database className="w-4 h-4" />
          Meu CRM
          {crmLeads.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'crm' ? 'bg-white/20 text-white' : 'bg-white/10 text-zinc-300'}`}>
              {crmLeads.length}
            </span>
          )}
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-[#111] border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h2 className="text-base font-semibold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              {activeTab === 'search' ? <Zap className="w-4 h-4 text-emerald-400" /> : <Star className="w-4 h-4 text-emerald-400" />}
            </div>
            {activeTab === 'search' ? 'Resultados da Prospecção' : 'Leads Salvos no CRM'}
            <span className="text-sm font-normal text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{currentLeads.length}</span>
          </h2>
          {activeTab === 'crm' && crmLeads.length > 0 && (
            <button onClick={handleClearCrm} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10">
              <Trash2 className="w-3.5 h-3.5" /> Limpar CRM
            </button>
          )}
          {activeTab === 'search' && searchResults.length === 0 && (
            <span className="text-xs text-zinc-600 italic">Use a busca acima para encontrar leads</span>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-8 py-4 font-semibold">Nome do Negócio</th>
                <th className="px-8 py-4 font-semibold">Score e Avaliação</th>
                <th className="px-8 py-4 font-semibold">Status</th>
                <th className="px-8 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentLeads.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => activeTab === 'search' ? openTransientLead(lead) : openCrmLead(lead.id)}
                  className="cursor-pointer hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">{lead.name}</div>
                    <div className="text-sm text-zinc-500 flex flex-wrap gap-4 mt-1.5">
                      {lead.hasWebsite
                        ? <span className="flex items-center gap-1.5 text-emerald-500/80"><LinkIcon className="w-3.5 h-3.5" /> Site Detectado</span>
                        : <span className="flex items-center gap-1.5 text-rose-400/80"><LinkIcon className="w-3.5 h-3.5" /> Sem Site Oficial</span>}
                      {lead.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-medium">
                        <div className={`w-2 h-2 rounded-full ${lead.score?.classification === 'quente' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : lead.score?.classification === 'bom' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                        <span className="capitalize text-zinc-200">{lead.score?.classification} ({lead.score?.score} pts)</span>
                      </div>
                      {lead.rating && <div className="text-xs text-zinc-500 ml-4">Nota: {lead.rating} ({lead.reviewsCount} reviews)</div>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {activeTab === 'search' ? (
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                        ⚡ Pré-visualização
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                        {lead.statuses?.[0]?.status || 'Novo Lead'}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-emerald-500 text-zinc-500 group-hover:text-white group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {currentLeads.map(lead => (
            <div
              key={lead.id}
              onClick={() => activeTab === 'search' ? openTransientLead(lead) : openCrmLead(lead.id)}
              className="p-5 active:bg-white/5 space-y-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-100">{lead.name}</h3>
                  <div className="text-xs text-zinc-500 flex flex-col gap-1">
                    {lead.hasWebsite
                      ? <span className="flex items-center gap-1.5 text-emerald-500/80"><LinkIcon className="w-3.5 h-3.5" /> Site Detectado</span>
                      : <span className="flex items-center gap-1.5 text-rose-400/80"><LinkIcon className="w-3.5 h-3.5" /> Sem Site</span>}
                    {lead.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${lead.score?.classification === 'quente' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : lead.score?.classification === 'bom' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${lead.score?.classification === 'quente' ? 'bg-emerald-400' : lead.score?.classification === 'bom' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                    {lead.score?.classification}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                 {lead.rating ? (
                   <div className="text-[10px] text-zinc-500">⭐ {lead.rating} ({lead.reviewsCount} reviews)</div>
                 ) : <div></div>}
                 <button className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                   Ver detalhes <ChevronRight className="w-3 h-3" />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {currentLeads.length === 0 && !loading && (
          <div className="px-8 py-16 text-center text-zinc-500 text-sm">
            {activeTab === 'search'
              ? 'Nenhum resultado ainda. Use a busca acima para prospectar leads.'
              : 'Nenhum lead salvo no CRM. Prospecte e salve os melhores clientes.'}
          </div>
        )}
      </div>

      <LeadModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        isTransient={isTransient}
        onSaved={handleLeadSaved}
      />
    </div>
  );
}
