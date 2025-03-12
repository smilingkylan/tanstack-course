import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import numeral from "numeral"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

export const Cashflow = ({ yearsRange, year, annualCashFlow }: {
  yearsRange: number[],
  year: string,
  annualCashFlow: { month: number, income: number, expenses: number }
}) => {
  const navigate = useNavigate()
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <div>
            <Select defaultValue={year.toString()} onValueChange={( value ) => {
              navigate({
                to: '/dashboard',
                search: {
                  cfyear: Number(value)
                }
              })
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>            
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          income: {
            label: 'Income',
            color: '#84cc16',
          },
          expenses: {
            label: 'Expenses',
            color: '#f97316',
          }
        }}
        className="w-full h-[300px]"
        >
          <BarChart data={annualCashFlow}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickFormatter={(value) => {
              return format(new Date(year, value - 1, 1), 'MMM')
            }} />
            <YAxis
              tickFormatter={value => `$${numeral(value).format('0,0')}`}
            />
            <Legend align="right" verticalAlign="top" />
            <ChartTooltip content={
              <ChartTooltipContent labelFormatter={(value, payload) => (
                <div>
                  {format(new Date(year, payload[0]?.payload?.month - 1, 1), 'MMM')}
                </div>
              )}></ChartTooltipContent>
            }/>
            <Bar dataKey="income" fill="var(--color-income)" />
            <Bar dataKey="expenses" fill="var(--color-expenses)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}