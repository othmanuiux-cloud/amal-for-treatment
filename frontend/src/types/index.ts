export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'volunteer' | 'patient';
  country: string;
  phone?: string;
  phone_masked?: string;
  avatar_url?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface Case {
  id: number;
  patient_name: string;
  patient_age?: number;
  patient_gender?: 'male' | 'female' | 'other';
  disease: string;
  disease_category?: string;
  hospital_name: string;
  hospital_country: string;
  city?: string;
  hospital_address?: string;
  estimated_cost?: number;
  currency: string;
  description: string;
  status: CaseStatus;
  status_label: string;
  priority: CasePriority;
  priority_label: string;
  is_published: boolean;
  published_at?: string;
  rejection_reason?: string;
  approval_notes?: string;
  consent_given: boolean;
  created_at: string;
  updated_at: string;
  
  user?: User;
  documents?: Document[];
  verifications?: Verification[];
  status_history?: StatusHistory[];
  verification_count?: number;
  verified_count?: number;
}

export type CaseStatus = 'pending' | 'verifying' | 'verified' | 'approved' | 'rejected';
export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Document {
  id: number;
  case_id: number;
  file_name: string;
  file_type: DocumentType;
  file_type_label: string;
  mime_type: string;
  file_size: number;
  file_size_formatted: string;
  is_verified: boolean;
  download_url?: string;
  verified_at?: string;
  created_at: string;
  verifier?: User;
}

export type DocumentType = 'medical_report' | 'prescription' | 'lab_result' | 'imaging' | 'id_proof' | 'other';

export interface Verification {
  id: number;
  case_id: number;
  status: 'pending' | 'approved' | 'rejected';
  status_label: string;
  verification_notes?: string;
  evidence_file_path?: string;
  is_first_verifier: boolean;
  created_at: string;
  updated_at: string;
  volunteer?: User;
}

export interface StatusHistory {
  id: number;
  case_id: number;
  old_status?: string;
  new_status: string;
  notes?: string;
  created_at: string;
  changer?: User;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  time_ago: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url?: string;
  prev_page_url?: string;
}
