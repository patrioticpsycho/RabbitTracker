import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ButcherRecord, InsertButcherRecord, BreedingRecord, Offspring, Rabbit } from "@shared/schema";

export function useButcherRecords() {
  const { toast } = useToast();

  const butcherQuery = useQuery<ButcherRecord[]>({
    queryKey: ["/api/butcher-records"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertButcherRecord) => apiRequest("POST", "/api/butcher-records", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/butcher-records"] });
      toast({ title: "Butcher record added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertButcherRecord> }) =>
      apiRequest("PUT", `/api/butcher-records/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/butcher-records"] });
      toast({ title: "Butcher record updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/butcher-records/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/butcher-records"] });
      toast({ title: "Butcher record deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    butcherRecords: butcherQuery.data || [],
    isLoading: butcherQuery.isLoading,
    error: butcherQuery.error,
    createButcherRecord: createMutation.mutate,
    updateButcherRecord: updateMutation.mutate,
    deleteButcherRecord: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useOffspringRecords() {
  const breedingQuery = useQuery<BreedingRecord[]>({
    queryKey: ["/api/breeding-records"],
  });

  const offspringQuery = useQuery<Offspring[]>({
    queryKey: ["/api/offspring"],
  });

  const rabbitsQuery = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  const isLoading = breedingQuery.isLoading || offspringQuery.isLoading || rabbitsQuery.isLoading;
  const error = breedingQuery.error || offspringQuery.error || rabbitsQuery.error;

  // Group offspring by breeding record with parent information
  const offspringByBreeding = (breedingQuery.data || []).map(record => {
    const recordOffspring = (offspringQuery.data || []).filter(o => o.breedingRecordId === record.id);
    const mother = (rabbitsQuery.data || []).find(r => r.id === record.motherId);
    const father = (rabbitsQuery.data || []).find(r => r.id === record.fatherId);
    
    return {
      ...record,
      offspring: recordOffspring,
      motherName: mother?.name || 'Unknown',
      fatherName: father?.name || 'Unknown'
    };
  }).filter(record => record.offspring.length > 0);

  return {
    breedingRecords: breedingQuery.data || [],
    offspring: offspringQuery.data || [],
    rabbits: rabbitsQuery.data || [],
    offspringByBreeding,
    isLoading,
    error,
  };
}

export function useStats() {
  interface Stats {
    totalRabbits: number;
    activeBreeders: number;
    littersDue: number;
    monthlyExpenses: string;
  }

  return useQuery<Stats>({
    queryKey: ["/api/stats"],
  });
}
