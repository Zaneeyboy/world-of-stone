import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Job, JobLineItem, ServiceType } from '@/types';

const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE) || 6.78;

function fmtTTD(n: number) {
  return n.toLocaleString('en-TT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtUSD(n: number) {
  return (n / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-TT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  kitchen_top: 'Kitchen Top',
  backsplash: 'Backsplash',
  waterfall_edge: 'Waterfall Edge',
  vanity: 'Vanity',
  staircase: 'Staircase',
  wall_cladding: 'Wall Cladding',
  pool_edge: 'Pool Edge',
  fountain: 'Fountain',
  flooring: 'Flooring',
  other: 'Other',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0c0b09',
    color: '#f0ede6',
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 48,
    position: 'relative',
  },

  // PAID watermark
  watermark: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 80,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a12',
    opacity: 1,
    transform: 'rotate(-35deg)',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2824',
  },
  brandName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#f0ede6',
    letterSpacing: 1,
  },
  brandGold: {
    fontSize: 20,
    color: '#c9a84c',
    fontFamily: 'Helvetica-Oblique',
  },
  brandSub: {
    fontSize: 8,
    color: '#9e9b8e',
    marginTop: 4,
    letterSpacing: 1.5,
  },
  invoiceRef: {
    textAlign: 'right',
  },
  invoiceLabel: {
    fontSize: 8,
    color: '#9e9b8e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#c9a84c',
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 8,
    color: '#9e9b8e',
    marginTop: 4,
  },
  dueDateText: {
    fontSize: 9,
    color: '#f0ede6',
    marginTop: 2,
    fontFamily: 'Helvetica-Bold',
  },

  // Client / project block
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 24,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7,
    color: '#c9a84c',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 10,
    color: '#f0ede6',
    fontFamily: 'Helvetica-Bold',
  },
  infoSub: {
    fontSize: 9,
    color: '#9e9b8e',
    marginTop: 2,
  },

  // Line items table
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2824',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 7,
    color: '#9e9b8e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1c18',
  },
  colDesc: { flex: 3 },
  colQty: { flex: 2, paddingHorizontal: 8 },
  colAmount: { flex: 1.5, textAlign: 'right' },
  descMain: {
    fontSize: 10,
    color: '#f0ede6',
    fontFamily: 'Helvetica-Bold',
  },
  descSub: {
    fontSize: 8,
    color: '#9e9b8e',
    marginTop: 2,
  },
  descService: {
    fontSize: 7,
    color: '#9e9b8e',
    marginTop: 3,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  qtyText: {
    fontSize: 9,
    color: '#9e9b8e',
  },
  amountTTD: {
    fontSize: 10,
    color: '#f0ede6',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  amountUSD: {
    fontSize: 8,
    color: '#9e9b8e',
    textAlign: 'right',
    marginTop: 2,
  },

  // Totals
  totalsSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#c9a84c',
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#9e9b8e',
  },
  totalSubtotal: {
    fontSize: 10,
    color: '#f0ede6',
    fontFamily: 'Helvetica-Bold',
  },
  totalVat: {
    fontSize: 9,
    color: '#9e9b8e',
  },
  totalGrand: {
    fontSize: 18,
    color: '#c9a84c',
    fontFamily: 'Helvetica-Bold',
  },
  totalGrandUSD: {
    fontSize: 9,
    color: '#9e9b8e',
  },

  // Notes
  notesSection: {
    marginTop: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2824',
  },
  notesLabel: {
    fontSize: 7,
    color: '#c9a84c',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: '#9e9b8e',
    lineHeight: 1.6,
  },

  // Payment instructions
  paymentSection: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#c9a84c',
  },
  paymentLabel: {
    fontSize: 7,
    color: '#c9a84c',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  paymentText: {
    fontSize: 9,
    color: '#9e9b8e',
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e1c18',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7.5,
    color: '#9e9b8e',
    lineHeight: 1.5,
  },
  footerBrand: {
    fontSize: 7.5,
    color: '#c9a84c',
    textAlign: 'right',
  },
});

