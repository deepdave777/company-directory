import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { parseSearchParams, validatePagination, createApiResponse } from '@/lib/api-types';

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = parseSearchParams(url.searchParams);
    
    const {
      search = '',
      page = '1',
      limit = DEFAULT_PAGE_SIZE.toString(),
      stage = 'All Stages',
      type = 'All Types',
      size = 'All Sizes',
      revenue = 'All Revenue',
      sort = 'asc'
    } = searchParams;

    // Validate pagination
    const { pageNum, limitNum, offset } = validatePagination(page, limit);

    // Start building query
    let query = supabase
      .from('companies')
      .select(`
        id,
        W2,
        "Company Logo URL",
        "Company Industry",
        HQ,
        "Employee Range",
        Stage,
        "Current Funding Stage",
        "Public or Private Company Type",
        "Revenue Range"
      `, { count: 'exact' });

    // Apply filters
    if (search?.trim()) {
      query = query.ilike('W2', `%${search.trim()}%`);
    }
    if (stage && stage !== 'All Stages') {
      query = query.eq('Current Funding Stage', stage);
    }
    if (type && type !== 'All Types') {
      query = query.eq('Public or Private Company Type', type);
    }
    if (size && size !== 'All Sizes') {
      query = query.eq('Employee Range', size);
    }
    if (revenue && revenue !== 'All Revenue') {
      query = query.eq('Revenue Range', revenue);
    }

    // Apply sorting
    query = query.order('W2', { ascending: sort === 'asc' });

    // Apply pagination and execute
    const { data: companies, error, count } = await query.range(offset, offset + limitNum - 1);

    if (error) {
      logger.error('Database query error', { error, searchParams });
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limitNum);
    
    const response = createApiResponse(
      companies || [],
      {
        currentPage: pageNum,
        totalPages,
        totalItems,
        pageSize: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        itemsPerPage: companies?.length || 0
      },
      {
        search,
        stage,
        type,
        size,
        revenue,
        sort
      }
    );

    logger.info('Companies fetched successfully', { 
      count: companies?.length, 
      totalItems, 
      pageNum 
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('API error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
