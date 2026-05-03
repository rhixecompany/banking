import { NextResponse } from "next/server";

// Provenance: read actions/auth.signin.ts, dal/user.dal.ts — endpoint shim to call signin action from client
import signin from "@/actions/auth.signin";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {Request} req
 * @returns {unknown}
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await signin(body);
    return NextResponse.json(res);
  } catch (err: unknown) {
    return NextResponse.json({
      error: String(err instanceof Error ? err.message : "Invalid request"),
      ok: false,
    });
  }
}
