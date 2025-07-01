import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { RabbitCard } from "@/components/cards/rabbit-card";
import { RabbitForm } from "@/components/forms/rabbit-form";
import { RabbitDetailDialog } from "@/components/dialogs/rabbit-detail-dialog";

import type { Rabbit } from "@shared/schema";

export default function Rabbits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRabbit, setEditingRabbit] = useState<Rabbit | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRabbit, setSelectedRabbit] = useState<Rabbit | null>(null);

  const { data: rabbits = [], isLoading } = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  const filteredRabbits = rabbits.filter(rabbit =>
    rabbit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rabbit.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (rabbit: Rabbit) => {
    setSelectedRabbit(rabbit);
    setShowDetailDialog(true);
  };

  const handleEdit = (rabbit: Rabbit) => {
    setEditingRabbit(rabbit);
    setShowForm(true);
  };

  const handleBreed = (rabbit: Rabbit) => {
    // For now, let's navigate to the breeding page
    // In the future, this could open a breeding form dialog
    window.location.href = '/breeding';
  };

  const handleFormClose = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditingRabbit(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with search and add button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rabbits</h1>
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Rabbit
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search rabbits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Rabbits List */}
      <div className="space-y-3">
        {filteredRabbits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "No rabbits found matching your search." : "No rabbits added yet."}
            </p>
          </div>
        ) : (
          filteredRabbits.map((rabbit) => (
            <RabbitCard
              key={rabbit.id}
              rabbit={rabbit}
              onEdit={handleView}
              onBreed={handleBreed}
            />
          ))
        )}
      </div>



      <RabbitDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        rabbit={selectedRabbit}
        onEdit={handleEdit}
      />

      <RabbitForm
        open={showForm}
        onOpenChange={handleFormClose}
        rabbit={editingRabbit}
      />
    </div>
  );
}
