import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BreedingRecord, InsertBreedingRecord, Offspring, InsertOffspring } from "@shared/schema";

export function useBreedingRecords() {
  const { toast } = useToast();

  const breedingQuery = useQuery<BreedingRecord[]>({
    queryKey: ["/api/breeding-records"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBreedingRecord) => apiRequest("POST", "/api/breeding-records", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breeding-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Breeding record added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertBreedingRecord> }) =>
      apiRequest("PUT", `/api/breeding-records/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breeding-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Breeding record updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/breeding-records/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breeding-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Breeding record deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const activeRecords = breedingQuery.data?.filter(record => 
    record.status === 'expecting' || record.status === 'kindled'
  ) || [];

  const historyRecords = breedingQuery.data?.filter(record => 
    record.status === 'weaned' || record.status === 'failed'
  ) || [];

  const expectingRecords = breedingQuery.data?.filter(record => record.status === 'expecting') || [];

  return {
    breedingRecords: breedingQuery.data || [],
    activeRecords,
    historyRecords,
    expectingRecords,
    isLoading: breedingQuery.isLoading,
    error: breedingQuery.error,
    createBreedingRecord: createMutation.mutate,
    updateBreedingRecord: updateMutation.mutate,
    deleteBreedingRecord: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useOffspring(breedingRecordId?: number) {
  const { toast } = useToast();

  const offspringQuery = useQuery<Offspring[]>({
    queryKey: breedingRecordId ? ["/api/offspring", breedingRecordId] : ["/api/offspring"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertOffspring) => apiRequest("POST", "/api/offspring", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offspring"] });
      toast({ title: "Offspring record added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertOffspring> }) =>
      apiRequest("PUT", `/api/offspring/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offspring"] });
      toast({ title: "Offspring record updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    offspring: offspringQuery.data || [],
    isLoading: offspringQuery.isLoading,
    error: offspringQuery.error,
    createOffspring: createMutation.mutate,
    updateOffspring: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
