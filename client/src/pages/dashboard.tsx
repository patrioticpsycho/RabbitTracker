import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FaPaw } from "react-icons/fa";
import { Heart, DollarSign, Calendar, Plus, Syringe } from "lucide-react";

import { useState } from "react";
import { RabbitForm } from "@/components/forms/rabbit-form";
import { BreedingForm } from "@/components/forms/breeding-form";
import { ExpenseForm } from "@/components/forms/expense-form";
import { format } from "date-fns";

interface Stats {
  totalRabbits: number;
  activeBreeders: number;
  littersDue: number;
  monthlyExpenses: string;
}

export default function Dashboard() {
  const [showRabbitForm, setShowRabbitForm] = useState(false);
  const [showBreedingForm, setShowBreedingForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: rabbits = [] } = useQuery({
    queryKey: ["/api/rabbits"],
  });

  const { data: breedingRecords = [] } = useQuery({
    queryKey: ["/api/breeding-records"],
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["/api/expenses"],
  });

  // Recent activity (last 5 items)
  const recentActivity = [
    ...rabbits.slice(-2).map((rabbit: any) => ({
      type: 'rabbit',
      icon: Plus,
      bgColor: 'bg-primary',
      title: 'New rabbit added',
      subtitle: `${rabbit.name} - ${rabbit.breed}`,
      time: format(new Date(rabbit.createdAt), 'MMM d, yyyy')
    })),
    ...breedingRecords.slice(-2).map((record: any) => ({
      type: 'breeding',
      icon: Heart,
      bgColor: 'bg-secondary',
      title: 'Breeding recorded',
      subtitle: `Record #${record.id}`,
      time: format(new Date(record.createdAt), 'MMM d, yyyy')
    })),
    ...expenses.slice(-1).map((expense: any) => ({
      type: 'expense',
      icon: DollarSign,
      bgColor: 'bg-info',
      title: 'Expense added',
      subtitle: `${expense.description} - $${expense.amount}`,
      time: format(new Date(expense.createdAt), 'MMM d, yyyy')
    }))
  ].slice(-3);

  // Upcoming events
  const upcomingEvents = breedingRecords
    .filter((record: any) => record.status === 'expecting')
    .map((record: any) => {
      const expectedDate = new Date(record.expectedKindleDate);
      const today = new Date();
      const daysUntil = Math.ceil((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        title: 'Kindle Due',
        subtitle: `Record #${record.id}`,
        time: daysUntil <= 1 ? 'Tomorrow' : `In ${daysUntil} days`,
        urgent: daysUntil <= 1,
        icon: Calendar
      };
    }).slice(0, 2);

  if (statsLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rabbits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalRabbits || 0}
                </p>
              </div>
              <FaPaw className="text-primary text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Breeders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.activeBreeders || 0}
                </p>
              </div>
              <Heart className="text-error text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats?.monthlyExpenses || '0.00'}
                </p>
              </div>
              <DollarSign className="text-warning text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Litters Due</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.littersDue || 0}
                </p>
              </div>
              <Calendar className="text-info text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="p-4 flex items-center space-x-3">
                    <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className="text-white text-xs" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.subtitle} • {activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {upcomingEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={index} className="p-4 flex items-center space-x-3">
                    <div className={`w-10 h-10 ${event.urgent ? 'bg-error' : 'bg-warning'} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`${event.urgent ? 'text-error' : 'text-warning'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.subtitle} • {event.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.urgent 
                        ? 'bg-error bg-opacity-10 text-error' 
                        : 'bg-warning bg-opacity-10 text-warning'
                    }`}>
                      {event.urgent ? 'Due' : 'Soon'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Forms */}
      <RabbitForm 
        open={showRabbitForm} 
        onOpenChange={setShowRabbitForm}
      />
      
      <BreedingForm
        open={showBreedingForm}
        onOpenChange={setShowBreedingForm}
      />

      <ExpenseForm
        open={showExpenseForm}
        onOpenChange={setShowExpenseForm}
      />
    </div>
  );
}
