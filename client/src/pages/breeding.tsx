import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BreedingCard } from "@/components/cards/breeding-card";
import { BreedingForm } from "@/components/forms/breeding-form";

import type { BreedingRecord, Rabbit } from "@shared/schema";

export default function Breeding() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BreedingRecord | null>(null);
  const [preSelectedRabbit, setPreSelectedRabbit] = useState<Rabbit | null>(null);

  const { data: breedingRecords = [], isLoading } = useQuery<BreedingRecord[]>({
    queryKey: ["/api/breeding-records"],
  });

  const { data: rabbits = [] } = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  // Check for URL parameters to pre-select a rabbit
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rabbitId = urlParams.get('rabbitId');
    
    if (rabbitId && rabbits.length > 0) {
      const rabbit = rabbits.find(r => r.id === parseInt(rabbitId));
      if (rabbit) {
        setPreSelectedRabbit(rabbit);
        setShowForm(true);
        // Clear the URL parameter
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [rabbits]);

  const activeRecords = breedingRecords.filter(record => 
    record.status === 'expecting' || record.status === 'kindled'
  );

  const historyRecords = breedingRecords.filter(record => 
    record.status === 'weaned' || record.status === 'failed'
  );

  const displayRecords = activeTab === "active" ? activeRecords : historyRecords;

  const handleEdit = (record: BreedingRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecord(null);
    setPreSelectedRabbit(null);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ml-1"></div>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with add button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Breeding</h1>
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <Button
          variant={activeTab === "active" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("active")}
        >
          Active
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("history")}
        >
          History
        </Button>
      </div>

      {/* Breeding Records */}
      <div className="space-y-3">
        {displayRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === "active" 
                ? "No active breeding records." 
                : "No breeding history yet."}
            </p>
          </div>
        ) : (
          displayRecords.map((record) => (
            <BreedingCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>



      <BreedingForm
        open={showForm}
        onOpenChange={handleFormClose}
        record={editingRecord}
        preSelectedRabbit={preSelectedRabbit}
      />
    </div>
  );
}
