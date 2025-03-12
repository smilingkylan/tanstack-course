import { createServerFn } from "@tanstack/react-start";
import authMiddleware from "@/authMiddleware";
import { z } from "zod";
import { transactionSchema } from "./createTransaction";
import { addDays } from "date-fns";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const schema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.string().refine(value => {
    const parsedDate = new Date(value)
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(new Date(), 1)
  }),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  transactionDescription: z
    .string()
    .min(3, "Description must contain at least 3 characters")
    .max(300, "Description must be less than 300 characters")
})

export const updateTransaction = createServerFn({
  method: 'POST',
}).middleware([authMiddleware]).validator(
  (data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({data, context}) => {
    await db.update(transactionsTable).set({
      userId: context.userId,
      amount: data.amount.toString(),
      description: data.transactionDescription,
      categoryId: data.categoryId
    }).where(and(
      eq(transactionsTable.id, data.transactionId),
      eq(transactionsTable.userId, context.userId)))
  })