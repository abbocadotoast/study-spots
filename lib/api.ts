/**
 * Centralized API configuration to handle different backend URLs
 * between local development and Vercel production.
 */

// Default to local development URL
const LOCAL_API_URL = 'http://127.0.0.1:8000';

// Default to Vercel's multi-service route prefix as defined in vercel.json
const PRODUCTION_API_URL = '/_/backend';

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : LOCAL_API_URL);
