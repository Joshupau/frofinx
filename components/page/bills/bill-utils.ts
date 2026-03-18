import { extractArrayFromApiResponse, extractNumberFromApiResponse, getApiDataNode, isRecord, resolveEntityId } from '@/lib/api-response'
import { Bill, BillSummary, BillStatus, PaymentStatus, RecurringFrequency } from '@/types/bill'

const paymentStatuses: PaymentStatus[] = ['paid', 'unpaid', 'overdue', 'partial']
const billStatuses: BillStatus[] = ['active', 'archived']
const recurringFrequencies: RecurringFrequency[] = ['daily', 'weekly', 'monthly', 'yearly']

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback
}

const toBoolean = (value: unknown, fallback = false): boolean => {
  return typeof value === 'boolean' ? value : fallback
}

const toPaymentStatus = (value: unknown): PaymentStatus => {
  if (typeof value === 'string' && paymentStatuses.includes(value as PaymentStatus)) {
    return value as PaymentStatus
  }
  return 'unpaid'
}

const toBillStatus = (value: unknown): BillStatus => {
  if (typeof value === 'string' && billStatuses.includes(value as BillStatus)) {
    return value as BillStatus
  }
  return 'active'
}

const toRecurringFrequency = (value: unknown): RecurringFrequency | undefined => {
  if (typeof value === 'string' && recurringFrequencies.includes(value as RecurringFrequency)) {
    return value as RecurringFrequency
  }
  return undefined
}

export const normalizeBillsResponse = (response: unknown): Bill[] => {
  const items = extractArrayFromApiResponse<Record<string, unknown>>(response, ['items', 'bills'])

  return items.map((item, index) => ({
    id: resolveEntityId(item, `bill-${index}`),
    name: toString(item.name, 'Untitled Bill'),
    amount: toNumber(item.amount),
    categoryId: toString(item.categoryId) || undefined,
    dueDate: toString(item.dueDate),
    isRecurring: toBoolean(item.isRecurring),
    recurringFrequency: toRecurringFrequency(item.recurringFrequency),
    walletId: toString(item.walletId) || undefined,
    reminder: typeof item.reminder === 'boolean' ? item.reminder : undefined,
    reminderDays: typeof item.reminderDays === 'number' ? item.reminderDays : undefined,
    notes: toString(item.notes) || undefined,
    status: toBillStatus(item.status),
    paymentStatus: toPaymentStatus(item.paymentStatus),
    paidAmount: typeof item.paidAmount === 'number' ? item.paidAmount : undefined,
    paidDate: toString(item.paidDate) || undefined,
  }))
}

export const normalizeBillSummary = (response: unknown): BillSummary => {
  const totalBills = extractNumberFromApiResponse(response, ['totalBills', 'count', 'billsCount'], 0)
  const totalAmount = extractNumberFromApiResponse(response, ['totalAmount', 'amount', 'total'], 0)
  const paidBills = extractNumberFromApiResponse(response, ['paidBills'], 0)
  const unpaidBills = extractNumberFromApiResponse(response, ['unpaidBills'], 0)
  const overdueBills = extractNumberFromApiResponse(response, ['overdueBills'], 0)
  const dueSoonBills = extractNumberFromApiResponse(response, ['dueSoonBills', 'upcomingBills'], 0)
  const paidAmount = extractNumberFromApiResponse(response, ['paidAmount'], 0)
  const unpaidAmount = extractNumberFromApiResponse(response, ['unpaidAmount'], 0)

  return {
    totalBills,
    totalAmount,
    paidBills,
    unpaidBills,
    overdueBills,
    dueSoonBills,
    paidAmount,
    unpaidAmount,
  }
}

export const extractPaginationMeta = (response: unknown) => {
  const dataNode = getApiDataNode(response)
  if (!isRecord(dataNode)) {
    return {
      totalPages: 1,
      totalItems: 0,
    }
  }

  return {
    totalPages: toNumber(dataNode.totalPages, 1),
    totalItems: toNumber(dataNode.totalItems, 0),
  }
}

export const extractItemsCount = (response: unknown): number => {
  const dataNode = getApiDataNode(response)
  if (Array.isArray(dataNode)) return dataNode.length

  const fromKeys = extractNumberFromApiResponse(response, ['count', 'total', 'totalItems', 'overdueCount', 'upcomingCount'], -1)
  if (fromKeys >= 0) return fromKeys

  const items = extractArrayFromApiResponse<unknown>(response, ['items', 'bills'])
  return items.length
}
