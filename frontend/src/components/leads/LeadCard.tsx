import React from 'react';
import type { Lead } from '../../types';
import { Mail, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';
import { useMouseGlow } from '../../hooks/useMouseGlow';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onViewNotes: (notes: string, leadName: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'qualified':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]';
    case 'contacted':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.12)]';
    case 'lost':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.12)]';
    case 'new':
    default:
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.12)]';
  }
};

const getSourceStyles = (source: string) => {
  switch (source?.toLowerCase()) {
    case 'instagram':
      return 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30 shadow-[0_0_12px_rgba(217,70,239,0.12)]';
    case 'referral':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.12)]';
    case 'website':
    default:
      return 'bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-sm';
  }
};

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onViewNotes }) => {
  const cardRef = useMouseGlow<HTMLDivElement>();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 border border-gray-200/50 dark:border-slate-800/50 w-full text-left transition-spring hover:scale-[1.02] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] group"
    >
      {/* Radial Hover Glow Overlay */}
      <span
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.04), transparent 80%)',
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">{lead.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Mail size={12} className="text-slate-400 dark:text-slate-500" />
            {lead.email}
          </p>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize tracking-wider transition-spring ${getStatusStyles(lead.status)}`}
        >
          {lead.status}
        </span>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs border-t border-gray-200/50 dark:border-slate-800/40 pt-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Source</span>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize tracking-wider ${getSourceStyles(lead.source)}`}
          >
            {lead.source}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Created At
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
            <Calendar size={12} className="text-slate-400 dark:text-slate-500" />
            {formatDate(lead.createdAt)}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 border-t border-gray-200/50 dark:border-slate-800/40 pt-4 mt-1">
        {lead.notes ? (
          <button
            onClick={() => onViewNotes(lead.notes || '', lead.name)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 hover:bg-blue-600 text-blue-500 dark:text-blue-400 hover:text-white border border-blue-500/20 transition-all duration-200 cursor-pointer"
          >
            <Eye size={13} />
            <span>Notes</span>
          </button>
        ) : (
          <span className="text-slate-400 dark:text-slate-655 text-[10px] italic">No internal notes</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onEdit(lead)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
            title="Edit lead"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
            title="Delete lead"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
