import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Rabbit, InsertRabbit } from "@shared/schema";

export function useRabbits() {
  const { toast } = useToast();

  const rabbitsQuery = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertRabbit) => apiRequest("POST", "/api/rabbits", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rabbits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Rabbit added successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertRabbit> }) =>
      apiRequest("PUT", `/api/rabbits/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rabbits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Rabbit updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/rabbits/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rabbits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Rabbit deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const activeRabbits = rabbitsQuery.data?.filter(rabbit => rabbit.status === 'active') || [];
  const breedingRabbits = rabbitsQuery.data?.filter(rabbit => rabbit.isBreeder && rabbit.status === 'active') || [];
  const femaleBreedingRabbits = breedingRabbits.filter(rabbit => rabbit.gender === 'female');
  const maleBreedingRabbits = breedingRabbits.filter(rabbit => rabbit.gender === 'male');

  return {
    rabbits: rabbitsQuery.data || [],
    activeRabbits,
    breedingRabbits,
    femaleBreedingRabbits,
    maleBreedingRabbits,
    isLoading: rabbitsQuery.isLoading,
    error: rabbitsQuery.error,
    createRabbit: createMutation.mutate,
    updateRabbit: updateMutation.mutate,
    deleteRabbit: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useRabbit(id?: number) {
  return useQuery<Rabbit>({
    queryKey: ["/api/rabbits", id],
    enabled: !!id,
  });
}
