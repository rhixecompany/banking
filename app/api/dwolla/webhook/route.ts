import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { dwollaDal } from "@/dal";
import { db } from "@/database/db";
import { getDwollaClient } from "@/lib/dwolla";
import { env } from "@/lib/env";

// Dwolla webhook receiver that verifies signature and updates dwolla_transfers status.
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

    const schema = await import("@/database/schema");
    const rows = await db
      .select()
      .from(schema.dwolla_transfers)
      .where(eq(schema.dwolla_transfers.dwollaTransferId, transferId));

    let updated = false;
    if (rows.length === 0) {
      // fallback: match by transferUrl containing the transferId
      const all = await db.select().from(schema.dwolla_transfers);
      for (const r of all) {
        if (r.transferUrl && r.transferUrl.includes(String(transferId))) {
          await dwollaDal.updateTransferStatus(r.id, String(status));
          updated = true;
        }
      }
    } else {
      for (const r of rows) {
        await dwollaDal.updateTransferStatus(r.id, String(status));
        updated = true;
      }
    }

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), ok: false },
      { status: 500 },
    );
  }
}
