import authMiddleware from "@/authMiddleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { categoriesTable } from "@/db/schema";
import { createServerFn } from '@tanstack/react-start'
import { eq, desc } from 'drizzle-orm'
export const getRecentTransactions = createServerFn({
  method: 'GET'
}).middleware([authMiddleware]).handler(async ({ context }) => {

  const transactions = await db.select({
    id: transactionsTable.id,
    amount: transactionsTable.amount,
    description: transactionsTable.description,
    transactionDate: transactionsTable.transactionDate,
    category: categoriesTable.name,
    type: categoriesTable.type,    
  }).from(transactionsTable)
  .where(eq(transactionsTable.userId, context.userId))
  .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
  .orderBy(desc(transactionsTable.transactionDate))
  .limit(5)

  return transactions
})