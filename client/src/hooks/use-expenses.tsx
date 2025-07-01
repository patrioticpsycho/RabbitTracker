import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Expense, InsertExpense } from "@shared/schema";

export function useExpenses(startDate?: string, endDate?: string) {
  const { toast } = useToast();

  const queryKey = startDate && endDate 
    ? ["/api/expenses", { startDate, endDate }]
    : ["/api/expenses"];

  const expensesQuery = useQuery<Expense[]>({
    queryKey,
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertExpense) => apiRequest("POST", "/api/expenses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Expense added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertExpense> }) =>
      apiRequest("PUT", `/api/expenses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Expense updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Expense deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Calculate monthly totals
  const calculateMonthlyExpenses = (expenses: Expense[], month: string) => {
    return expenses
      .filter(expense => expense.date.startsWith(month))
      .reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().slice(0, 7);

  const expenses = expensesQuery.data || [];
  const thisMonthTotal = calculateMonthlyExpenses(expenses, currentMonth);
  const lastMonthTotal = calculateMonthlyExpenses(expenses, lastMonth);
  
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

  return {
    expenses,
    expensesByCategory,
    thisMonthTotal,
    lastMonthTotal,
    threeMonthAverage,
    isLoading: expensesQuery.isLoading,
    error: expensesQuery.error,
    createExpense: createMutation.mutate,
    updateExpense: updateMutation.mutate,
    deleteExpense: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
