import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import numeral from "numeral"
import { Link } from "@tanstack/react-router"

export const RecentTransactions = ({ transactions }: {
  transactions: {
    id: number,
    description: string,
    amount: string,
    category: string | null,
    transactionDate: string,
    type: 'income' | 'expense' | null    
  }[]
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/transactions">View All</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/transactions/new">New Transaction</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
      {!transactions.length ? (
          <p className="text-center py-10 text-lg text-muted-foreground">There are no transactions for this time period</p>
        ) : (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(transaction.transactionDate, 'do MMM yyyy')}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">
                      <Badge className={transaction.type === "income" ? 'bg-lime-500' : 'bg-orange-500'}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="text-right">{numeral(transaction.amount).format('$0,0[.]00')}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>          
        )}
      </CardContent>
    </Card>
  )
}