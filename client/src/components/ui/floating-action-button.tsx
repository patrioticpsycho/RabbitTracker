import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { FaPaw } from "react-icons/fa";
import { Heart, DollarSign, Scissors } from "lucide-react";

interface FloatingActionButtonProps {
  onAddRabbit?: () => void;
  onAddBreeding?: () => void;
  onAddExpense?: () => void;
  onAddButcher?: () => void;
}

export function FloatingActionButton({
  onAddRabbit,
  onAddBreeding,
  onAddExpense,
  onAddButcher
}: FloatingActionButtonProps) {
  const [open, setOpen] = useState(false);

  const AddMenu = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New</h2>
      
      <div className="space-y-3">
        <Button 
          onClick={() => {
            onAddRabbit?.();
            setOpen(false);
          }}
          className="w-full justify-start h-12"
          variant="outline"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <FaPaw className="text-primary" />
          </div>
          Add Rabbit
        </Button>
        
        <Button 
          onClick={() => {
            onAddBreeding?.();
            setOpen(false);
          }}
          className="w-full justify-start h-12"
          variant="outline"
        >
          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
            <Heart className="text-secondary" />
          </div>
          Record Breeding
        </Button>
        
        <Button 
          onClick={() => {
            onAddExpense?.();
            setOpen(false);
          }}  
          className="w-full justify-start h-12"
          variant="outline"
        >
          <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center mr-3">
            <DollarSign className="text-warning" />
          </div>
          Add Expense
        </Button>
        
        <Button 
          onClick={() => {
            onAddButcher?.();
            setOpen(false);
          }}
          className="w-full justify-start h-12"
          variant="outline"
        >
          <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center mr-3">
            <Scissors className="text-error" />
          </div>
          Record Butchering
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg"
        >
          <Plus className="text-xl" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[50vh]">
        <AddMenu />
      </SheetContent>
    </Sheet>
  );
}
