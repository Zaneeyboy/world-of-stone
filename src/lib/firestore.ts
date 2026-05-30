import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Project, Promotion, FilterState, SortOption, Job, JobStatus, Client } from '@/types';

// ─── Collections ───────────────────────────────────────────────────────────
const PRODUCTS = 'products';
const PROJECTS = 'projects';
const PROMOTIONS = 'promotions';
const JOBS = 'jobs';
const CLIENTS = 'clients';
const COUNTERS = 'counters';
const ANALYTICS = 'analytics_events';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function tsToMs(ts: Timestamp | number): number {
  if (ts instanceof Timestamp) return ts.toMillis();
  return ts;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(id: string, data: any): Product {
  return {
    ...data,
    id,
    createdAt: tsToMs(data.createdAt),
    updatedAt: tsToMs(data.updatedAt),
    viewCount: data.viewCount ?? 0,
    inquiryCount: data.inquiryCount ?? 0,
    hidden: data.hidden ?? false,
    featured: data.featured ?? false,
  } as Product;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(id: string, data: any): Project {
  return {
    ...data,
    id,
    createdAt: tsToMs(data.createdAt),
    completedAt: data.completedAt ? tsToMs(data.completedAt) : undefined,
  } as Project;
}

// ─── Products ──────────────────────────────────────────────────────────────────
export async function getProducts(filters?: Partial<FilterState>, sort: SortOption = 'newest', limitCount = 24): Promise<Product[]> {
  const constraints: QueryConstraint[] = [where('hidden', '==', false)];

  if (filters?.materialType) {
    constraints.push(where('materialType', '==', filters.materialType));
  }
  if (filters?.availability) {
    constraints.push(where('availability', '==', filters.availability));
  }

  switch (sort) {
    case 'most_viewed':
      constraints.push(orderBy('viewCount', 'desc'));
      break;
    case 'price_asc':
      constraints.push(orderBy('price', 'asc'));
      break;
    case 'price_desc':
      constraints.push(orderBy('price', 'desc'));
      break;
    case 'featured':
      constraints.push(orderBy('rankOrder', 'asc'));
      break;
    default:
      constraints.push(orderBy('createdAt', 'desc'));
  }

  constraints.push(limit(limitCount));

  const q = query(collection(db, PRODUCTS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function getFeaturedProducts(count = 6): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), where('hidden', '==', false), where('featured', '==', true), orderBy('rankOrder', 'asc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, PRODUCTS), where('slug', '==', slug), where('hidden', '==', false), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return mapProduct(d.id, d.data());
}

export async function getProductById(id: string): Promise<Product | null> {
  const ref = doc(db, PRODUCTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapProduct(snap.id, snap.data());
}

export async function incrementProductView(productId: string): Promise<void> {
  const ref = doc(db, PRODUCTS, productId);
  await updateDoc(ref, { viewCount: increment(1) });
}

export async function incrementProductInquiry(productId: string): Promise<void> {
  const ref = doc(db, PRODUCTS, productId);
  await updateDoc(ref, { inquiryCount: increment(1) });
}

// ─── Admin: Products ───────────────────────────────────────────────────────────
export async function getAllProductsAdmin(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'inquiryCount'>): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS), {
    ...data,
    viewCount: 0,
    inquiryCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
  const ref = doc(db, PRODUCTS, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS, id));
}

// ─── Projects ──────────────────────────────────────────────────────────────────
export async function getProjects(featuredOnly = false): Promise<Project[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (featuredOnly) constraints.unshift(where('featured', '==', true));
  const q = query(collection(db, PROJECTS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProject(d.id, d.data()));
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, PROJECTS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> {
  await updateDoc(doc(db, PROJECTS, id), data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, PROJECTS, id));
}

// ─── Promotions ────────────────────────────────────────────────────────────────
export async function getActivePromotions(): Promise<Promotion[]> {
  const q = query(collection(db, PROMOTIONS), where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Promotion);
}

export async function getAllPromotions(): Promise<Promotion[]> {
  const q = query(collection(db, PROMOTIONS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Promotion);
}

export async function createPromotion(data: Omit<Promotion, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, PROMOTIONS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePromotion(id: string, data: Partial<Omit<Promotion, 'id' | 'createdAt'>>): Promise<void> {
  await updateDoc(doc(db, PROMOTIONS, id), data);
}

// ─── Slug generation ───────────────────────────────────────────────────────────
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJob(id: string, data: any): Job {
  return {
    ...data,
    id,
    createdAt: tsToMs(data.createdAt),
    updatedAt: tsToMs(data.updatedAt),
    acceptedAt: data.acceptedAt ? tsToMs(data.acceptedAt) : undefined,
    completedAt: data.completedAt ? tsToMs(data.completedAt) : undefined,
    paidAt: data.paidAt ? tsToMs(data.paidAt) : undefined,
  } as Job;
}

export async function getJobs(): Promise<Job[]> {
  const q = query(collection(db, JOBS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapJob(d.id, d.data()));
}

export async function getJob(id: string): Promise<Job | null> {
  const snap = await getDoc(doc(db, JOBS, id));
  if (!snap.exists()) return null;
  return mapJob(snap.id, snap.data());
}

export async function getJobByToken(id: string, token: string): Promise<Job | null> {
  const job = await getJob(id);
  if (!job || job.accessToken !== token) return null;
  return job;
}

export async function createJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, JOBS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateJob(id: string, data: Partial<Omit<Job, 'id' | 'createdAt'>>): Promise<void> {
  await updateDoc(doc(db, JOBS, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, JOBS, id));
}

export async function getJobStats(): Promise<{
  byStatus: Partial<Record<JobStatus, number>>;
  totalRevenueTTD: number;
  pipelineValueTTD: number;
}> {
  const jobs = await getJobs();
  const byStatus: Partial<Record<JobStatus, number>> = {};
  let totalRevenueTTD = 0;
  let pipelineValueTTD = 0;

  for (const job of jobs) {
    byStatus[job.status] = (byStatus[job.status] ?? 0) + 1;
    if (job.status === 'paid' || job.status === 'invoiced' || job.status === 'completed') {
      totalRevenueTTD += job.totalAmountTTD;
    }
    if (job.status === 'quote' || job.status === 'accepted' || job.status === 'in_progress') {
      pipelineValueTTD += job.totalAmountTTD;
    }
  }

  return { byStatus, totalRevenueTTD, pipelineValueTTD };
}

// ─── Invoice helpers ──────────────────────────────────────────────────────────

/**
 * Atomically increment the invoice counter and return the next number
 * as a formatted string like "INV-2026-001".
 */
export async function getNextInvoiceNumber(): Promise<string> {
  const counterRef = doc(db, COUNTERS, 'invoices');
  const year = new Date().getFullYear();

  const nextSeq = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const data = snap.data() as { seq?: number; year?: number } | undefined;
    const storedYear = data?.year ?? year;

    // Reset sequence each calendar year
    const seq = storedYear === year ? (data?.seq ?? 0) + 1 : 1;
    tx.set(counterRef, { seq, year }, { merge: true });
    return seq;
  });

  return `INV-${year}-${String(nextSeq).padStart(3, '0')}`;
}

export interface GenerateInvoiceOptions {
  termsDays: 7 | 14 | 30;
  vatPercent: number; // 0 or 12.5
}

/**
 * Generate an invoice for a job: assigns an invoice number, sets due date,
 * and transitions status to 'invoiced'.
 */
export async function generateInvoice(jobId: string, options: GenerateInvoiceOptions): Promise<string> {
  const invoiceNumber = await getNextInvoiceNumber();
  const now = Date.now();
  const dueDate = now + options.termsDays * 24 * 60 * 60 * 1000;

  await updateDoc(doc(db, JOBS, jobId), {
    invoiceNumber,
    invoicedAt: now,
    paymentDueDate: dueDate,
    paymentTermsDays: options.termsDays,
    vatPercent: options.vatPercent,
    status: 'invoiced',
    updatedAt: serverTimestamp(),
  });

  return invoiceNumber;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export type AnalyticsEventType = 'product_view' | 'product_inquiry' | 'quote_view';

/**
 * Fire-and-forget analytics event tracking. Silently fails on error.
 */
export function trackEvent(type: AnalyticsEventType, entityId: string): void {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  addDoc(collection(db, ANALYTICS), {
    type,
    entityId,
    date,
    createdAt: serverTimestamp(),
  }).catch(() => {
    // Silent — analytics should never break UX
  });
}

export interface DailyCount {
  date: string;
  count: number;
}

export async function getProductAnalytics(productId: string, days = 30): Promise<{ views: DailyCount[]; inquiries: DailyCount[] }> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);

  const q = query(collection(db, ANALYTICS), where('entityId', '==', productId), where('date', '>=', sinceStr), orderBy('date', 'asc'));

  const snap = await getDocs(q);

  const viewCounts: Record<string, number> = {};
  const inquiryCounts: Record<string, number> = {};

  for (const d of snap.docs) {
    const { type, date } = d.data() as { type: AnalyticsEventType; date: string };
    if (type === 'product_view') viewCounts[date] = (viewCounts[date] ?? 0) + 1;
    if (type === 'product_inquiry') inquiryCounts[date] = (inquiryCounts[date] ?? 0) + 1;
  }

  const views = Object.entries(viewCounts).map(([date, count]) => ({ date, count }));
  const inquiries = Object.entries(inquiryCounts).map(([date, count]) => ({ date, count }));

  return { views, inquiries };
}

export interface RevenueMonth {
  month: string; // e.g. "Jan 2026"
  revenueTTD: number;
}

export async function getRevenueByMonth(months = 6): Promise<RevenueMonth[]> {
  const jobs = await getJobs();
  const paid = jobs.filter((j) => j.status === 'paid' || j.status === 'invoiced' || j.status === 'completed');

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months + 1);
  cutoff.setDate(1);
  cutoff.setHours(0, 0, 0, 0);

  const byMonth: Record<string, number> = {};

  for (const job of paid) {
    const d = new Date(job.updatedAt);
    if (d < cutoff) continue;
    const key = d.toLocaleDateString('en-TT', { year: 'numeric', month: 'short' });
    byMonth[key] = (byMonth[key] ?? 0) + job.totalAmountTTD;
  }

  // Build ordered array for the last N months
  const result: RevenueMonth[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString('en-TT', { year: 'numeric', month: 'short' });
    result.push({ month: key, revenueTTD: byMonth[key] ?? 0 });
  }

  return result;
}

// ─── Clients ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClient(id: string, data: any): Client {
  return {
    ...data,
    id,
    createdAt: tsToMs(data.createdAt),
    updatedAt: tsToMs(data.updatedAt),
  } as Client;
}

export async function getClients(): Promise<Client[]> {
  const snap = await getDocs(query(collection(db, CLIENTS), orderBy('name', 'asc')));
  return snap.docs.map((d) => mapClient(d.id, d.data()));
}

export async function getClient(id: string): Promise<Client | null> {
  const snap = await getDoc(doc(db, CLIENTS, id));
  if (!snap.exists()) return null;
  return mapClient(snap.id, snap.data());
}

export async function createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(collection(db, CLIENTS), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<void> {
  await updateDoc(doc(db, CLIENTS, id), { ...data, updatedAt: Date.now() });
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, CLIENTS, id));
}

export async function getJobsByClientId(clientId: string): Promise<Job[]> {
  const snap = await getDocs(query(collection(db, JOBS), where('clientId', '==', clientId), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => mapJob(d.id, d.data()));
}

export async function getClientStats(clientId: string): Promise<{ jobCount: number; totalRevenueTTD: number; pipelineTTD: number }> {
  const jobs = await getJobsByClientId(clientId);
  const paid = jobs.filter((j) => j.status === 'paid' || j.status === 'invoiced');
  const pipeline = jobs.filter((j) => !['paid', 'cancelled'].includes(j.status));
  return {
    jobCount: jobs.length,
    totalRevenueTTD: paid.reduce((s, j) => s + j.totalAmountTTD, 0),
    pipelineTTD: pipeline.reduce((s, j) => s + j.totalAmountTTD, 0),
  };
}
