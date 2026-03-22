import { NextResponse } from "next/server";
import { adminCookieName, signAdminSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || password !== expected) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = await signAdminSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(adminCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
