import { supabase } from '@/lib/supabase';
import { Company } from '@/lib/types';

// Backend flag for future adapters (e.g., Mongo)
const BACKEND = process.env.NEXT_PUBLIC_DATA_BACKEND || 'supabase';

async function getCompanyBySlugSupabase(slug: string): Promise<Company | null> {
  // Primary lookup by name-based slug (SEO-friendly URLs)
  const name = decodeURIComponent(slug).replace(/-/g, ' ');
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('W2', name)
    .limit(1)
    .single();

  if (data) return data as Company;

  // Fallback for partial matches or edge cases
  const { data: fallback } = await supabase
    .from('companies')
    .select('*')
    .ilike('W2', `%${name}%`)
    .limit(1)
    .single();
  return fallback as Company | null;
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
