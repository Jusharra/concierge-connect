/**
 * Applies a verified PaymentEvent to Airtable and alerts Make.com. Idempotent: payment processors
 * retry webhooks, so a replay never double-alerts or flips a booking back.
 */
import { F, T } from "../../../shared/airtable-schema";
import { formulaString, getRecord, listRecords, type AirtableConfig } from "../../../shared/airtable";
import { forwardToMake, updateLead } from "./records";
import { fromMinorUnits, type PaymentEvent } from "./payments";

export interface ApplyResult {
  handled: boolean;
  detail: string;
}

const customerFor = async (cfg: AirtableConfig, leadFields: Record<string, any>) => {
  const id = leadFields[F.leads.customer]?.[0];
  if (!id) return {};
  try {
    const c = await getRecord(cfg, T.customers, id);
    return { name: c.fields[F.customers.name], email: c.fields[F.customers.email], phone: c.fields[F.customers.phone] };
  } catch {
    return {};
  }
};

export const applyPaymentEvent = async (event: PaymentEvent, cfg: AirtableConfig, now: () => Date = () => new Date()): Promise<ApplyResult> => {
  if (event.kind === "ignored") return { handled: false, detail: event.reason };

  if (event.kind === "deposit_paid") {
    const lead = await getRecord(cfg, T.leads, event.bookingRecordId);
    const f = lead.fields;

    // Replay of an event we already applied: do nothing (and do not alert twice).
    if (f[F.leads.paymentStatus] === "Deposit Paid" && f[F.leads.stripeReference] === event.reference) {
      return { handled: true, detail: "already applied" };
    }

    // The disclosure log must exist before payment. Verify it, and flag loudly if it does not.
    const disclosureLogged = f[F.leads.disclosureShown] === true && !!f[F.leads.disclosureShownAt];
    const note = disclosureLogged ? "" : "\nCHECK: payment received but no disclosure acknowledgment was logged for this booking.";

    await updateLead(cfg, lead.id, {
      [F.leads.paymentStatus]: "Deposit Paid",
      [F.leads.status]: "Paid",
      [F.leads.stripeReference]: event.reference,
      [F.leads.depositAmount]: fromMinorUnits(event.amountMinor, event.currency),
      ...(note ? { [F.leads.notes]: `${f[F.leads.notes] || ""}${note}` } : {}),
    });

    const customer = await customerFor(cfg, f);
    await forwardToMake({
      event: "deposit_paid",
      mode: "Pay",
      ...customer,
      depositAmount: fromMinorUnits(event.amountMinor, event.currency),
      currency: event.currency,
      disclosureLogged,
      dates: f[F.leads.dates] || "",
      route: f[F.leads.route] || "",
      partySize: f[F.leads.partySize] ?? null,
      timestamp: now().toISOString(),
      airtable: { leadRecordId: lead.id, bookingNumber: f[F.leads.bookingNumber] ?? null },
    });
    return { handled: true, detail: disclosureLogged ? "deposit paid" : "deposit paid (disclosure NOT logged)" };
  }

  // Refund
  let leadId: string | undefined;
  const byRef = await listRecords(cfg, T.leads, {
    fields: [F.leads.paymentStatus, F.leads.notes, F.leads.customer],
    filterByFormula: `{${F.leads.stripeReference}}=${formulaString(event.reference)}`,
  });
  if (byRef.length > 0) leadId = byRef[0].id;
  else if (event.bookingRecordId) leadId = event.bookingRecordId;
  if (!leadId) return { handled: false, detail: "no booking found for this refund" };

  const lead = await getRecord(cfg, T.leads, leadId);
  const f = lead.fields;
  const refunded = fromMinorUnits(event.amountRefundedMinor, event.currency);

  if (event.fullyRefunded) {
    if (f[F.leads.paymentStatus] === "Refunded") return { handled: true, detail: "already refunded" };
    await updateLead(cfg, lead.id, { [F.leads.paymentStatus]: "Refunded", [F.leads.status]: "Refunded" });
  } else {
    // Partial refund: record it, leave the payment status alone.
    await updateLead(cfg, lead.id, {
      [F.leads.notes]: `${f[F.leads.notes] || ""}\nPartial refund of ${refunded} ${event.currency} recorded ${now().toISOString()}.`,
    });
  }

  const customer = await customerFor(cfg, f);
  await forwardToMake({
    event: event.fullyRefunded ? "refunded" : "partially_refunded",
    mode: "Pay",
    ...customer,
    refundedAmount: refunded,
    currency: event.currency,
    timestamp: now().toISOString(),
    airtable: { leadRecordId: lead.id },
  });
  return { handled: true, detail: event.fullyRefunded ? "refunded" : "partial refund noted" };
};
