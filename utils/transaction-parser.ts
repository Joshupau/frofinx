import type { TransactionType } from '@/types/transaction'

export interface ParsedTransaction {
  amount?: number
  description?: string
  type?: TransactionType
  date?: string // ISO date string YYYY-MM-DD
  inferredCategoryName?: string
  fromWalletName?: string  // transfer: source wallet
  toWalletName?: string    // transfer: destination wallet
  serviceFee?: number      // extracted service charge/fee
  confidence: {
    amount: number   // 0-1
    type: number     // 0-1
    date: number     // 0-1
    category: number // 0-1
  }
}

// ---------------------------------------------------------------------------
// Keyword tables
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Food & Dining': [
    'coffee', 'starbucks', 'restaurant', 'food', 'meal', 'lunch', 'dinner',
    'breakfast', 'cafe', 'eat', 'drinks', 'beverage', 'pizza', 'burger',
    'mcdonald', 'jollibee', 'grocery', 'groceries', 'snack', 'bakery',
    'dessert', 'milk tea', 'boba', 'fastfood', 'fast food',
  ],
  'Transport': [
    'uber', 'grab', 'taxi', 'bus', 'train', 'commute', 'gas', 'fuel',
    'parking', 'toll', 'fare', 'ride', 'gasoline', 'lyft', 'jeep',
    'jeepney', 'mrt', 'lrt', 'pnr',
  ],
  'Bills & Utilities': [
    'electric', 'electricity', 'water', 'internet', 'wifi', 'phone bill',
    'rent', 'insurance', 'subscription', 'bill', 'utility', 'utilities',
    'meralco', 'pldt', 'globe', 'smart', 'converge',
  ],
  'Entertainment': [
    'netflix', 'spotify', 'movie', 'cinema', 'games', 'concert', 'gaming',
    'steam', 'disney', 'youtube premium', 'hbo', 'apple tv', 'prime video',
  ],
  'Shopping': [
    'bought', 'mall', 'clothes', 'shirt', 'shoes', 'amazon', 'lazada',
    'shopee', 'zalora', 'shop', 'purchase', 'store',
  ],
  'Health': [
    'medicine', 'hospital', 'clinic', 'doctor', 'pharmacy', 'dental',
    'health', 'gym', 'fitness', 'vitamin', 'checkup',
  ],
  'Salary & Income': [
    'salary', 'wage', 'payroll', 'income', 'bonus', 'allowance',
    'pay day', 'payday',
  ],
  'Freelance': [
    'freelance', 'client payment', 'invoice', 'project payment', 'commission',
    'downpayment', 'down payment',
  ],
  'Investment': [
    'stock', 'crypto', 'investment', 'dividend', 'interest', 'bitcoin',
    'ethereum', 'mutual fund',
  ],
}

const INCOME_KEYWORDS = [
  'received', 'earned', 'salary', 'income', 'got paid', 'deposited',
  'payment received', 'revenue', 'profit', 'bonus', 'allowance', 'refund',
  'cashback', 'cash back', 'reimbursement',
]

const TRANSFER_KEYWORDS = [
  'transfer', 'transferred to', 'moved to', 'sent to', 'moved money',
  'shift', 'send to', 'sending to',
]

const EXPENSE_KEYWORDS = [
  'spent', 'paid', 'bought', 'purchased', 'ordered', 'charged', 'debited',
  'expense', 'withdraw', 'withdrawal',
]

// ---------------------------------------------------------------------------
// Leading wallet prefix extraction  (e.g. "BDO Spent 3120 for…")
// ---------------------------------------------------------------------------

// Action verbs that may immediately follow a wallet name prefix
const ACTION_VERBS =
  /\b(spent|paid|bought|purchased|received|earned|transferred?|sent|moved|deposited|charged|ordered|withdraw(?:n)?|got paid|income|expense)\b/i

/**
 * Detects a wallet name typed at the very start of the message before an
 * action verb, e.g. "BDO Spent 3120 for coffee" → "BDO".
 * Returns the raw wallet token and the rest of the text without it.
 */
