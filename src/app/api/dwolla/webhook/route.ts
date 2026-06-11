import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { dwollaDal } from "@/dal";
import { getDwollaClient } from "@/lib/dwolla";
import { env } from "@/lib/env";

// Dwolla webhook receiver that verifies signature and updates dwolla_transfers status.
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
    const rawBody = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-dwolla-signature");

    // Verify signature using dwolla client if available; fallback to rejecting if missing
    try {
      const client = getDwollaClient();
      if (typeof (client as any).webhookVerify === "function") {
        const ok = (client as any).webhookVerify(
          {
            "webhook-url": env.DWOLLA_BASE_URL ?? "",
            "x-dwolla-signature": signature,
          },
          rawBody,
        );
        if (!ok) {
          return NextResponse.json(
            { error: "Invalid signature", ok: false },
            { status: 401 },
          );
        }
      }
    } catch {
      return NextResponse.json(
        { error: "Signature verification failed", ok: false },
        { status: 401 },
      );
    }

    const body = JSON.parse(rawBody);

    // Dwolla webhook payloads vary. We attempt to extract transfer id and status.
    const transferId =
      body?.resource?.id ?? body?.links?.resource?.id ?? body?.id;
    const status =
      body?.resource?.status ??
      body?.status ??
      body?.data?.status ??
      body?.topic;

    if (!transferId || !status) {
      return NextResponse.json(
        { error: "Invalid webhook payload", ok: false },
        { status: 400 },
      );
    }

    // Use DAL helper to find matching transfers (exact or fallback)
    const rows = await dwollaDal.findByDwollaTransferIdOrTransferUrl(
      String(transferId),
    );
    let updated = false;
    for (const r of rows) {
      await dwollaDal.updateTransferStatus(r.id, String(status));
      updated = true;
    }

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), ok: false },
      { status: 500 },
    );
  }
}
