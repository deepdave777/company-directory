#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Configuration
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
const ADMIN_CODE = process.env.ADMIN_UPLOAD_CODE || 'floqer-upload-2024';

interface UploadOptions {
  file: string;
  mode: 'append' | 'replace';
  dryRun?: boolean;
}

async function uploadCompanies(options: UploadOptions) {
  const { file, mode, dryRun = false } = options;

  if (!fs.existsSync(file)) {
    console.error(`❌ File not found: ${file}`);
    process.exit(1);
  }

  console.log(`📤 Uploading companies from: ${file}`);
  console.log(`🔄 Mode: ${mode}`);
  console.log(`🔍 Dry run: ${dryRun ? 'Yes' : 'No'}`);

  if (dryRun) {
    console.log('\n📋 Dry run mode - validating CSV only...');
    
    // Just validate the CSV without uploading
    const csvText = fs.readFileSync(file, 'utf8');
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.error('❌ CSV must contain headers and at least one row');
      process.exit(1);
    }

    console.log(`✅ CSV has ${lines.length - 1} data rows`);
    console.log(`📊 Headers: ${lines[0]}`);
    console.log('\n✅ CSV validation passed. Ready to upload!');
    return;
  }

  try {
    // Read file and create form data manually
    const fileContent = fs.readFileSync(file, 'utf8');
    const boundary = '----formdata-multipart-boundary';
    
    let formData = '';
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="${path.basename(file)}"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += fileContent + '\r\n';
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="mode"\r\n\r\n`;
    formData += mode + '\r\n';
    formData += `--${boundary}--\r\n`;

    // Make API request
    const response = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_CODE}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: formData,
    });

    const result = await response.json() as any;

    if (!response.ok) {
      console.error('❌ Upload failed:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
      process.exit(1);
    }

    console.log('✅ Upload successful!');
    console.log(`📊 Uploaded: ${result.stats.uploaded} companies`);
    console.log(`⚠️  Warnings: ${result.stats.warnings}`);
    console.log(`🗑️  Removed columns: ${result.stats.removedColumns}`);
    
    if (result.details.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.details.warnings.forEach((warning: string) => {
        console.log(`  - ${warning}`);
      });
    }

    if (result.details.removedColumns.length > 0) {
      console.log('\n🗑️  Removed columns (not supported):');
      result.details.removedColumns.forEach((col: string) => {
        console.log(`  - ${col}`);
      });
    }

  } catch (error) {
    console.error('❌ Upload error:', error);
    process.exit(1);
  }
}

async function getTemplate() {
  try {
    const response = await fetch(`${API_URL}/api/admin/upload`);
    const result = await response.json() as any;

    if (!response.ok) {
      console.error('❌ Failed to get template:', result.error);
      process.exit(1);
    }

    console.log('📋 CSV Template:');
    console.log(result.template);
    console.log('\n📚 Supported columns:');
    result.supportedColumns.forEach((col: string) => {
      console.log(`  - ${col}`);
    });

    console.log('\n📖 Instructions:');
    Object.entries(result.instructions.formats).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

  } catch (error) {
    console.error('❌ Error getting template:', error);
    process.exit(1);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📤 Company Upload Script

Usage:
  tsx scripts/upload-companies.ts <file.csv> [options]
  tsx scripts/upload-companies.ts --template

Options:
  --mode <append|replace>  Upload mode (default: append)
  --dry-run               Validate CSV without uploading
  --template              Show CSV template and supported columns
  --help                  Show this help

Examples:
  tsx scripts/upload-companies.ts companies.csv --mode append
  tsx scripts/upload-companies.ts companies.csv --mode replace --dry-run
  tsx scripts/upload-companies.ts --template

Environment variables:
  ADMIN_UPLOAD_CODE        Admin authentication code
  NEXT_PUBLIC_SITE_URL     API base URL
    `);
    return;
  }

  if (args.includes('--template')) {
    await getTemplate();
    return;
  }

  const fileIndex = args.findIndex(arg => !arg.startsWith('--'));
  if (fileIndex === -1) {
    console.error('❌ Please specify a CSV file');
    console.log('Use --help for usage instructions');
    process.exit(1);
  }

  const file = args[fileIndex];
  const modeIndex = args.indexOf('--mode');
  const mode = (modeIndex !== -1 && args[modeIndex + 1]) as 'append' | 'replace' || 'append';
  const dryRun = args.includes('--dry-run');

  await uploadCompanies({ file, mode, dryRun });
}

if (require.main === module) {
  main().catch(console.error);
}