function extractLeadingWallet(text: string): { walletToken?: string; rest: string } {
  // Match up to 3 words at the start before an action verb
  const m = text.match(/^([A-Za-z][\w\s]{0,30}?)\s+(?=(?:spent|paid|bought|purchased|received|earned|transferred?|sent|moved|deposited|charged|ordered|withdraw|got paid)\b)/i)
  if (m) {
    const token = m[1].trim()
    // Don't capture if what we matched is itself an action verb
    if (!ACTION_VERBS.test(token)) {
      return { walletToken: token, rest: text.slice(m[0].length) }
    }
  }
  return { rest: text }
}

// ---------------------------------------------------------------------------
// Transfer wallet extraction
// ---------------------------------------------------------------------------

function extractTransferWallets(text: string): { from?: string; to?: string } {
  // "from BDO to GCash" — non-greedy, stops at space-or-end after 2nd wallet name
  const m = text.match(/\bfrom\s+(\w+(?:\s+\w+){0,2}?)\s+to\s+(\w+(?:\s+\w+){0,2}?)(?=\s|$)/i)
  if (m) return { from: m[1].trim(), to: m[2].trim() }
  // "to GCash from BDO"
  const m2 = text.match(/\bto\s+(\w+(?:\s+\w+){0,2}?)\s+from\s+(\w+(?:\s+\w+){0,2}?)(?=\s|$)/i)
  if (m2) return { from: m2[2].trim(), to: m2[1].trim() }
  return {}
}

// ---------------------------------------------------------------------------
// Service fee extraction
// ---------------------------------------------------------------------------

function extractServiceFee(text: string): number | undefined {
  const patterns = [
    // "service charge/fee of 10 pesos"
    /(?:service\s+(?:charge|fee)|transaction\s+fee|convenience\s+fee)\s+(?:of\s+)?(?:\$\s*)?(\d[\d,]*(?:\.\d{1,2})?)\s*(?:pesos?|php|usd|dollars?)?/i,
    // "with a service charge of 10"
    /with\s+(?:a\s+)?(?:service\s+(?:charge|fee)|fee|charge)\s+(?:of\s+)?(?:\$\s*)?(\d[\d,]*(?:\.\d{1,2})?)/i,
    // "+ 10 service fee" / "plus 10 fee"
    /(?:\+|plus)\s*(?:\$\s*)?(\d[\d,]*(?:\.\d{1,2})?)\s*(?:service\s+)?(?:charge|fee)/i,
  ]
  for (const pat of patterns) {
    const m = text.match(pat)
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ''))
      if (!isNaN(val) && val > 0) return val
    }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Title-case helper
// ---------------------------------------------------------------------------

function titleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

// ---------------------------------------------------------------------------
// Amount extraction
// ---------------------------------------------------------------------------

const AMOUNT_PATTERNS = [
  // $50  $50.50  $ 50
  /\$\s?([\d,]+(?:\.\d{1,2})?)/i,
  // 50 dollars / 50 usd / 50 pesos / 50 php / 50p
  /([\d,]+(?:\.\d{1,2})?)\s*(?:dollars?|usd|pesos?|php)\b/i,
  // amount: 50 / total: 50
  /(?:amount|total|price|cost|subtotal)[:\s]+\$?\s*([\d,]+(?:\.\d{1,2})?)/i,
  // plain number (low confidence fallback)
  /\b(\d{1,7}(?:\.\d{1,2})?)\b/,
]

function extractAmount(text: string): { amount: number | undefined; confidence: number } {
  for (let i = 0; i < AMOUNT_PATTERNS.length; i++) {
    const match = text.match(AMOUNT_PATTERNS[i])
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ''))
      if (!isNaN(num) && num > 0) {
        // Higher confidence for explicit patterns, lower for bare number
        const confidence = i < AMOUNT_PATTERNS.length - 1 ? 0.95 : 0.5
        return { amount: num, confidence }
      }
    }
  }
  return { amount: undefined, confidence: 0 }
}

// ---------------------------------------------------------------------------
// Date parsing
// ---------------------------------------------------------------------------

const WEEKDAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const MONTH_NAMES: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

function isoDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function parseDate(text: string): { date: string | undefined; confidence: number } {
  const lower = text.toLowerCase()
  const now = new Date()

  if (/\btoday\b/.test(lower)) return { date: isoDate(now), confidence: 1 }

  if (/\byesterday\b/.test(lower)) {
    const d = new Date(now)
    d.setDate(d.getDate() - 1)
    return { date: isoDate(d), confidence: 1 }
  }

  // "last monday" / "last tuesday" etc
  for (let i = 0; i < WEEKDAY_NAMES.length; i++) {
    const pattern = new RegExp(`last\\s+${WEEKDAY_NAMES[i]}`)
    if (pattern.test(lower)) {
      const d = new Date(now)
      let diff = d.getDay() - i
      if (diff <= 0) diff += 7
      d.setDate(d.getDate() - diff)
      return { date: isoDate(d), confidence: 0.9 }
    }
  }

  // "March 5 2026" / "March 5, 2026" / "Jan 1" / "January 1st" / "1 Jan 2026"
  for (const [monthName, monthIdx] of Object.entries(MONTH_NAMES)) {
    // "March 5 2026" / "March 5, 2026" / "March 5th 2026"
    const p1 = new RegExp(
      `${monthName}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:[,\\s]+?(\\d{4}))?\\b`,
      'i'
    )
    // "5 March 2026" / "5th March, 2026"
    const p2 = new RegExp(
      `(\\d{1,2})(?:st|nd|rd|th)?\\s+${monthName}(?:[,\\s]+?(\\d{4}))?\\b`,
      'i'
    )
    const m1 = text.match(p1)
    const m2 = text.match(p2)

    if (m1) {
      const day = parseInt(m1[1])
      const year = m1[2] ? parseInt(m1[2]) : now.getFullYear()
      const d = new Date(year, monthIdx, day)
      if (!isNaN(d.getTime())) return { date: isoDate(d), confidence: m1[2] ? 0.95 : 0.85 }
    }
    if (m2) {
      const day = parseInt(m2[1])
      const year = m2[2] ? parseInt(m2[2]) : now.getFullYear()
      const d = new Date(year, monthIdx, day)
      if (!isNaN(d.getTime())) return { date: isoDate(d), confidence: m2[2] ? 0.95 : 0.85 }
    }
  }

  // YYYY-MM-DD (ISO)
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
  if (isoMatch) {
    const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]))
    if (!isNaN(d.getTime())) return { date: isoDate(d), confidence: 0.95 }
  }

  // MM/DD/YYYY, MM-DD-YYYY, MM/DD/YY, MM/DD (default this year)
  const slashMatch = text.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/)
  if (slashMatch) {
    const month = parseInt(slashMatch[1]) - 1
    const day = parseInt(slashMatch[2])
    const rawYear = slashMatch[3] ? parseInt(slashMatch[3]) : now.getFullYear()
    const year = rawYear < 100 ? rawYear + 2000 : rawYear
    const d = new Date(year, month, day)
    if (!isNaN(d.getTime()) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { date: isoDate(d), confidence: slashMatch[3] ? 0.9 : 0.8 }
    }
  }

  return { date: undefined, confidence: 0 }
}

// ---------------------------------------------------------------------------
// Type detection
// ---------------------------------------------------------------------------

function detectType(lower: string): { type: TransactionType; confidence: number } {
  if (TRANSFER_KEYWORDS.some(k => lower.includes(k))) return { type: 'transfer', confidence: 0.9 }
  if (INCOME_KEYWORDS.some(k => lower.includes(k))) return { type: 'income', confidence: 0.85 }
  if (EXPENSE_KEYWORDS.some(k => lower.includes(k))) return { type: 'expense', confidence: 0.85 }
  return { type: 'expense', confidence: 0.5 } // default to expense
}

// ---------------------------------------------------------------------------
// Category inference
// ---------------------------------------------------------------------------

