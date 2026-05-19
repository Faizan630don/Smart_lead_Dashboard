import React, { useState } from 'react';
import useLeads from '../hooks/useLeads';
import { useFilter } from '../hooks/useFilter';
import { leadService } from '../services/leadService';
import type { Lead } from '../types';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import PaginationControl from '../components/leads/PaginationControl';
import Modal from '../components/common/Modal';
import LeadForm from '../components/forms/LeadForm';
import Button from '../components/common/Button';
import { Plus, Download, Trash2 } from 'lucide-react';

export const Leads: React.FC = () => {
  const { leads, loading, error, pagination, refetch } = useLeads();
  const { filters } = useFilter();

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesContent, setNotesContent] = useState({ title: '', text: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  // CSV export state
  const [exporting, setExporting] = useState(false);

  // Edit action trigger
  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormModalOpen(true);
  };

  // Add action trigger
  const handleAdd = () => {
    setSelectedLead(undefined);
    setFormModalOpen(true);
  };

  // Delete action trigger
  const handleDeleteTrigger = (id: string) => {
    setLeadToDelete(id);
    setDeleteModalOpen(true);
  };

  // Delete confirm action
  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      const response = await leadService.deleteLead(leadToDelete);
      if (response.success) {
        refetch();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete lead');
    } finally {
      setDeleteModalOpen(false);
      setLeadToDelete(null);
    }
  };

  // View notes action trigger
  const handleViewNotes = (notes: string, leadName: string) => {
    setNotesContent({ title: leadName, text: notes });
    setNotesModalOpen(true);
  };

  // CSV export action trigger
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const blob = await leadService.exportCSV(filters);
      // Create a blob URL and trigger download in browser
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0 tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your client pipelines</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<Download size={15} />}
            onClick={handleExportCSV}
            loading={exporting}
            className="cursor-pointer"
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={15} />}
            onClick={handleAdd}
            className="cursor-pointer"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm text-left">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <LeadFilters />

      {/* Leads Content Viewport List (Responsive) */}
      <div className="w-full">
        {/* Desktop Viewport (Table) */}
        <div className="hidden md:block">
          <LeadTable
            leads={leads}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteTrigger}
            onViewNotes={handleViewNotes}
          />
        </div>

        {/* Mobile Viewport (Cards Grid) */}
        <div className="md:hidden">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 h-40 skeleton-pulse" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-white dark:glass-panel border border-slate-200 dark:border-transparent py-12 px-6 rounded-2xl text-center text-slate-500 italic shadow-sm dark:shadow-none">
              No matching leads found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTrigger}
                  onViewNotes={handleViewNotes}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && leads.length > 0 && <PaginationControl meta={pagination} />}

      {/* Modal - Create/Edit Form */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedLead ? `Edit Lead: ${selectedLead.name}` : 'Create New Lead'}
      >
        <LeadForm
          initialData={selectedLead}
          onSubmitSuccess={() => {
            setFormModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      {/* Modal - View Notes */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title={`Internal Notes: ${notesContent.title}`}
      >
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-gray-200/50 dark:border-slate-800/80 rounded-xl p-5 text-left">
          <p className="text-slate-800 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {notesContent.text}
          </p>
        </div>
      </Modal>

      {/* Modal - Confirm Delete */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Lead Deletion"
      >
        <div className="flex flex-col gap-4 text-center items-center">
          <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-full">
            <Trash2 size={24} />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this lead? This action is permanent and cannot be undone.
          </p>
          <div className="flex items-center gap-3 w-full mt-4">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1 cursor-pointer"
              onClick={handleDeleteConfirm}
            >
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;
