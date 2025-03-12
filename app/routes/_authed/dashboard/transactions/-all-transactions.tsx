import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useRouter } from "@tanstack/react-router"
import { format } from "date-fns"
import { useState } from "react"
import { Pencil } from "lucide-react"
import numeral from "numeral"
import { routerSchema } from "vinxi"

export const AllTransactions = ({
  month,
  year,
  yearsRange,
  transactions
}: {
  month: number,
  year: number,
  yearsRange: number[],
  transactions: {
    id: number,
    description: string,
    amount: string,
    category: string | null,
    transactionDate: string,
    type: 'income' | 'expense' | null
  }[]
}) => {
  const router = useRouter()
  const selectedDate = new Date(year, month - 1, 1)
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedMonth, setSelectedMonth] = useState(month)
  console.log('transactions', transactions)

  return (
    <Card className="mt-4">
      <CardHeader >
        <CardTitle className="flex justify-between">
          <span className="text-muted-foreground">
            {format(selectedDate, 'MMM yyyy')}
            &nbsp;
            Transactions
          </span>
          <div className="flex gap-1">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12}).map((_, i) => (
                  <SelectItem key={i} value={`${i + 1}`}>
                    {format(new Date(selectedDate.getFullYear(), i, 1), 'MMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map(year => (
                  <SelectItem value={year.toString()} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link to="/dashboard/transactions" search={{
                month: selectedMonth,
                year: selectedYear
              }}>Go</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/transactions/new">New Transaction</Link>
        </Button>
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
                <TableHead />
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
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" aria-label="Edit transaction">
                        <Link onClick={() => {
                          router.clearCache({
                            filter: (route) => route.pathname !== `/dashboard/transactions/${transaction.id}`
                          })
                        }}
                        to={`/dashboard/transactions/${transaction.id}`}
                        >
                          <Pencil />
                        </Link>
                      </Button>
                    </TableCell>
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