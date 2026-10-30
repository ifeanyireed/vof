export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file'
  | 'section';

export interface FormFieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  allowedFileTypes?: string[];
  maxFileSizeMb?: number;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  options?: string[]; // for select, radio, multi-checkbox
  width?: 'full' | 'half'; // responsive layout width
  defaultValue?: any;
  validation?: FormFieldValidation;
}

export interface FormSettings {
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
  redirectUrl?: string;
  notifyEmails?: string[];
  maxSubmissions?: number;
  closesAt?: string;
  allowMultipleSubmissions?: boolean;
  requireAuth?: boolean;
}

export type FormStatus = 'draft' | 'published' | 'closed';

export interface CustomForm {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category: string;
  coverImageUrl?: string;
  status: FormStatus;
  fields: FormField[];
  settings: FormSettings;
  viewsCount: number;
  submissionsCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'pending' | 'reviewed' | 'approved' | 'rejected' | 'archived';

export interface SubmissionFile {
  fieldId: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface CustomFormSubmission {
  id: number;
  formId: number;
  formSlug: string;
  respondentName?: string;
  respondentEmail?: string;
  respondentPhone?: string;
  data: Record<string, any>;
  files: SubmissionFile[];
  status: SubmissionStatus;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}
