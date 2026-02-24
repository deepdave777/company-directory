// Type-safe API utilities
export function parseSearchParams(searchParams: URLSearchParams) {
  const result: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  
  return result;
}

export function validatePagination(page: string, limit: string) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
  const offset = (pageNum - 1) * limitNum;
  
  return { pageNum, limitNum, offset };
}

export function createApiResponse<T>(
  data: T,
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
  },
  filters?: Record<string, string>
) {
  return {
    data,
    pagination,
    filters,
  };
}
