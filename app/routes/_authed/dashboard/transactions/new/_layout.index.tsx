import { TransactionForm } from '@/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategories } from '@/data/getCategories'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { transactionFormSchema } from '@/components/transaction-form'
import { createTransaction } from '@/data/createTransaction'
import { formatDate } from 'date-fns'
import { toast } from 'sonner'


export const Route = createFileRoute('/_authed/dashboard/transactions/new/_layout/')({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories()
    return {
      categories
    }
  }
})

function RouteComponent() {
  const { categories } = Route.useLoaderData()
  const navigate =  useNavigate()

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    console.log('handleSubmit', data)
    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        transactionDescription: data.transactionDescription,
        transactionDate: formatDate(data.transactionDate, "yyyy-MM-dd"),
        transactionType: data.transactionType
      }
    })
    console.log('transaction', transaction)
    toast.success('Success')
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear()
      }
    })
  }

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  )
}
