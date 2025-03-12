import { TransactionForm, transactionFormSchema } from '@/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategories } from '@/data/getCategories';
import { getTransaction } from '@/data/getTransaction';
import { updateTransaction } from '@/data/updateTransaction';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod';
import { toast } from 'sonner'

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/$transactionId/_layout/',
)({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    return <div className="text-3xl text-muted-foreground">Transaction not found</div>
  },
  loader: async ({ params }) => {
    const { transactionId } = params
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({ data: { transactionId: Number(transactionId) } })
    ]);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return {
      transaction,
      categories,
    };
  },
})

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData()
  const navigate = useNavigate()
  console.log('categories', categories)
  console.log('transaction', transaction)
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate:  (data.transactionDate, 'yyyy-MM-dd'),
        categoryId: data.categoryId,
        description: data.description
      }
    })
    toast.success('Transaction updated successfully')
    navigate({ to: '/dashboard/transactions' })
  }

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: Number(transaction.amount),
            categoryId: Number(transaction.categoryId),
            transactionDate: new Date(transaction.transactionDate),
            description: transaction.description,
            transactionType: categories.find(category => category.id === transaction.categoryId)?.type as 'income' | 'expense'
          }}
        />
      </CardContent>
    </Card>    
  )
}
