API Integration

This scaffold provides placeholder pages and components for:
- Dashboard
- Wallets
- Transactions
- Bills
- Budgets
- Categories
- Settings/Profile

Where to plug your API calls:
- Replace the sample data arrays in the components under `components/*` with data fetched from your API.
- For list pages, call your API from the client (in `useEffect`) or from server components using `fetch` in the app router.
- Modals and create/edit components are client components; call the API on submit.

Notes:
- Keep client-only code (`localStorage`, `window`, `usePathname`) inside components marked with `"use client"`.
- Ask me to wire a specific endpoint and I can add data fetching and mutation helpers.
