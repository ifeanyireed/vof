'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  Check,
  Upload,
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  ListFilter,
  CheckSquare,
  CircleDot,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Columns2
} from 'lucide-react';
import { CustomForm, FormField, FormFieldType, FormStatus } from '@/types/forms';
import { api } from '@/lib/api';

interface FormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  formToEdit: CustomForm | null;
  onSaved: (savedForm: CustomForm) => void;
}

const FIELD_PALETTE: {
  type: FormFieldType;
  label: string;
  desc: string;
  icon: any;
  defaultLabel: string;
  defaultPlaceholder?: string;
}[] = [
  { type: 'text', label: 'Short Text', desc: 'Single-line text (Name, Title)', icon: Type, defaultLabel: 'Full Name', defaultPlaceholder: 'Enter your name' },
  { type: 'textarea', label: 'Long Paragraph', desc: 'Multi-line statement or reason', icon: AlignLeft, defaultLabel: 'Statement of Purpose', defaultPlaceholder: 'Provide details...' },
  { type: 'email', label: 'Email Address', desc: 'Validated email input', icon: Mail, defaultLabel: 'Email Address', defaultPlaceholder: 'you@example.com' },
  { type: 'phone', label: 'Phone / WhatsApp', desc: 'Telephone number with country prefix', icon: Phone, defaultLabel: 'Phone Number', defaultPlaceholder: '+234 800 000 0000' },
  { type: 'number', label: 'Number', desc: 'Numeric values, age, amounts', icon: Hash, defaultLabel: 'Age / Quantity', defaultPlaceholder: '0' },
  { type: 'select', label: 'Dropdown Select', desc: 'Select one option from a list', icon: ListFilter, defaultLabel: 'Select Category' },
  { type: 'radio', label: 'Single Choice Radio', desc: 'Radio buttons for a single choice', icon: CircleDot, defaultLabel: 'Preferred Option' },
  { type: 'checkbox', label: 'Multiple Choice / Consent', desc: 'Multi-select or agreement check', icon: CheckSquare, defaultLabel: 'Areas of Interest' },
  { type: 'date', label: 'Date Picker', desc: 'Date of birth or event schedule', icon: Calendar, defaultLabel: 'Date of Birth' },
  { type: 'file', label: 'File / Document Upload', desc: 'PDF, CV, certificate or image', icon: Upload, defaultLabel: 'Upload Credentials / CV' },
  { type: 'section', label: 'Section Header & Divider', desc: 'Visual divider and instructions', icon: Layers, defaultLabel: 'Section Header' },
];

