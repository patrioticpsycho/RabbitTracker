import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import type { Expense } from "@shared/schema";

interface ExpenseCardProps {
  category: string;
  expenses: Expense[];
  total: number;
  onEdit: (expense: Expense) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'feed':
      return 'fas fa-seedling';
    case 'veterinary':
      return 'fas fa-syringe';
    case 'equipment':
      return 'fas fa-box';
    case 'supplies':
      return 'fas fa-tools';
    default:
      return 'fas fa-dollar-sign';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'feed':
      return 'bg-primary/10 text-primary';
    case 'veterinary':
      return 'bg-info/10 text-info';
    case 'equipment':
      return 'bg-warning/10 text-warning';
    case 'supplies':
      return 'bg-secondary/10 text-secondary';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
};

export function ExpenseCard({ category, expenses, total, onEdit }: ExpenseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const iconClass = getCategoryIcon(category);
  const colorClass = getCategoryColor(category);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center`}>
                  <i className={`${iconClass} text-sm`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {formatCategoryName(category)}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {expenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  onClick={() => onEdit(expense)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                      {expense.vendor && ` • ${expense.vendor}`}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${expense.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
