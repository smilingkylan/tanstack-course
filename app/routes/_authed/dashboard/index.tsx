import { createFileRoute } from '@tanstack/react-router'
import { RecentTransactions } from './-recent-transactions'
import { getRecentTransactions } from '@/data/getRecentTransactions'

export const Route = createFileRoute('/_authed/dashboard/')({
  beforeLoad: ({ context }) => {
    // context.
  },
  loader: async() => {
    const transactions = await getRecentTransactions()
    return {
      transactions
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { transactions } = Route.useLoaderData()
  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibol pb-5">Dashboard</h1>
      <RecentTransactions transactions={transactions} />
    </div>
  )
}
