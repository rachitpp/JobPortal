export interface Job {
  _id: string;
  "Job ID (Numeric)"?: string;
  title?: string;
  company?: string;
  location?: string;
  job_link?: string;
  employment_type?: string;
  experience?: string;
  description?: string;
  employmentType?: string;
  experienceRange?: string;
  source?: string;
  country?: string;
  postedDateTime?: {
    $date?: string;
  };
  companyImageUrl?: string;
  min_exp?: number;
  max_exp?: number;
  postedDate?: string;
}

export interface JobsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
  data: Job[];
}
