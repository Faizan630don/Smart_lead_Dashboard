import React from 'react';
import type { Lead } from '../../types';
import { Mail, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';
import { SkeletonTableRows } from '../common/Skeleton';
import { useMouseGlow } from '../../hooks/useMouseGlow';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onViewNotes: (notes: string, leadName: string) => void;
}

interface LeadRowProps {
  lead: Lead;
  index: number;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onViewNotes: (notes: string, leadName: string) => void;
  formatDate: (dateStr: string) => string;
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

export const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  index,
  onEdit,
  onDelete,
  onViewNotes,
  formatDate,
}) => {
  const rowRef = useMouseGlow<HTMLTableRowElement>();

  return (
    <tr
      ref={rowRef}
      style={{ animationDelay: `${index * 55}ms` }}
      className="animate-card-entrance group relative transform transition-spring-slow hover:scale-[1.01] hover:translate-x-1 hover:z-10 text-slate-700 dark:text-slate-300"
    >
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 first:border-l first:rounded-l-xl last:border-r last:rounded-r-xl transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:text-slate-900 dark:group-hover:text-white group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
        {/* Radial Hover Glow Overlay */}
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <span className="relative z-10 font-bold">{lead.name}</span>
      </td>
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:text-slate-900 dark:group-hover:text-white relative overflow-hidden">
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <span className="relative z-10 flex items-center gap-1.5 text-slate-550 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
          <Mail size={12} className="text-slate-400 dark:text-slate-600" />
          {lead.email}
        </span>
      </td>
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 relative overflow-hidden">
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <div className="relative z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize tracking-wider transition-spring ${getStatusStyles(
              lead.status
            )}`}
          >
            {lead.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 relative overflow-hidden">
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <div className="relative z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize tracking-wider transition-spring ${getSourceStyles(
              lead.source
            )}`}
          >
            {lead.source}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 relative overflow-hidden">
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <span className="relative z-10 flex items-center gap-1.5 text-slate-550 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
          <Calendar size={12} className="text-slate-400 dark:text-slate-600" />
          {formatDate(lead.createdAt)}
        </span>
      </td>
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 relative overflow-hidden">
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <span className="relative z-10">
          {lead.notes ? (
            <button
              onClick={() => onViewNotes(lead.notes || '', lead.name)}
              className="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-semibold cursor-pointer"
            >
              <Eye size={12} />
              <span>View Notes</span>
            </button>
          ) : (
            <span className="text-slate-400 dark:text-slate-600 text-xs italic">None</span>
          )}
        </span>
      </td>
      <td className="px-6 py-4 bg-white/70 dark:bg-slate-900/60 border-y border-gray-205/50 dark:border-slate-800/40 transition-spring duration-300 group-hover:bg-white dark:group-hover:bg-slate-900 first:rounded-l-xl last:rounded-r-xl relative overflow-hidden">
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.05), transparent 80%)',
          }}
        />
        <div className="relative z-10 flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-spring cursor-pointer"
            title="Edit lead"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-spring cursor-pointer"
            title="Delete lead"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
  onViewNotes,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl p-1">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
            <th className="px-6 py-2">Name</th>
            <th className="px-6 py-2">Email</th>
            <th className="px-6 py-2">Status</th>
            <th className="px-6 py-2">Source</th>
            <th className="px-6 py-2">Created At</th>
            <th className="px-6 py-2">Notes</th>
            <th className="px-6 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonTableRows rows={5} cols={7} />
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic bg-white/40 dark:bg-slate-900/10 rounded-xl border border-gray-200/40 dark:border-slate-850/20">
                No matching leads found.
              </td>
            </tr>
          ) : (
            leads.map((lead, idx) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                index={idx}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewNotes={onViewNotes}
                formatDate={formatDate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
