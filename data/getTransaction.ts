import { createServerFn } from "@tanstack/react-start";
import authMiddleware from "@/authMiddleware";
import { z } from "zod";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  transactionId: z.number()
})

export const getTransaction = createServerFn({
  method: 'GET'
}).middleware([authMiddleware]).validator(schema)
.handler(async ({data, context}) => {
  console.log('data.transactionId', data.transactionId)
  console.log('context.userId', context.userId)
  const [transaction] = await db.select().from(transactionsTable)
  .where(
    and(
      eq(transactionsTable.id, data.transactionId),
      eq(transactionsTable.userId, context.userId)
    )
  )
  return transaction
})