export interface Job {
    id:  string;
    title: string;
    slug: string;
    status: 'active' | 'archieved';
    tags: string[];
    order: number;
}

export interface JobsProps {
    jobs: Job[],
}

export interface JobProp {
    job: Job;
}

export interface JobsApiResponse {
    jobs: Job[];
    totalPages: number;
}

export interface UseJobsProps {
    status?: 'active' | 'archived' | 'all';
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface JobFilters {
    title?: string;
    status?: string;
}

export interface PaginatedJobsResponse {
    jobs: Job[],
    totalPages: number,
    currentPage: number;
    setPage: (page: number) => void;
}

export interface AllJobsResponse {
    jobs: Job[];
}

export interface UseJobsOptions {
    page?: number;
    filters?: JobFilters;
    fetchAll?: boolean;
}