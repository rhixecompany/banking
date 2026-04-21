import { NextResponse } from "next/server";

// Provenance: read actions/auth.signup.ts, dal/user.dal.ts — endpoint shim to call signup action from client
import signup from "@/actions/auth.signup";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await signup(body);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({
      error: String(err?.message ?? "Invalid request"),
      ok: false,
    });
  }
}
