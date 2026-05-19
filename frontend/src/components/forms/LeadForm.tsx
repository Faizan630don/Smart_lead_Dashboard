import React, { useState } from 'react';
import { leadService } from '../../services/leadService';
import type { Lead } from '../../types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../../constants/config';

interface LeadFormProps {
  initialData?: Lead;
  onSubmitSuccess: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmitSuccess }) => {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'new',
    source: initialData?.source || 'website',
    notes: initialData?.notes || '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Lead name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Lead name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Lead email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError(null);

    try {
      let response;
      if (isEdit && initialData) {
        response = await leadService.updateLead(initialData.id, formData as any);
      } else {
        response = await leadService.createLead(formData as any);
      }

      if (response.success) {
        onSubmitSuccess();
      } else {
        setSubmitError(response.error?.message || 'Failed to save lead');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred while saving the lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {submitError && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg text-left animate-fade-in">
          {submitError}
        </div>
      )}

      <Input
        label="Lead Name"
        id="name"
        name="name"
        type="text"
        placeholder="Enter lead full name"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
        required
      />

      <Input
        label="Email Address"
        id="email"
        name="email"
        type="email"
        placeholder="lead@domain.com"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          id="status"
          name="status"
          options={LEAD_STATUS_OPTIONS}
          value={formData.status}
          onChange={handleChange}
        />

        <Select
          label="Source"
          id="source"
          name="source"
          options={LEAD_SOURCE_OPTIONS}
          value={formData.source}
          onChange={handleChange}
        />
      </div>

      <div className="w-full flex flex-col gap-1.5 text-left">
        <label htmlFor="notes" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Internal Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Enter lead status updates or key discussion details..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
        {isEdit ? 'Update Lead' : 'Create Lead'}
      </Button>
    </form>
  );
};

export default LeadForm;
