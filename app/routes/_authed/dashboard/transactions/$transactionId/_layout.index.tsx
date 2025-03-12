import { TransactionForm } from '@/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategories } from '@/data/getCategories';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/$transactionId/_layout/',
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [categories] = await Promise.all([
      getCategories(),
    ]);

    // if (!transaction) {
      // throw new Error("Transaction not found");
    // }

    return {
      // transaction,
      categories,
    };
  },
})

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData()
  const handleSubmit = () => {

  }
  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>    
  )
}
