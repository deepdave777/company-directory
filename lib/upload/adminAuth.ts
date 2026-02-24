// Simple admin authentication using environment variable
// No complex login system - just a secret code

const ADMIN_CODE = process.env.ADMIN_UPLOAD_CODE || 'floqer-upload-2024';

export function validateAdminCode(code: string): boolean {
  return code === ADMIN_CODE;
}

export function getAdminAuthHeader(): string {
  return `Bearer ${ADMIN_CODE}`;
}

// Middleware for API routes
export function withAdminAuth(handler: (req: any) => Promise<any>) {
  return async (req: any) => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!validateAdminCode(token)) {
      return new Response(
        JSON.stringify({ error: 'Invalid admin code' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(req);
  };
}
