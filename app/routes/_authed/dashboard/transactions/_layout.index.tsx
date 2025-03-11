import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AllTransactions } from './-all-transactions'
import { getTransactionYearsRange } from '@/data/getTransactionYearsRange'
import { getTransactionsByMonth } from '@/data/getTransactionsByMonth'

const today = new Date()

const searchSchema = z.object({
  month: z.number().min(1).max(12).catch(today.getMonth() + 1).optional(),
  year: z.number().min(today.getFullYear() - 100).max(today.getFullYear()).catch(today.getFullYear()).optional(),
})

export const Route = createFileRoute('/_authed/dashboard/transactions/_layout/')({
  component: RouteComponent,
  validateSearch: searchSchema,
  // loaderDeps
  loaderDeps: ({ search }) => {
    const today = new Date()
    const output = {
      month: search.month ?? today.getMonth() + 1,
      year: search.year ?? today.getFullYear()
    }
    console.log('output', output)
    return output
  },
  // loeaderData
  loader: async ({ deps }) => {
    const yearsRange = await getTransactionYearsRange()
    const transactions = await getTransactionsByMonth({
      data: {
        month: deps.month,
        year: deps.year
      }
    })
    return {
      yearsRange,
      month: deps.month,
      year: deps.year,
      transactions
    }
  }
})

function RouteComponent() {
  const { month, year ,yearsRange, transactions } = Route.useLoaderData()
  console.log('transactions', transactions)
  return (
    <AllTransactions month={month} year={year} yearsRange={yearsRange} />
  )
}
