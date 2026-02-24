# Bulk Company Upload System

A modular, protected bulk upload system for adding companies to the directory with CSV validation and data uniformity.

## 🚀 Quick Start

### 1. Get CSV Template
```bash
# Show supported columns and template
tsx scripts/upload-companies.ts --template
```

### 2. Prepare Your CSV
Use the template format with these key features:
- **Column Mapping**: Accepts multiple column names (e.g., "Company Name" or "W2")
- **Data Validation**: Uses existing utils functions for formatting
- **JSON Support**: Handles complex fields like news, technologies, etc.
- **Auto-Removal**: Ignores unsupported columns automatically

### 3. Upload Companies
```bash
# Validate first (dry run)
tsx scripts/upload-companies.ts companies.csv --dry-run

# Upload (append mode)
tsx scripts/upload-companies.ts companies.csv --mode append

# Replace all data
tsx scripts/upload-companies.ts companies.csv --mode replace
```

## 📋 CSV Format

### Required Columns
- `W2` or `Company Name` - Company name (required)

### Supported Columns
```csv
W2,Company Logo URL,Company Industry,HQ,Employee Range,Stage,Current Funding Stage,Public or Private Company Type,Revenue Range,Website,LinkedIn Company Page URL,LinkedIn Followers,Business Description,SIC Code,NAICS Code,Founding Year,Countries Operational,Technologies,Key Focus Areas,Latest News,Affiliated Companies,Competitors,Leadership,Number of Funding Rounds,Total Funding,Latest Funding Date,Funding Stages,Employee Headcount,Employee Headcount by Country,Employee HeadCount by Month,Youtube Mentions,Reddit Mentions,FAQs,Funding Rounds,Pricing Model,News AI Summary,YouTube AI Summary,Reddit AI Summary,Last Updated
```

### Data Format Examples

#### Simple Fields
```csv
W2,Company Industry,HQ
"Acme Corp","Software","San Francisco"
```

#### JSON Arrays (Technologies, Focus Areas)
```csv
Technologies,Key Focus Areas
"["React","Node.js","TypeScript"]","["AI","Machine Learning"]"
# OR comma-separated:
"React,Node.js,TypeScript","AI,Machine Learning"
```

#### Complex JSON (News, Funding Rounds)
```csv
Latest News,Funding Rounds
"[{""title"":""Acme raises $20M"",""url"":""https://techcrunch.com/acme""}]","[{""stage"":""Series A"",""amount"":5000000,""date"":""2023-01-15""}]"
```

#### Numbers (LinkedIn Followers, Funding)
```csv
LinkedIn Followers,Total Funding
"1,234,567","50000000"
```

## 🔐 Security

### Admin Authentication
Protected by simple admin code (no complex login system):

```bash
# Set your admin code
export ADMIN_UPLOAD_CODE="your-secret-code"

# Use in API calls
Authorization: Bearer your-secret-code
```

### Environment Variables
```bash
ADMIN_UPLOAD_CODE=floqer-upload-2024  # Default admin code
NEXT_PUBLIC_SITE_URL=https://your-site.com  # API base URL
```

## 🛠️ API Endpoints

### POST /api/admin/upload
Upload companies with CSV validation.

**Headers:**
```
Authorization: Bearer <admin-code>
Content-Type: multipart/form-data
```

**Body:**
```
file: <csv-file>
mode: append|replace
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully uploaded 150 companies",
  "stats": {
    "uploaded": 150,
    "warnings": 2,
    "removedColumns": 3,
    "mode": "append"
  },
  "details": {
    "warnings": ["Row 5: Invalid format for LinkedIn Followers"],
    "removedColumns": ["Extra Column", "Another Column", "Unused Field"],
    "supportedColumns": ["W2", "Company Industry", ...]
  }
}
```

### GET /api/admin/upload
Get CSV template and supported columns.

**Response:**
```json
{
  "template": "W2,Company Logo URL,Company Industry,...",
  "supportedColumns": ["W2", "Company Logo URL", ...],
  "columnMapping": {
    "W2": "W2",
    "Company Name": "W2",
    "Logo": "Company Logo URL"
  },
  "instructions": {
    "required": ["W2"],
    "formats": {
      "W2": "Company name (required)",
      "Latest News": "JSON array: [{\"title\":\"News title\",\"url\":\"news_url\"}]"
    }
  }
}
```

## ✨ Features

### Data Uniformity
- **Uses existing utils**: `formatFundingStage`, `formatDate`, `parseJsonField`
- **Consistent formatting**: Numbers, dates, JSON fields automatically formatted
- **Type validation**: Ensures data matches UI expectations

### Column Flexibility
- **Multiple names**: "Company Name" → "W2", "Logo" → "Company Logo URL"
- **Auto-mapping**: Intelligently maps CSV columns to database fields
- **Clean removal**: Unsupported columns are ignored (no dirty data)

### Validation & Safety
- **Dry run mode**: Validate CSV without uploading
- **Detailed feedback**: Warnings, errors, and removed columns reported
- **Rollback support**: Replace mode clears existing data cleanly

### Performance
- **Modular design**: Upload system doesn't affect main app load time
- **Removable**: Can be completely removed by deleting `/api/admin/` and `/lib/upload/`
- **Efficient**: Bulk inserts with proper error handling

## 🗂️ File Structure

```
├── app/api/admin/upload/route.ts     # API endpoint (removable)
├── lib/upload/
│   ├── csvValidator.ts               # CSV validation logic (removable)
│   └── adminAuth.ts                  # Simple auth (removable)
├── scripts/upload-companies.ts      # CLI upload script
└── docs/BULK_UPLOAD.md              # This documentation
```

## 🚨 Important Notes

### Data Safety
- **Always use dry-run first**: Validate before uploading
- **Backup data**: Replace mode deletes existing data
- **Test with small batches**: Upload 5-10 companies first

### Performance
- **Large files**: For 1000+ companies, consider splitting into smaller batches
- **Memory usage**: CSV validation is memory-efficient but large files may need optimization
- **Database limits**: Supabase has rate limits - respect them

### Maintenance
- **Modular**: Upload system can be removed without affecting main app
- **No dependencies**: Uses built-in Node.js modules only
- **Clean separation**: Upload logic isolated from core functionality

## 🔧 Troubleshooting

### Common Issues

**"Missing required column: W2"**
- Ensure you have a "W2" or "Company Name" column
- Check for extra spaces in column names

**"Invalid format for LinkedIn Followers"**
- Remove commas from numbers or format as clean integers
- Example: "1,234" → "1234"

**JSON parsing errors**
- Escape quotes properly: `"[""item""]"`
- Use online JSON validator for complex fields

**Authentication errors**
- Check ADMIN_UPLOAD_CODE environment variable
- Ensure Authorization header format: `Bearer <code>`

### Debug Mode
Add logging to see detailed validation:
```bash
DEBUG=upload tsx scripts/upload-companies.ts companies.csv --dry-run
```

## 📞 Support

For issues with the upload system:
1. Check the validation output for specific errors
2. Use dry-run mode to test CSV format
3. Review this documentation for field formats
4. Test with small batches first

The upload system is designed to be robust and maintainable while keeping your data clean and uniform. 🚀
