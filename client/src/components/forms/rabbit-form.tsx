import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { insertRabbitSchema, type Rabbit, type InsertRabbit } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RabbitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rabbit?: Rabbit | null;
}

export function RabbitForm({ open, onOpenChange, rabbit }: RabbitFormProps) {
  const { toast } = useToast();
  const isEditing = !!rabbit;

  const { data: rabbits = [] } = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  const form = useForm<InsertRabbit>({
    resolver: zodResolver(insertRabbitSchema),
    defaultValues: {
      name: rabbit?.name || "",
      breed: rabbit?.breed || "",
      gender: rabbit?.gender || "female",
      birthDate: rabbit?.birthDate || "",
      weight: rabbit?.weight || "",
      color: rabbit?.color || "",
      status: rabbit?.status || "active",
      isBreeder: rabbit?.isBreeder || false,
      motherId: rabbit?.motherId || undefined,
      fatherId: rabbit?.fatherId || undefined,
      notes: rabbit?.notes || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertRabbit) => apiRequest("POST", "/api/rabbits", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rabbits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Rabbit added successfully!" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertRabbit) => apiRequest("PUT", `/api/rabbits/${rabbit!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rabbits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Rabbit updated successfully!" });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertRabbit) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const femaleRabbits = rabbits.filter(r => r.gender === 'female' && r.id !== rabbit?.id);
  const maleRabbits = rabbits.filter(r => r.gender === 'male' && r.id !== rabbit?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Rabbit" : "Add New Rabbit"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter rabbit name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Zealand White" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="butchered">Butchered</SelectItem>
                        <SelectItem value="deceased">Deceased</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="4.2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., White, Brown, Mixed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBreeder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Breeding Rabbit
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="motherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))} defaultValue={field.value?.toString() || "none"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mother" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {femaleRabbits.map((rabbit) => (
                          <SelectItem key={rabbit.id} value={rabbit.id.toString()}>
                            {rabbit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))} defaultValue={field.value?.toString() || "none"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select father" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {maleRabbits.map((rabbit) => (
                          <SelectItem key={rabbit.id} value={rabbit.id.toString()}>
                            {rabbit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : isEditing ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