function generateId(): string {
  return 'field_' + Math.random().toString(36).substring(2, 9);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function FormBuilderModal({
  isOpen,
  onClose,
  formToEdit,
  onSaved,
}: FormBuilderModalProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'preview'>('builder');

  // Form Metadata
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<FormStatus>('draft');
  const [submitButtonText, setSubmitButtonText] = useState('Submit Form');
  const [successTitle, setSuccessTitle] = useState('Application Received');
  const [successMessage, setSuccessMessage] = useState('Thank you! Your response has been recorded.');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [notifyEmails, setNotifyEmails] = useState('');

  // Form Fields
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Status
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (formToEdit) {
      setTitle(formToEdit.title || '');
      setSlug(formToEdit.slug || '');
      setDescription(formToEdit.description || '');
      setCategory(formToEdit.category || 'General');
      setStatus(formToEdit.status || 'draft');
      setSubmitButtonText(formToEdit.settings?.submitButtonText || 'Submit Form');
      setSuccessTitle(formToEdit.settings?.successTitle || 'Application Received');
      setSuccessMessage(formToEdit.settings?.successMessage || 'Thank you! Your response has been recorded.');
      setRedirectUrl(formToEdit.settings?.redirectUrl || '');
      setNotifyEmails((formToEdit.settings?.notifyEmails || []).join(', '));
      setFields(formToEdit.fields || []);
      setSelectedFieldId(formToEdit.fields?.[0]?.id || null);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setCategory('General');
      setStatus('draft');
      setSubmitButtonText('Submit Form');
      setSuccessTitle('Application Received');
      setSuccessMessage('Thank you! Your response has been recorded.');
      setRedirectUrl('');
      setNotifyEmails('');
      // Default starter fields for a fresh form
      const initialFields: FormField[] = [
        { id: generateId(), type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true, width: 'full' },
        { id: generateId(), type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true, width: 'half' },
        { id: generateId(), type: 'phone', label: 'Phone Number', placeholder: '+234 800 000 0000', required: true, width: 'half' },
      ];
      setFields(initialFields);
      setSelectedFieldId(initialFields[0].id);
    }
    setActiveTab('builder');
    setError(null);
  }, [formToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!formToEdit && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  };

  const addField = (type: FormFieldType) => {
    const paletteItem = FIELD_PALETTE.find((p) => p.type === type);
    const newField: FormField = {
      id: generateId(),
      type,
      label: paletteItem?.defaultLabel || 'Untitled Field',
      placeholder: paletteItem?.defaultPlaceholder || '',
      required: type !== 'section',
      width: type === 'section' ? 'full' : 'full',
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) {
      const remaining = fields.filter((f) => f.id !== id);
      setSelectedFieldId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const duplicateField = (id: string) => {
    const original = fields.find((f) => f.id === id);
    if (!original) return;
    const clone: FormField = {
      ...original,
      id: generateId(),
      label: `${original.label} (Copy)`,
    };
    const idx = fields.findIndex((f) => f.id === id);
    const updated = [...fields];
    updated.splice(idx + 1, 0, clone);
    setFields(updated);
    setSelectedFieldId(clone.id);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFields(updated);
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Form title is required');
      setActiveTab('settings');
      return;
    }
    if (fields.length === 0) {
      setError('Please add at least one field to your form');
      return;
    }

    setSaving(true);
    setError(null);

    const emailList = notifyEmails
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));

    const payload: Partial<CustomForm> = {
      title: title.trim(),
      slug: slugify(slug || title),
      description: description.trim(),
      category: category.trim(),
      status,
      fields,
      settings: {
        submitButtonText: submitButtonText.trim() || 'Submit Form',
        successTitle: successTitle.trim() || 'Application Received',
        successMessage: successMessage.trim(),
        redirectUrl: redirectUrl.trim() || undefined,
        notifyEmails: emailList,
      },
    };

    try {
      let saved: CustomForm;
      if (formToEdit) {
        saved = await api.updateCustomForm(formToEdit.id, payload);
      } else {
        saved = await api.createCustomForm(payload);
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Top Navbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-stone-50/80 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-gray-900 truncate max-w-md">
                  {title || 'Untitled Dynamic Form'}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : status === 'closed'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">
                /forms/{slug || 'form-slug'}
              </p>
            </div>
          </div>

          {/* Tab Navigation & Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-[#558b1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Form Builder ({fields.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#558b1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Form Settings</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#558b1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#558b1a] hover:bg-[#477516] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{formToEdit ? 'Save Changes' : 'Publish / Create'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Body Based on Tab */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'builder' && (
            <div className="h-full grid grid-cols-12 overflow-hidden">
              {/* Left Column: Field Palette */}
              <div className="col-span-3 border-r border-gray-100 p-5 overflow-y-auto bg-stone-50/50 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    Add Form Fields
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click any field type below to append to your form canvas.
                  </p>
                </div>

                <div className="space-y-2">
                  {FIELD_PALETTE.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => addField(item.type)}
                        className="w-full text-left p-2.5 rounded-xl bg-white border border-gray-200/80 hover:border-[#558b1a] hover:shadow-xs transition group flex items-start gap-3 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-[#558b1a]/10 text-gray-600 group-hover:text-[#558b1a] flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-800 block group-hover:text-[#558b1a] transition-colors">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-gray-500 line-clamp-1">
                            {item.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Center Column: Live Field Canvas */}
              <div className="col-span-6 p-6 overflow-y-auto bg-white flex flex-col items-center">
                <div className="w-full max-w-xl space-y-4">
                  {/* Form Header Preview */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1a05] via-[#162f0d] to-[#091503] text-white shadow-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#8ac43e] inline-block mb-2">
                      {category}
                    </span>
                    <h2 className="font-serif text-2xl font-bold">
                      {title || 'Form Title Appears Here'}
                    </h2>
                    {description && (
                      <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  {fields.length === 0 ? (
                    <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl p-8">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-gray-700">No Fields Added Yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Select a field from the left palette to start building your dynamic form.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fields.map((field, idx) => {
                        const isSelected = selectedFieldId === field.id;
                        const isSection = field.type === 'section';

                        return (
                          <div
                            key={field.id}
                            onClick={() => setSelectedFieldId(field.id)}
                            className={`p-4 rounded-2xl border transition cursor-pointer relative group ${
                              isSelected
                                ? 'bg-[#f7fbf2] border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-xs'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                  {field.type}
                                </span>
                                {field.width === 'half' && (
                                  <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-0.5">
                                    <Columns2 className="w-3 h-3" />
                                    <span>50%</span>
                                  </span>
                                )}
                              </div>

                              {/* Field Action Buttons */}
                              <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveField(idx, 'up');
                                  }}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-20"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveField(idx, 'down');
                                  }}
                                  disabled={idx === fields.length - 1}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-20"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateField(field.id);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                  title="Duplicate"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeField(field.id);
                                  }}
                                  className="p-1 hover:bg-rose-50 text-rose-500 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Field Display Preview */}
                            {isSection ? (
                              <div className="pt-2 border-t border-gray-200">
                                <h4 className="font-serif text-base font-bold text-gray-900">
                                  {field.label}
                                </h4>
                                {field.helperText && (
                                  <p className="text-xs text-gray-500 mt-1">{field.helperText}</p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <label className="text-xs font-bold text-gray-900 block mb-1.5">
                                  {field.label}
                                  {field.required && (
                                    <span className="text-rose-500 ml-1">*</span>
                                  )}
                                </label>

                                {field.type === 'textarea' ? (
                                  <div className="w-full h-16 rounded-xl border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-400">
                                    {field.placeholder || 'Long answer placeholder...'}
                                  </div>
                                ) : field.type === 'select' ? (
                                  <div className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-500 flex items-center justify-between">
                                    <span>Select an option...</span>
                                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                                  </div>
                                ) : field.type === 'radio' ? (
                                  <div className="space-y-1.5 pt-1">
                                    {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                                        <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                                        <span>{opt}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : field.type === 'checkbox' ? (
                                  <div className="space-y-1.5 pt-1">
                                    {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                                        <div className="w-3.5 h-3.5 rounded border border-gray-300" />
                                        <span>{opt}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : field.type === 'file' ? (
                                  <div className="w-full py-3 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 text-center text-xs text-gray-500">
                                    <Upload className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                                    <span>Drag & drop or browse document file</span>
                                  </div>
                                ) : (
                                  <div className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-400">
                                    {field.placeholder || 'Text input...'}
                                  </div>
                                )}

                                {field.helperText && (
                                  <p className="text-[11px] text-gray-500 mt-1.5">
                                    {field.helperText}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Field Property Inspector */}
              <div className="col-span-3 border-l border-gray-100 p-5 overflow-y-auto bg-stone-50/50">
                {selectedField ? (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                        Field Properties
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Editing: <span className="font-bold text-gray-900">{selectedField.type}</span>
                      </p>
                    </div>

                    {/* Field Label */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Field Label / Question
                      </label>
                      <input
                        type="text"
                        value={selectedField.label}
                        onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]"
                      />
                    </div>

                    {/* Placeholder */}
                    {selectedField.type !== 'section' && selectedField.type !== 'radio' && selectedField.type !== 'checkbox' && (
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Placeholder Hint
                        </label>
                        <input
                          type="text"
                          value={selectedField.placeholder || ''}
                          onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]"
                        />
                      </div>
                    )}

                    {/* Helper text */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Help Text / Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={selectedField.helperText || ''}
                        onChange={(e) => updateField(selectedField.id, { helperText: e.target.value })}
                        placeholder="Additional instruction for respondents..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]"
                      />
                    </div>

                    {/* Options Editor for Select, Radio, Checkbox */}
                    {['select', 'radio', 'checkbox'].includes(selectedField.type) && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Choice Options
                        </label>
                        <div className="space-y-1.5">
                          {(selectedField.options || []).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...(selectedField.options || [])];
                                  newOpts[optIdx] = e.target.value;
                                  updateField(selectedField.id, { options: newOpts });
                                }}
                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOpts = (selectedField.options || []).filter((_, i) => i !== optIdx);
                                  updateField(selectedField.id, { options: newOpts });
                                }}
                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                            updateField(selectedField.id, { options: newOpts });
                          }}
                          className="w-full py-1.5 rounded-lg border border-dashed border-[#558b1a] text-[#558b1a] hover:bg-[#558b1a]/5 text-xs font-bold transition flex items-center justify-center gap-1 mt-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Option</span>
                        </button>
                      </div>
                    )}

                    {/* Required & Layout Width Toggles */}
                    {selectedField.type !== 'section' && (
                      <div className="pt-3 border-t border-gray-200/80 space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedField.required}
                            onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                            className="w-4 h-4 text-[#558b1a] rounded border-gray-300 focus:ring-[#558b1a]"
                          />
                          <span className="text-xs font-semibold text-gray-800">
                            Required Field
                          </span>
                        </label>

                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1.5">
                            Form Column Width
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => updateField(selectedField.id, { width: 'full' })}
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition border ${
                                selectedField.width !== 'half'
                                  ? 'bg-[#558b1a] text-white border-[#558b1a]'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              100% (Full Row)
                            </button>
                            <button
                              type="button"
                              onClick={() => updateField(selectedField.id, { width: 'half' })}
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition border ${
                                selectedField.width === 'half'
                                  ? 'bg-[#558b1a] text-white border-[#558b1a]'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              50% (Two-Column)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center text-gray-400">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs font-medium">Select a field on the canvas to configure its settings.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="h-full p-8 overflow-y-auto max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900">General Form Settings</h3>
                <p className="text-xs text-gray-500 mt-1">Configure publishing status, slug, notifications, and post-submission behavior.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Special VOIE 2026 Skills Intake"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#558b1a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 rounded-l-xl bg-gray-100 border border-r-0 border-gray-300 text-xs text-gray-500 font-mono">
                      /forms/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="voie-skills-2026"
                      className="w-full px-3 py-2.5 rounded-r-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#558b1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]"
                  >
                    <option value="General">General Inquiries</option>
                    <option value="VOIE Skills">VOIE Skills Intake</option>
                    <option value="Scholarship">Academic Scholarships</option>
                    <option value="Maternal Care">Maternal Health & Care</option>
                    <option value="Volunteer">Volunteer Opportunities</option>
                    <option value="Partner">Institutional Partnerships</option>
                    <option value="Relief & Community">Community Relief / Survey</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Publishing Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FormStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]"
                  >
                    <option value="draft">Draft (Private / Testing)</option>
                    <option value="published">Published (Live to Public)</option>
                    <option value="closed">Closed (Submissions Paused)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={submitButtonText}
                    onChange={(e) => setSubmitButtonText(e.target.value)}
                    placeholder="Submit Application"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Instructions / Form Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about who is eligible, instructions, and deadlines..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email Notifications (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={notifyEmails}
                    onChange={(e) => setNotifyEmails(e.target.value)}
                    placeholder="info@vonf.org, admin@vonf.org"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Whenever someone submits this form, an instant notification with their responses will be dispatched to these addresses.
                  </p>
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">
                    Post-Submission Confirmation
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Success Heading
                      </label>
                      <input
                        type="text"
                        value={successTitle}
                        onChange={(e) => setSuccessTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Success Message
                      </label>
                      <textarea
                        rows={2}
                        value={successMessage}
                        onChange={(e) => setSuccessMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Preview Tab */}
          {activeTab === 'preview' && (
            <div className="h-full p-6 overflow-y-auto bg-stone-100 flex flex-col items-center">
              <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
                {/* Header */}
                <div className="border-b border-gray-100 pb-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 inline-block mb-3">
                    {category}
                  </span>
                  <h1 className="font-serif text-3xl font-bold text-gray-900">
                    {title || 'Untitled Form Preview'}
                  </h1>
                  {description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>

                {/* Form Fields Simulation */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field) => {
                      const isHalf = field.width === 'half' && field.type !== 'section';
                      return (
                        <div
                          key={field.id}
                          className={isHalf ? 'col-span-1' : 'col-span-1 sm:col-span-2'}
                        >
                          {field.type === 'section' ? (
                            <div className="pt-4 pb-1 border-t border-gray-200">
                              <h3 className="font-serif text-lg font-bold text-gray-900">
                                {field.label}
                              </h3>
                              {field.helperText && (
                                <p className="text-xs text-gray-500 mt-0.5">{field.helperText}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <label className="text-xs font-bold text-gray-800 block mb-1">
                                {field.label}
                                {field.required && <span className="text-rose-500 ml-1">*</span>}
                              </label>

                              {field.type === 'textarea' ? (
                                <textarea
                                  rows={3}
                                  placeholder={field.placeholder}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                                />
                              ) : field.type === 'select' ? (
                                <select className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#558b1a]">
                                  <option value="">Select an option...</option>
                                  {(field.options || []).map((opt, i) => (
                                    <option key={i} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : field.type === 'radio' ? (
                                <div className="space-y-2 pt-1">
                                  {(field.options || []).map((opt, i) => (
                                    <label key={i} className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                                      <input type="radio" name={field.id} className="text-[#558b1a] focus:ring-[#558b1a]" />
                                      <span>{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              ) : field.type === 'checkbox' ? (
                                <div className="space-y-2 pt-1">
                                  {(field.options || []).map((opt, i) => (
                                    <label key={i} className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                                      <input type="checkbox" className="rounded text-[#558b1a] focus:ring-[#558b1a]" />
                                      <span>{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              ) : field.type === 'file' ? (
                                <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 text-center text-xs text-gray-500 bg-stone-50">
                                  <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                  <span>Click to select or drag document</span>
                                </div>
                              ) : (
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#558b1a]"
                                />
                              )}

                              {field.helperText && (
                                <p className="text-[11px] text-gray-400 mt-1">{field.helperText}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 mt-4 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white font-bold text-xs shadow-md transition"
                  >
                    {submitButtonText || 'Submit Form'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
