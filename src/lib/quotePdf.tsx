import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Job, JobLineItem, JobStatus, ServiceType } from '@/types';

// Register fonts (using built-in Helvetica for reliability)
// If you want custom fonts, add them here with Font.register()

const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE) || 6.78;

function fmtTTD(n: number) {
  return n.toLocaleString('en-TT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtUSD(n: number) {
  return (n / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATUS_LABELS: Record<JobStatus, string> = {
  quote: 'Quote Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoice Issued',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

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
  quoteRef: {
    textAlign: 'right',
  },
  quoteRefLabel: {
    fontSize: 8,
    color: '#9e9b8e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  quoteRefNumber: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#f0ede6',
    marginTop: 4,
  },
  quoteDate: {
    fontSize: 8,
    color: '#9e9b8e',
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#1a1812',
    borderWidth: 1,
    borderColor: '#c9a84c',
  },
  statusText: {
    fontSize: 7,
    color: '#c9a84c',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
    width: 220,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#9e9b8e',
  },
  totalValueTTD: {
    fontSize: 18,
    color: '#c9a84c',
    fontFamily: 'Helvetica-Bold',
  },
  totalValueUSD: {
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

  // Footer
  footer: {
    marginTop: 40,
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

interface QuotePDFProps {
  job: Job;
}

export function QuotePDF({ job }: QuotePDFProps) {
  const dateStr = new Date(job.createdAt).toLocaleDateString('en-TT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document title={`${job.jobNumber} — ${job.clientName}`} author='World of Stone'>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>
              World <Text style={styles.brandGold}>of Stone</Text>
            </Text>
            <Text style={styles.brandSub}>TRINIDAD & TOBAGO</Text>
          </View>
          <View style={styles.quoteRef}>
            <Text style={styles.quoteRefLabel}>Quote Reference</Text>
            <Text style={styles.quoteRefNumber}>{job.jobNumber}</Text>
            <Text style={styles.quoteDate}>{dateStr}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{STATUS_LABELS[job.status]}</Text>
            </View>
          </View>
        </View>

        {/* Client + Project info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Prepared For</Text>
            <Text style={styles.infoValue}>{job.clientName}</Text>
            <Text style={styles.infoSub}>{job.clientPhone}</Text>
            {job.clientEmail ? <Text style={styles.infoSub}>{job.clientEmail}</Text> : null}
            {job.clientAddress ? <Text style={styles.infoSub}>{job.clientAddress}</Text> : null}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Project</Text>
            <Text style={styles.infoValue}>{job.title}</Text>
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
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total (TTD)</Text>
            <Text style={styles.totalValueTTD}>TTD {fmtTTD(job.totalAmountTTD)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>USD equivalent</Text>
            <Text style={styles.totalValueUSD}>≈ USD {fmtUSD(job.totalAmountTTD)}</Text>
          </View>
        </View>

        {/* Notes */}
        {job.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{job.notes}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {'This quote is valid for 30 days from the date of issue.\nPrices are in Trinidad & Tobago Dollars (TTD).\nExchange rate used: 1 USD ≈ ' + TTD_USD + ' TTD.'}
          </Text>
          <Text style={styles.footerBrand}>{'World of Stone\nworldofstone.tt'}</Text>
        </View>
      </Page>
    </Document>
  );
}
