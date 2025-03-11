import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { addDays } from "date-fns";
import authMiddleware from "@/authMiddleware";

export const transactionSchema = z.object({
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
    .max(300, "Description must be less than 300 characters"),
})

export const createTransaction = createServerFn({
  method: "POST"
  // run middleware here
}).middleware([authMiddleware])
.validator((data: z.infer<typeof transactionSchema>) => {
  console.log('validator data', data)
  return transactionSchema.parse(data)
}).handler(async ({ context, data }) => {
  console.log('context', context)
  console.log('handler data', data)
  const userId = context.userId
  const transaction =await db.insert(transactionsTable).values({
    userId,
    type: data.transactionType,
    amount: data.amount.toString(),
    description: data.transactionDescription,
    categoryId: data.categoryId,
    transactionDate: data.transactionDate
  }).returning()

  return transaction
})