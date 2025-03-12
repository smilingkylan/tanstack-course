import { createServerFn } from "@tanstack/react-start";
import authMiddleware from "@/authMiddleware";
import { z } from "zod";
import { db } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { categoriesTable, transactionsTable } from "@/db/schema";

const schema = z.object({
  year: z.number().min(2020).max(2025)
})

export const getAnnualCashflow = createServerFn({
  method: 'GET'
}).middleware([authMiddleware]).validator((data: z.infer<typeof schema>) => schema.parse(data))
.handler(async ({ context, data }) => {
  const cashflow = await db.select({
    month: sql<string>`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`,
    totalIncome: sql<string>`SUM(CASE WHEN ${categoriesTable.type} = 'income' THEN ${transactionsTable.amount} ELSE 0 END)`,
    totalExpenses: sql<string>`SUM(CASE WHEN ${categoriesTable.type} = 'expense' THEN ${transactionsTable.amount} ELSE 0 END)`,
  }).from(transactionsTable)
  .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
  .where(and(
    eq(transactionsTable.userId, context.userId),
    sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${data.year}`)
  )
  .groupBy(sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`)
  .orderBy(sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`)

  const annualCashFlow: {
    month: number,
    income: number,
    expense: number
  }[] = []

  for (let i = 1; i < 12; i++) {
    const monthlyCashFlow = cashflow.find(item => Number(item.month) === i)
    annualCashFlow.push({
      month: i,
      income: Number(monthlyCashFlow?.totalIncome || 0),
      expense: Number(monthlyCashFlow?.totalExpenses || 0)
    })
  }

  return annualCashFlow
})