function inferCategory(lower: string): { name: string | undefined; confidence: number } {
  let bestName: string | undefined
  let bestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matched = keywords.filter(k => lower.includes(k))
    if (matched.length > 0) {
      const score = Math.min(matched.length * 0.4, 0.95)
      if (score > bestScore) {
        bestName = category
        bestScore = score
      }
    }
  }

  return { name: bestName, confidence: bestScore }
}

// ---------------------------------------------------------------------------
// Description cleanup
// ---------------------------------------------------------------------------

const REMOVE_PATTERNS: RegExp[] = [
  // Currency amounts
  /\$\s?[\d,]+(?:\.\d{1,2})?/gi,
  /[\d,]+(?:\.\d{1,2})?\s*(?:dollars?|usd|pesos?|php)\b/gi,
  // Service charge phrases (remove whole phrase incl. amount)
  /with\s+(?:a\s+)?(?:service\s+(?:charge|fee)|transaction\s+fee|convenience\s+fee)(?:\s+of\s+[\d,]+(?:\.\d{1,2})?(?:\s*(?:pesos?|php|usd|dollars?))?)?/gi,
  /(?:service\s+(?:charge|fee)|transaction\s+fee|convenience\s+fee)(?:\s+of\s+[\d,]+(?:\.\d{1,2})?(?:\s*(?:pesos?|php|usd|dollars?))?)?/gi,
  // Full date expressions: "March 28" / "March 28, 2026" / "28th March"
  /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b\s*\d{0,2}(?:st|nd|rd|th)?(?:[,\s]+\d{4})?/gi,
  // Relative dates
  /\b(today|yesterday|last\s+\w+)\b/gi,
  // Action words
  /\b(spent|paid|bought|purchased|received|earned|transfer(?:red)?|sent|moved|deposited|charged|ordered|withdraw(?:n)?)\b/gi,
  // Stop words
  /\b(on|for|from|to|at|the|a|an|my|of|some|about|with|and)\b/gi,
  // Normalize spaces
  /\s{2,}/g,
]

function cleanDescription(text: string, transferFrom?: string, transferTo?: string): string {
  // For transfers with detected wallet names, build a clean canonical description
  if (transferFrom && transferTo) {
    return `${titleCase(transferFrom)} to ${titleCase(transferTo)}`
  }
  let cleaned = text
  for (const pat of REMOVE_PATTERNS) {
    cleaned = cleaned.replace(pat, ' ')
  }
  return cleaned.trim().replace(/^[,.\-–—\s]+|[,.\-–—\s]+$/g, '').trim()
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseTransactionText(text: string): ParsedTransaction {
  // Strip a leading wallet prefix ("BDO Spent…") before any other parsing
  const { walletToken: leadingWallet, rest: strippedText } = extractLeadingWallet(text.trim())

  // Use the stripped text for all further extraction
  const lower = strippedText.toLowerCase().trim()

  const { amount, confidence: amountConf } = extractAmount(strippedText)
  const { type, confidence: typeConf } = detectType(lower)
  const { date, confidence: dateConf } = parseDate(strippedText)
  const { name: inferredCategoryName, confidence: categoryConf } = inferCategory(lower)
  const { from: transferFrom, to: toWalletName } = extractTransferWallets(strippedText)
  const serviceFee = extractServiceFee(strippedText)

  // For transfers use the explicit "from X" if found; for other types use the
  // leading wallet token as the source wallet hint
  const fromWalletName = transferFrom ?? (type !== 'transfer' ? leadingWallet : undefined)

  const rawDescription = cleanDescription(strippedText, transferFrom, toWalletName)
  const description = rawDescription
    ? rawDescription.charAt(0).toUpperCase() + rawDescription.slice(1)
    : undefined

  return {
    amount,
    description: description || undefined,
    type,
    date: date ?? isoDate(new Date()),
    inferredCategoryName,
    fromWalletName: fromWalletName || undefined,
    toWalletName: toWalletName || undefined,
    serviceFee,
    confidence: {
      amount: amountConf,
      type: typeConf,
      date: dateConf > 0 ? dateConf : 0.8,
      category: categoryConf,
    },
  }
}
