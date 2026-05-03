import { NextResponse } from "next/server";

// Uses modern register action instead of deleted auth.signup
import { registerUser } from "@/actions/register";

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
    const res = await registerUser(body);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({
      error: String(err?.message ?? "Invalid request"),
      ok: false,
    });
  }
}
