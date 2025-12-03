import { useState, useEffect, useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { Expense } from "@/components/expense.component";

export interface BudgetAlert {
  category: string;
  spent: number;
  budget: number;
  overBudget: number;
  percentage: number;
}

export function useBudgetAlerts(expenses: Expense[]) {
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/protected/budgets");
        const result = await response.json();
        if (response.ok) {
          setBudgets(result.data || {});
        }
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Calculate current month expenses by category
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return expenses.filter((expense) => {
      if (!expense.internalDate) return false;
      const expenseDate = new Date(expense.internalDate);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });
  }, [expenses]);

  // Calculate category totals for current month
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    currentMonthExpenses.forEach((expense) => {
      const category = expense.category || "Others";
      totals[category] = (totals[category] || 0) + expense.amount;
    });
    return totals;
  }, [currentMonthExpenses]);

  // Check for budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts: BudgetAlert[] = [];

    Object.entries(categoryTotals).forEach(([category, spent]) => {
      const budget = budgets[category];
      if (budget && budget > 0 && spent > budget) {
        alerts.push({
          category,
          spent,
          budget,
          overBudget: spent - budget,
          percentage: Math.round((spent / budget) * 100),
        });
      }
    });

    return alerts.sort((a, b) => b.overBudget - a.overBudget);
  }, [categoryTotals, budgets]);

  // Get budget status for a specific category
  const getCategoryBudgetStatus = (category: string) => {
    const spent = categoryTotals[category] || 0;
    const budget = budgets[category] || 0;
    
    if (budget === 0) {
      return { hasBudget: false, spent, budget, percentage: 0, overBudget: 0 };
    }

    return {
      hasBudget: true,
      spent,
      budget,
      percentage: Math.round((spent / budget) * 100),
      overBudget: spent - budget,
      isOverBudget: spent > budget,
    };
  };

  return {
    budgetAlerts,
    budgets,
    categoryTotals,
    loading,
    getCategoryBudgetStatus,
  };
}

