import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { insertBreedingRecordSchema, type BreedingRecord, type InsertBreedingRecord, type Rabbit } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";

interface BreedingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: BreedingRecord | null;
  preSelectedRabbit?: Rabbit | null;
}

export function BreedingForm({ open, onOpenChange, record, preSelectedRabbit }: BreedingFormProps) {
  const { toast } = useToast();
  const isEditing = !!record;

  const { data: rabbits = [] } = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  const getDefaultMotherId = () => {
    if (record?.motherId) return record.motherId;
    if (preSelectedRabbit?.gender === 'female') return preSelectedRabbit.id;
    return undefined;
  };

  const getDefaultFatherId = () => {
    if (record?.fatherId) return record.fatherId;
    if (preSelectedRabbit?.gender === 'male') return preSelectedRabbit.id;
    return undefined;
  };

  const form = useForm<InsertBreedingRecord>({
    resolver: zodResolver(insertBreedingRecordSchema),
    defaultValues: {
      motherId: getDefaultMotherId(),
      fatherId: getDefaultFatherId(),
      matingDate: record?.matingDate || format(new Date(), 'yyyy-MM-dd'),
      expectedKindleDate: record?.expectedKindleDate || format(addDays(new Date(), 31), 'yyyy-MM-dd'),
      actualKindleDate: record?.actualKindleDate || "",
      nestBoxDate: record?.nestBoxDate || "",
      litterSize: record?.litterSize || undefined,
      kitsAlive: record?.kitsAlive || undefined,
      status: record?.status || "expecting",
      notes: record?.notes || "",
    },
  });

  // Update form when preSelectedRabbit or record changes
  useEffect(() => {
    const newValues = {
      motherId: getDefaultMotherId(),
      fatherId: getDefaultFatherId(),
      matingDate: record?.matingDate || format(new Date(), 'yyyy-MM-dd'),
      expectedKindleDate: record?.expectedKindleDate || format(addDays(new Date(), 31), 'yyyy-MM-dd'),
      actualKindleDate: record?.actualKindleDate || "",
      nestBoxDate: record?.nestBoxDate || "",
      litterSize: record?.litterSize || undefined,
      kitsAlive: record?.kitsAlive || undefined,
      status: record?.status || "expecting",
      notes: record?.notes || "",
    };
    form.reset(newValues);
  }, [record, preSelectedRabbit, form]);

  const createMutation = useMutation({
    mutationFn: (data: InsertBreedingRecord) => apiRequest("POST", "/api/breeding-records", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breeding-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Breeding record added successfully!" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertBreedingRecord) => apiRequest("PUT", `/api/breeding-records/${record!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breeding-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Breeding record updated successfully!" });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertBreedingRecord) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Auto-calculate expected kindle date when mating date changes
  const handleMatingDateChange = (date: string) => {
    if (date) {
      const expectedKindle = addDays(new Date(date), 31);
      form.setValue('expectedKindleDate', format(expectedKindle, 'yyyy-MM-dd'));
    }
  };

  const femaleRabbits = rabbits.filter(r => r.gender === 'female' && r.status === 'active' && r.isBreeder);
  const maleRabbits = rabbits.filter(r => r.gender === 'male' && r.status === 'active' && r.isBreeder);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Breeding Record" : "Record New Breeding"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="motherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mother" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select father" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="matingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mating Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleMatingDateChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedKindleDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Kindle</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="expecting">Expecting</SelectItem>
                      <SelectItem value="kindled">Kindled</SelectItem>
                      <SelectItem value="weaned">Weaned</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(form.watch('status') === 'kindled' || form.watch('status') === 'weaned') && (
              <>
                <FormField
                  control={form.control}
                  name="actualKindleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Kindle Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="litterSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Litter Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="8"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kitsAlive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kits Alive</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="7"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="nestBoxDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nest Box Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} value={field.value || ""} />
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
