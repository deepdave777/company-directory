import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { Company } from '@/lib/types';

// Backend flag for future adapters (e.g., Mongo)
const BACKEND = process.env.NEXT_PUBLIC_DATA_BACKEND || 'supabase';

async function getCompanyBySlugSupabase(slug: string): Promise<Company | null> {
  try {
    // Primary lookup by name-based slug (SEO-friendly URLs)
    const name = decodeURIComponent(slug).replace(/-/g, ' ');
    logger.debug('Looking up company', { name });
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('W2', name)
      .limit(1)
      .single();

    if (error) {
      logger.error('Company lookup failed', { name, error });
      throw error;
    }
    
    if (data) {
      logger.debug('Company found', { name });
      return data as Company;
    }

    // Fallback for partial matches or edge cases
    logger.debug('Trying fallback search', { name });
    const { data: fallback, error: fallbackError } = await supabase
      .from('companies')
      .select('*')
      .ilike('W2', `%${name}%`)
      .limit(1)
      .single();
      
    if (fallbackError) {
      logger.error('Fallback search failed', { name, error: fallbackError });
      throw fallbackError;
    }
    
    logger.debug('Fallback result', { name, found: !!fallback });
    return fallback as Company | null;
  } catch (error) {
    logger.error('Database error in getCompanyBySlug', { slug, error });
    return null;
  }
}

async function listCompaniesSupabase(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, W2, "Company Logo URL", "Company Industry", HQ, "Employee Range", Stage, "Current Funding Stage", "Public or Private Company Type", "Revenue Range"')
    .order('W2', { ascending: true });
  if (error || !data) return [];
  return data as Company[];
}

// Placeholder for future Mongo adapter
async function getCompanyBySlugMongo(_slug: string): Promise<Company | null> {
  throw new Error('Mongo adapter not implemented');
}

async function listCompaniesMongo(): Promise<Company[]> {
  throw new Error('Mongo adapter not implemented');
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  if (BACKEND === 'mongo') return getCompanyBySlugMongo(slug);
  return getCompanyBySlugSupabase(slug);
}

export async function listCompanies(): Promise<Company[]> {
  if (BACKEND === 'mongo') return listCompaniesMongo();
  return listCompaniesSupabase();
}
