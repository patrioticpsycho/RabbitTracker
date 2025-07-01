import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { BreedingRecord, Offspring, ButcherRecord, Rabbit } from "@shared/schema";

export default function Records() {
  const [activeTab, setActiveTab] = useState<"offspring" | "butcher" | "genealogy">("offspring");

  const { data: breedingRecords = [] } = useQuery<BreedingRecord[]>({
    queryKey: ["/api/breeding-records"],
  });

  const { data: offspring = [] } = useQuery<Offspring[]>({
    queryKey: ["/api/offspring"],
  });

  const { data: butcherRecords = [] } = useQuery<ButcherRecord[]>({
    queryKey: ["/api/butcher-records"],
  });

  const { data: rabbits = [] } = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  // Group offspring by breeding record
  const offspringByBreeding = breedingRecords.map(record => {
    const recordOffspring = offspring.filter(o => o.breedingRecordId === record.id);
    const mother = rabbits.find(r => r.id === record.motherId);
    const father = rabbits.find(r => r.id === record.fatherId);
    
    return {
      ...record,
      offspring: recordOffspring,
      motherName: mother?.name || 'Unknown',
      fatherName: father?.name || 'Unknown'
    };
  }).filter(record => record.offspring.length > 0);

  const renderOffspringTab = () => (
    <div className="space-y-3">
      {offspringByBreeding.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No offspring records yet.</p>
        </div>
      ) : (
        offspringByBreeding.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Litter #{record.id}
                </h3>
                <Badge variant={
                  record.status === 'weaned' ? 'default' : 
                  record.status === 'kindled' ? 'secondary' : 'outline'
                }>
                  {record.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Parents:</span>
                  <span className="font-medium">{record.motherName} × {record.fatherName}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Born:</span>
                  <span className="font-medium">
                    {record.actualKindleDate ? format(new Date(record.actualKindleDate), 'MMM d, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Litter Size:</span>
                  <span className="font-medium">{record.litterSize || 0} kits</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Offspring:</span>
                  <span className="font-medium text-success">{record.offspring.length} recorded</span>
                </div>
              </div>

              {record.offspring.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Offspring Status:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(record.offspring.reduce((acc, off) => {
                      const status = off.status;
                      acc[status] = (acc[status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).map(([status, count]) => (
                      <Badge key={status} variant="outline" className="text-xs">
                        {count} {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderButcherTab = () => (
    <div className="space-y-3">
      {butcherRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No butchering records yet.</p>
        </div>
      ) : (
        butcherRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Butcher Record #{record.id}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(record.butcherDate), 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {record.liveWeight && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Live Weight:</span>
                    <span className="font-medium">{record.liveWeight} lbs</span>
                  </div>
                )}
                {record.dressedWeight && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Dressed Weight:</span>
                    <span className="font-medium">{record.dressedWeight} lbs</span>
                  </div>
                )}
                {record.totalValue && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Total Value:</span>
                    <span className="font-medium">${record.totalValue}</span>
                  </div>
                )}
                {record.processingNotes && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
                    <p className="text-sm text-gray-900 dark:text-white">{record.processingNotes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderGenealogyTab = () => (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-gray-400">Family tree feature coming soon.</p>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <Button
          variant={activeTab === "offspring" ? "default" : "ghost"}
          className="flex-1 py-2 px-2 text-xs font-medium"
          onClick={() => setActiveTab("offspring")}
        >
          Offspring
        </Button>
        <Button
          variant={activeTab === "butcher" ? "default" : "ghost"}
          className="flex-1 py-2 px-2 text-xs font-medium"
          onClick={() => setActiveTab("butcher")}
        >
          Butcher
        </Button>
        <Button
          variant={activeTab === "genealogy" ? "default" : "ghost"}
          className="flex-1 py-2 px-2 text-xs font-medium"
          onClick={() => setActiveTab("genealogy")}
        >
          Family Tree
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "offspring" && renderOffspringTab()}
      {activeTab === "butcher" && renderButcherTab()}
      {activeTab === "genealogy" && renderGenealogyTab()}
    </div>
  );
}
