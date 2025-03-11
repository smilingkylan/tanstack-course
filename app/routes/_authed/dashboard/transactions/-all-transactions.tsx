import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { useState } from "react"

export const AllTransactions = ({ month, year, yearsRange }: { month: number, year: number, yearsRange: number[] }) => {
  const selectedDate = new Date(year, month - 1, 1)
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedMonth, setSelectedMonth] = useState(month)

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
      </CardContent>
    </Card>
  )
}