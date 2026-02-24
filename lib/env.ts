// Environment variable validation
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}

export const env = {
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  siteUrl: requiredEnvVars.NEXT_PUBLIC_SITE_URL!,
} as const;
