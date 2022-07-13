export const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
export const base_url = VERCEL_URL ? `https://${VERCEL_URL}` : 'http://localhost:3000'
export const url = `${base_url}/api/trpc`