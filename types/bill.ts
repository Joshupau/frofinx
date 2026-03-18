export type BillStatus = 'active' | 'archived';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type PaymentStatus = 'paid' | 'unpaid' | 'overdue' | 'partial';

export type Bill = {
  id: string;
  name: string;
  amount: number;
  categoryId?: string;
  dueDate: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  walletId?: string;
  reminder?: boolean;
  reminderDays?: number;
  notes?: string;
  status: BillStatus;
  paymentStatus: PaymentStatus;
  paidAmount?: number;
  paidDate?: string;
};

export type BillSummary = {
  totalBills: number;
  totalAmount: number;
  paidBills: number;
  unpaidBills: number;
  overdueBills: number;
  dueSoonBills: number;
  paidAmount: number;
  unpaidAmount: number;
};

export type CreateBillData = {
  name: string;
  amount: number;
  categoryId?: string;
  dueDate: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  walletId?: string;
  reminder?: boolean;
  reminderDays?: number;
  notes?: string;
};

export type UpdateBillData = {
  id: string;
  name?: string;
  amount?: number;
  categoryId?: string;
  dueDate?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  walletId?: string;
  reminder?: boolean;
  reminderDays?: number;
  notes?: string;
  status?: BillStatus;
};

export type MarkPaidData = {
  id: string;
  paidAmount?: number;
  paidDate?: string;
  walletId?: string;
  createTransaction?: boolean;
  idempotencyKey?: string;
};

export type MarkUnpaidData = {
  id: string;
};

export type ListBillsParams = {
  page?: string;
  limit?: string;
  paymentStatus?: PaymentStatus;
  isRecurring?: string;
  startDate?: string;
  endDate?: string;
  status?: BillStatus;
};

export type UpcomingBillsParams = {
  days?: string;
};

export type BillCalendarParams = {
  month?: string; // Format: YYYY-MM
  year?: string;  // Format: YYYY
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string;   // Format: YYYY-MM-DD
};