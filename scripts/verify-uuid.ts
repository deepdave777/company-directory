import { supabase } from '../lib/supabase';

async function verifyUUID() {
  console.log('🔍 Verifying UUID column setup...\n');

  // Test 1: Fetch a few companies to check id field
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, W2')
    .limit(5);

  if (error) {
    console.error('❌ Error fetching companies:', error.message);
    return;
  }

  if (!companies || companies.length === 0) {
    console.error('❌ No companies found in database');
    return;
  }

  console.log('✅ Successfully fetched companies\n');
  console.log('Sample companies:');
  companies.forEach((c: any) => {
    console.log(`  - ${c.W2}`);
    console.log(`    ID: ${c.id}`);
    console.log(`    ID type: ${typeof c.id}`);
    console.log(`    ID format valid: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)}`);
    console.log('');
  });

  // Test 2: Try fetching by UUID
  const testId = companies[0].id;
  console.log(`\n🔍 Testing fetch by UUID: ${testId}`);
  const { data: byId, error: idError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', testId)
    .single();

  if (idError) {
    console.error('❌ Error fetching by UUID:', idError.message);
    return;
  }

  if (byId) {
    console.log(`✅ Successfully fetched company by UUID: ${byId.W2}\n`);
  }

  // Test 3: Check if all companies have UUIDs
  const { count, error: countError } = await supabase
    .from('companies')
    .select('id', { count: 'exact', head: true })
    .is('id', null);

  if (countError) {
    console.error('❌ Error checking null IDs:', countError.message);
    return;
  }

  if (count === 0) {
    console.log('✅ All companies have UUID values\n');
  } else {
    console.warn(`⚠️  Warning: ${count} companies have null UUID values\n`);
  }

  console.log('✅ UUID verification complete!');
}

verifyUUID().catch(console.error);
