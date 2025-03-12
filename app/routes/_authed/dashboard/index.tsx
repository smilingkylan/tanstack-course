import { createFileRoute } from '@tanstack/react-router'
import { RecentTransactions } from './-recent-transactions'
import { getRecentTransactions } from '@/data/getRecentTransactions'
import { getAnnualCashflow } from '@/data/getAnnualCashflow'
import { getTransactionYearsRange } from '@/data/getTransactionYearsRange'
import { Cashflow } from './-cashflow'
import { z } from 'zod'

const today = new Date()

const searchSchema = z.object({
  month: z.number().min(1).max(12).catch(today.getMonth() + 1).optional(),
  year: z.number().min(today.getFullYear() - 100).max(today.getFullYear()).catch(today.getFullYear()).optional(),
})

export const Route = createFileRoute('/_authed/dashboard/')({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    // context.
  },
  loaderDeps: ({ search }) => ({ cfyear: search.cfyear }),
  loader: async({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({ data: { year: deps.cfyear ?? today.getFullYear()}}),
      getTransactionYearsRange()
    ])
    return {
      cfyear: deps.cfyear ?? today.getFullYear(),
      transactions,
      cashflow,
      yearsRange
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { transactions, cashflow, yearsRange, cfyear } = Route.useLoaderData()
  console.log('transactions', transactions)
  console.log('cashflow', cashflow)
  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow year={cfyear} yearsRange={yearsRange} annualCashFlow={cashflow} />
      <RecentTransactions transactions={transactions} />
    </div>
  )
}
