import {createHmac, timingSafeEqual} from "node:crypto";

// TODO inject from cloudflare secrets
const SECRET = 'password123';

export const AUTH_COOKIE_NAME = '__Host-auth';
export const DEFAULT_TTL = 60 * 60 * 24 * 30;

function sign(payload: string): string {
    return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function createSession(keyId: string, ttlSeconds = DEFAULT_TTL): string {
    const payload = JSON.stringify({ keyId, expiry: Date.now() + ttlSeconds * 1000 });
    const encoded = Buffer.from(payload).toString('base64url');
    return `${encoded}.${sign(encoded)}`;
}

export function verifySession(token: string | undefined): string | null {
    if (!token) {
        return null;
    }
    
    const [encoded, hmac] = token.split('.');
    if (!encoded || !hmac) {
        return null;
    }
    
    const expected = sign(encoded);
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(hmac))) {
        return null;
    }
    
    const { keyId, expiry } = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (Date.now() > expiry) {
        return null;
    }
    
    return keyId;
}