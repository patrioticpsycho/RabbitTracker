import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaPaw, FaEdit } from "react-icons/fa";
import { Heart, Calendar, Weight, Palette, FileText } from "lucide-react";
import { format } from "date-fns";
import type { Rabbit } from "@shared/schema";

interface RabbitDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rabbit: Rabbit | null;
  onEdit: (rabbit: Rabbit) => void;
}

export function RabbitDetailDialog({ open, onOpenChange, rabbit, onEdit }: RabbitDetailDialogProps) {
  if (!rabbit) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'sold': return 'bg-blue-500';
      case 'butchered': return 'bg-red-500';
      case 'deceased': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Healthy & Active';
      case 'sold': return 'Sold';
      case 'butchered': return 'Butchered';
      case 'deceased': return 'Deceased';
      default: return status;
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    const monthsDiff = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (monthsDiff < 12) {
      return `${monthsDiff} months`;
    } else {
      const years = Math.floor(monthsDiff / 12);
      const remainingMonths = monthsDiff % 12;
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(rabbit);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {rabbit.photoUrl ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={rabbit.photoUrl} 
                  alt={`Photo of ${rabbit.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <FaPaw className="text-primary text-sm" />
              </div>
            )}
            {rabbit.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Section */}
          {rabbit.photoUrl && (
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                <img 
                  src={rabbit.photoUrl} 
                  alt={`Photo of ${rabbit.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Gender:</span>
                <Badge variant={rabbit.gender === 'female' ? 'secondary' : 'default'}>
                  {rabbit.gender === 'female' ? '♀ Female' : '♂ Male'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 ${getStatusColor(rabbit.status)} rounded-full`}></span>
                  <span className="text-sm">{getStatusText(rabbit.status)}</span>
                </div>
              </div>

              {rabbit.isBreeder && (
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Breeding Rabbit</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Breed:</span>
                <span className="text-sm">{rabbit.breed}</span>
              </div>

              {rabbit.color && (
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="text-sm">{rabbit.color}</span>
                </div>
              )}

              {rabbit.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  <span className="text-sm">{rabbit.weight} lbs</span>
                </div>
              )}
            </div>
          </div>

          {/* Date Info */}
          {rabbit.birthDate && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Calendar className="w-4 h-4" />
              <div>
                <span className="text-sm font-medium">Born:</span>
                <span className="text-sm ml-2">{format(new Date(rabbit.birthDate), 'MMM d, yyyy')}</span>
                <span className="text-sm text-gray-500 ml-2">({calculateAge(rabbit.birthDate)} old)</span>
              </div>
            </div>
          )}

          {/* Notes */}
          {rabbit.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Notes:</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {rabbit.notes}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleEdit} className="flex-1" size="sm">
              <FaEdit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}