function LineItemRow({ item }: { item: JobLineItem }) {
  let qtyDesc = '';
  if (item.sqft && item.pricePerSqFt) qtyDesc = `${item.sqft} sq ft @ TTD ${fmtTTD(item.pricePerSqFt)}/sq ft`;
  else if (item.sheets && item.pricePerSheet) qtyDesc = `${item.sheets} sheet${item.sheets > 1 ? 's' : ''} @ TTD ${fmtTTD(item.pricePerSheet)}/sheet`;
  else if (item.quantity && item.unitPrice) qtyDesc = `${item.quantity} × TTD ${fmtTTD(item.unitPrice)}`;

  return (
    <View style={styles.tableRow}>
      <View style={styles.colDesc}>
        <Text style={styles.descMain}>{item.description}</Text>
        {item.materialName ? <Text style={styles.descSub}>{item.materialName}</Text> : null}
        {item.notes ? <Text style={styles.descSub}>{item.notes}</Text> : null}
        <Text style={styles.descService}>{SERVICE_LABELS[item.serviceType]}</Text>
      </View>
      <View style={styles.colQty}>
        <Text style={styles.qtyText}>{qtyDesc}</Text>
      </View>
      <View style={styles.colAmount}>
        <Text style={styles.amountTTD}>TTD {fmtTTD(item.lineTotal)}</Text>
        <Text style={styles.amountUSD}>≈ USD {fmtUSD(item.lineTotal)}</Text>
      </View>
    </View>
  );
}

interface InvoicePDFProps {
  job: Job;
}

export function InvoicePDF({ job }: InvoicePDFProps) {
  const vatRate = job.vatPercent ?? 0;
  const subtotal = job.totalAmountTTD;
  const vatAmount = subtotal * (vatRate / 100);
  const grandTotal = subtotal + vatAmount;

  const invoicedDate = job.invoicedAt ? fmtDate(job.invoicedAt) : fmtDate(job.createdAt);
  const dueDate = job.paymentDueDate ? fmtDate(job.paymentDueDate) : null;
  const isPaid = job.status === 'paid';

  return (
    <Document title={`${job.invoiceNumber ?? 'Invoice'} — ${job.clientName}`} author='World of Stone'>
      <Page size='A4' style={styles.page}>
        {/* PAID watermark */}
        {isPaid && <Text style={styles.watermark}>PAID</Text>}

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>
              World <Text style={styles.brandGold}>of Stone</Text>
            </Text>
            <Text style={styles.brandSub}>TRINIDAD & TOBAGO</Text>
          </View>
          <View style={styles.invoiceRef}>
            <Text style={styles.invoiceLabel}>Invoice</Text>
            <Text style={styles.invoiceNumber}>{job.invoiceNumber ?? '—'}</Text>
            <Text style={styles.invoiceDate}>Issued: {invoicedDate}</Text>
            {dueDate && (
              <Text style={styles.dueDateText}>
                Due: {dueDate}
                {job.paymentTermsDays ? ` (Net ${job.paymentTermsDays})` : ''}
              </Text>
            )}
          </View>
        </View>

        {/* Client + Project info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoValue}>{job.clientName}</Text>
            <Text style={styles.infoSub}>{job.clientPhone}</Text>
            {job.clientEmail ? <Text style={styles.infoSub}>{job.clientEmail}</Text> : null}
            {job.clientAddress ? <Text style={styles.infoSub}>{job.clientAddress}</Text> : null}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Project / Job</Text>
            <Text style={styles.infoValue}>{job.title}</Text>
            <Text style={styles.infoSub}>Ref: {job.jobNumber}</Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.colQty, { paddingHorizontal: 8 }]}>Qty / Rate</Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
        </View>

        {job.lineItems.map((item) => (
          <LineItemRow key={item.id} item={item} />
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          {vatRate > 0 && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalSubtotal}>TTD {fmtTTD(subtotal)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>VAT ({vatRate}%)</Text>
                <Text style={styles.totalVat}>TTD {fmtTTD(vatAmount)}</Text>
              </View>
            </>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Due (TTD)</Text>
            <Text style={styles.totalGrand}>TTD {fmtTTD(grandTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>USD equivalent</Text>
            <Text style={styles.totalGrandUSD}>≈ USD {fmtUSD(grandTotal)}</Text>
          </View>
        </View>

        {/* Notes */}
        {job.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{job.notes}</Text>
          </View>
        ) : null}

        {/* Payment instructions */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentLabel}>Payment Instructions</Text>
          <Text style={styles.paymentText}>
            {'Please make payment within the specified due date.\nBank transfer details will be provided upon request.\nFor queries contact us at info@worldofstone.tt or WhatsApp.'}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{'Prices are in Trinidad & Tobago Dollars (TTD).\nExchange rate used: 1 USD ≈ ' + TTD_USD + ' TTD.\nThank you for choosing World of Stone.'}</Text>
          <Text style={styles.footerBrand}>{'World of Stone\nworldofstone.tt'}</Text>
        </View>
      </Page>
    </Document>
  );
}
