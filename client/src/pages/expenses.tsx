import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ExpenseCard } from "@/components/cards/expense-card";
import { ExpenseForm } from "@/components/forms/expense-form";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import type { Expense } from "@shared/schema";

export default function Expenses() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  // Calculate monthly totals
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const lastMonthExpenses = expenses.filter(e => e.date.startsWith(lastMonth));
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
  
  // Calculate 3-month average
  const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().slice(0, 7);
  const threeMonthExpenses = expenses.filter(e => 
    e.date >= threeMonthsAgo && e.date <= currentMonth
  );
  const threeMonthTotal = threeMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
  const threeMonthAverage = threeMonthTotal / 3;

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border mb-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Expense Summary */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${thisMonthTotal.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${lastMonthTotal.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${threeMonthAverage.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">3-Mo Avg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses by Category */}
      <div className="space-y-3">
        {Object.keys(expensesByCategory).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
          </div>
        ) : (
          Object.entries(expensesByCategory).map(([category, categoryExpenses]) => {
            const categoryTotal = categoryExpenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
            
            return (
              <ExpenseCard
                key={category}
                category={category}
                expenses={categoryExpenses}
                total={categoryTotal}
                onEdit={handleEdit}
              />
            );
          })
        )}
      </div>

      <FloatingActionButton
        onAddExpense={() => setShowForm(true)}
      />

      <ExpenseForm
        open={showForm}
        onOpenChange={handleFormClose}
        expense={editingExpense}
      />
    </div>
  );
}
