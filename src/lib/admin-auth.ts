import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "edogawa_admin";

function getSecretBytes(): Uint8Array | null {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function signAdminSession() {
  const secret = getSecretBytes();
  if (!secret) throw new Error("ADMIN_JWT_SECRET must be set (min 16 characters).");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const secret = getSecretBytes();
    if (!secret) return false;
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return false;
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function adminCookieName() {
  return COOKIE;
}
