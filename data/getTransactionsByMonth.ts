import { createServerFn } from "@tanstack/react-start";
import authMiddleware from "../authMiddleware";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { format } from "date-fns";

const today = new Date()

const schema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(today.getFullYear() - 100).max(today.getFullYear()),
})

export const getTransactionsByMonth = createServerFn({
  method: 'GET'
}).middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    const earliestDate = new Date(data.year, data.month - 1, 1)
    const latestDate = new Date(data.year, data.month, 0) // "0" is the last day of the (preceding) month
    console.log('earliestDate', earliestDate)
    console.log('latestDate', latestDate)
    const transactions = await db
      .select({
        id: transactionsTable.id,
        amount: transactionsTable.amount,
        description: transactionsTable.description,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        type: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(and(
        eq(transactionsTable.userId, context.userId),
        gte(transactionsTable.transactionDate, format(earliestDate, 'yyyy-MM-dd')),
        lt(transactionsTable.transactionDate, format(latestDate, 'yyyy-MM-dd'))
      ))
      .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
      .orderBy(desc(transactionsTable.transactionDate))
    return transactions
  })