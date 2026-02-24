import { Company } from '@/lib/types';
import { formatFundingStage, formatDate, parseJsonField } from '@/lib/utils';

// Define the exact CSV column mapping and validation rules
export const CSV_COLUMN_MAPPING = {
  'W2': 'W2',
  'Company Name': 'W2', // Alternative name
  'Company Logo URL': 'Company Logo URL',
  'Logo': 'Company Logo URL', // Alternative name
  'Company Industry': 'Company Industry',
  'Industry': 'Company Industry', // Alternative name
  'HQ': 'HQ',
  'Location': 'HQ', // Alternative name
  'Employee Range': 'Employee Range',
  'Size': 'Employee Range', // Alternative name
  'Stage': 'Stage',
  'Current Funding Stage': 'Current Funding Stage',
  'Funding Stage': 'Current Funding Stage', // Alternative name
  'Public or Private Company Type': 'Public or Private Company Type',
  'Company Type': 'Public or Private Company Type', // Alternative name
  'Revenue Range': 'Revenue Range',
  'Revenue': 'Revenue Range', // Alternative name
  'Website': 'Website',
  'LinkedIn Company Page URL': 'LinkedIn Company Page URL',
  'LinkedIn': 'LinkedIn Company Page URL', // Alternative name
  'LinkedIn Followers': 'LinkedIn Followers',
  'Business Description': 'Business Description',
  'Description': 'Business Description', // Alternative name
  'SIC Code': 'SIC Code',
  'NAICS Code': 'NAICS Code',
  'Founding Year': 'Founding Year',
  'Countries Operational': 'Countries Operational',
  'Technologies': 'Technologies',
  'Tech Stack': 'Technologies', // Alternative name
  'Key Focus Areas': 'Key Focus Areas',
  'Focus Areas': 'Key Focus Areas', // Alternative name
  'Latest News': 'Latest News',
  'News': 'Latest News', // Alternative name
  'Affiliated Companies': 'Affiliated Companies',
  'Affiliates': 'Affiliated Companies', // Alternative name
  'Competitors': 'Competitors',
  'Leadership': 'Leadership',
  'Number of Funding Rounds': 'Number of Funding Rounds',
  'Total Funding': 'Total Funding',
  'Latest Funding Date': 'Latest Funding Date',
  'Funding Stages': 'Funding Stages',
  'Employee Headcount': 'Employee Headcount',
  'Employee Headcount by Country': 'Employee Headcount by Country',
  'Employee HeadCount by Month': 'Employee HeadCount by Month',
  'Youtube Mentions': 'Youtube Mentions',
  'YouTube': 'Youtube Mentions', // Alternative name
  'Reddit Mentions': 'Reddit Mentions',
  'Reddit': 'Reddit Mentions', // Alternative name
  'FAQs': 'FAQs',
  'Funding Rounds': 'Funding Rounds',
  'Pricing Model': 'Pricing Model',
  'Pricing': 'Pricing Model', // Alternative name
  'News AI Summary': 'News AI Summary',
  'YouTube AI Summary': 'YouTube AI Summary',
  'Reddit AI Summary': 'Reddit AI Summary',
  'Last Updated': 'Last Updated',
  'Updated': 'Last Updated', // Alternative name
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  mappedData: Partial<Company>[];
  removedColumns: string[];
}

export function validateAndMapCSV(csvData: any[], headers: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const mappedData: Partial<Company>[] = [];
  const removedColumns: string[] = [];

  // Check for required columns
  const requiredColumns = ['W2'];
  const availableColumns = headers.map(h => h.trim());
  
  for (const required of requiredColumns) {
    if (!availableColumns.some(col => 
      Object.keys(CSV_COLUMN_MAPPING).some(key => key.toLowerCase() === required.toLowerCase() && col.toLowerCase() === key.toLowerCase())
    )) {
      errors.push(`Missing required column: ${required}`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings, mappedData, removedColumns };
  }

  // Process each row
  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];
    const mappedRow: Partial<Company> = {};

    // Map each column using the mapping
    for (const [csvColumn, dbColumn] of Object.entries(CSV_COLUMN_MAPPING)) {
      if (row[csvColumn] !== undefined) {
        const value = row[csvColumn];
        
        // Apply validation and formatting based on column type
        try {
          mappedRow[dbColumn as keyof Company] = formatColumnValue(dbColumn, value);
        } catch (error) {
          warnings.push(`Row ${i + 1}: Invalid format for ${csvColumn} - ${error}`);
        }
      }
    }

    // Validate required fields
    if (!mappedRow.W2) {
      errors.push(`Row ${i + 1}: Company name (W2) is required`);
      continue;
    }

    mappedData.push(mappedRow);
  }

  // Identify removed columns (columns in CSV that don't match our mapping)
  for (const header of availableColumns) {
    if (!CSV_COLUMN_MAPPING[header as keyof typeof CSV_COLUMN_MAPPING]) {
      removedColumns.push(header);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    mappedData,
    removedColumns
  };
}

function formatColumnValue(column: string, value: any): any {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Handle different column types
  switch (column) {
    case 'W2':
    case 'Company Industry':
    case 'HQ':
    case 'Employee Range':
    case 'Stage':
    case 'Current Funding Stage':
    case 'Public or Private Company Type':
    case 'Revenue Range':
    case 'Business Description':
    case 'News AI Summary':
    case 'YouTube AI Summary':
    case 'Reddit AI Summary':
    case 'Last Updated':
      return String(value).trim();

    case 'Company Logo URL':
    case 'Website':
    case 'LinkedIn Company Page URL':
      return String(value).trim() || null;

    case 'LinkedIn Followers':
    case 'SIC Code':
    case 'NAICS Code':
    case 'Founding Year':
    case 'Number of Funding Rounds':
    case 'Total Funding':
    case 'Employee Headcount':
      // Handle comma-separated numbers
      const numValue = String(value).replace(/,/g, '');
      return isNaN(Number(numValue)) ? null : Number(numValue);

    case 'Latest Funding Date':
      return formatDate(String(value));

    case 'Countries Operational':
    case 'Technologies':
    case 'Key Focus Areas':
      // Parse JSON arrays or comma-separated values
      if (typeof value === 'string') {
        try {
          return parseJsonField<string>(value);
        } catch {
          // Fallback: split by comma
          return value.split(',').map(s => s.trim()).filter(s => s);
        }
      }
      return value;

    case 'Latest News':
    case 'Affiliated Companies':
    case 'Competitors':
    case 'Funding Stages':
    case 'Employee Headcount by Country':
    case 'Employee HeadCount by Month':
    case 'Youtube Mentions':
    case 'Reddit Mentions':
    case 'FAQs':
    case 'Funding Rounds':
    case 'Pricing Model':
      // Parse JSON fields
      return parseJsonField(value);

    default:
      return value;
  }
}

export function generateCSVTemplate(): string {
  const headers = Object.keys(CSV_COLUMN_MAPPING);
  return headers.join(',') + '\n';
}
