import React, { useState } from 'react';
import { X, Copy, Mail, Star, MapPin, MessageSquare, Save, CheckCircle, ExternalLink, Phone } from 'lucide-react';

interface LeadModalProps {
  lead: any;
  onClose: () => void;
  isTransient?: boolean;
  onSaved?: (lead: any, transientId: string) => void;
}

export default function LeadModal({ lead, onClose, isTransient = false, onSaved }: LeadModalProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const message = lead.messages?.[0]?.content || '';

  const handleSaveLead = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      if (res.ok) {
        const savedLead = await res.json();
        setSaved(true);
        onSaved?.(savedLead, lead.id);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleWhatsApp = () => {
    const phone = lead.phone?.replace(/\D/g, '');
    if (!phone) {
      alert('Este lead não possui telefone cadastrado.');
      return;
    }
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=55${phone}&text=${encoded}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-none sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[90vh] relative">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-white/5 bg-white/[0.01]">
          {/* Imagem do estabelecimento */}
          {lead.imageUrl && (
            <div className="shrink-0 mr-5">
              <img
                src={lead.imageUrl}
                alt={lead.name}
                className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-1">
              {isTransient && !saved && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  ⚡ Pré-visualização
                </span>
              )}
              {saved && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Salvo no CRM
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{lead.name}</h2>
            <p className="text-zinc-500 flex items-center gap-2 mt-1.5 font-medium text-sm">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              {lead.address || `${lead.city}, ${lead.state}`}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {lead.phone && (
                <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> {lead.phone}
                </span>
              )}
              {lead.mapsUrl && (
                <a href={lead.mapsUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Ver no Maps
                </a>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors group shrink-0">
            <X className="w-5 h-5 text-zinc-400 group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#111] border border-white/5 p-4 sm:p-5 rounded-xl sm:rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 sm:mb-2 ml-2">Classificação</div>
              <div className="flex items-center gap-2 sm:gap-3 font-semibold ml-2 text-base sm:text-lg">
                <div className={`w-2.5 h-2.5 rounded-full ${lead.score?.classification === 'quente' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : lead.score?.classification === 'bom' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                <span className="capitalize text-zinc-100">{lead.score?.classification} <span className="text-zinc-500 font-normal">({lead.score?.score} pts)</span></span>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 sm:mb-2">Presença Digital</div>
              <div className={`text-base sm:text-lg font-semibold flex items-center gap-2 ${lead.hasWebsite ? 'text-emerald-400' : 'text-rose-400'}`}>
                {lead.hasWebsite ? '🌐 Tem Site' : '🚫 Sem Site'}
                {lead.rating && <span className="text-zinc-500 text-xs sm:text-sm font-normal ml-1">⭐ {lead.rating}</span>}
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-emerald-500/10">
               <Star className="w-32 h-32" />
            </div>
            <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-lg relative z-10">
              <Star className="w-5 h-5" fill="currentColor" /> Oferta Inteligente
            </h3>
            <p className="text-white font-semibold text-xl relative z-10">{lead.recommendation?.recommendedService}</p>
            <p className="text-sm text-emerald-100/70 italic relative z-10">Análise da IA: {lead.recommendation?.reasoning}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-500" /> Script de Abordagem
              </h3>
              <button onClick={handleCopy}
                className={`text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                <Copy className="w-4 h-4" /> {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-48 bg-[#111] border border-white/10 rounded-2xl p-5 text-sm text-zinc-300 outline-none resize-none"
              value={message || 'Gerando mensagem...'}
            />
          </div>
        </div>

        {/* Footer de Ações */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-3">
          <button
            onClick={handleWhatsApp}
            disabled={!lead.phone}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20"
          >
            <MessageSquare className="w-5 h-5" />
            {lead.phone ? 'Enviar via WhatsApp' : 'Sem telefone'}
          </button>
          
          {isTransient && (
            <button
              onClick={handleSaveLead}
              disabled={saving || saved}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
                saved
                  ? 'bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              }`}
            >
              {saved ? <CheckCircle className="w-5 h-5" /> : saving ? <div className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="w-5 h-5" />}
              {saved ? 'Salvo no CRM!' : saving ? 'Salvando...' : 'Salvar no CRM'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
