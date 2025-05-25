import { PrismaClient, TransactionType, BudgetType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Updates the corresponding budget when a transaction is created or updated
 */
export const updateBudgetForTransaction = async (
  transaction: any,
  isNew: boolean = true,
  oldTransaction: any = null
) => {
  try {
    // If no category, nothing to update
    if (!transaction.category) return;

    // Find any budget that matches the transaction category
    const budget = await prisma.budget.findFirst({
      where: {
        userId: transaction.userId,
        category: transaction.category,
      },
    });

    // If no matching budget, nothing to update
    if (!budget) return;

    // Determine if we should update based on transaction type and budget type
    const shouldUpdateBudget =
      (transaction.type === TransactionType.WITHDRAWAL &&
        budget.type === BudgetType.EXPENSE) ||
      (transaction.type === TransactionType.DEPOSIT &&
        budget.type === BudgetType.SAVINGS);

    if (!shouldUpdateBudget) return;

    // Calculate new amount
    let newAmount = budget.amount || 0;

    if (isNew) {
      // For new transactions, simply add the amount
      newAmount += transaction.amount;
    } else if (oldTransaction) {
      // For updates, subtract old amount and add new amount
      // Only if the transaction type and category remain relevant to this budget
      const oldTransactionAffectedBudget =
        (oldTransaction.type === TransactionType.WITHDRAWAL &&
          budget.type === BudgetType.EXPENSE) ||
        (oldTransaction.type === TransactionType.DEPOSIT &&
          budget.type === BudgetType.SAVINGS);

      if (oldTransactionAffectedBudget && oldTransaction.category === budget.category) {
        newAmount -= oldTransaction.amount;
      }
      newAmount += transaction.amount;
    }

    // Update the budget
    await prisma.budget.update({
      where: { id: budget.id },
      data: { amount: newAmount },
    });
  } catch (error) {
    console.error("Error updating budget for transaction:", error);
  }
};

/**
 * Updates the corresponding budget when a transaction is deleted
 */
export const updateBudgetForDeletedTransaction = async (transaction: any) => {
  try {
    // If no category, nothing to update
    if (!transaction.category) return;

    // Find any budget that matches the transaction category
    const budget = await prisma.budget.findFirst({
      where: {
        userId: transaction.userId,
        category: transaction.category,
      },
    });

    // If no matching budget, nothing to update
    if (!budget) return;

    // Determine if we should update based on transaction type and budget type
    const shouldUpdateBudget =
      (transaction.type === TransactionType.WITHDRAWAL &&
        budget.type === BudgetType.EXPENSE) ||
      (transaction.type === TransactionType.DEPOSIT &&
        budget.type === BudgetType.SAVINGS);

    if (!shouldUpdateBudget) return;

    // Calculate new amount by subtracting the transaction amount
    const newAmount = (budget.amount || 0) - transaction.amount;

    // Update the budget
    await prisma.budget.update({
      where: { id: budget.id },
      data: { amount: newAmount },
    });
  } catch (error) {
    console.error("Error updating budget for deleted transaction:", error);
  }
};