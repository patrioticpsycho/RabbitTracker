import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaPaw } from "react-icons/fa";
import { Heart } from "lucide-react";
import { format } from "date-fns";
import type { Rabbit } from "@shared/schema";

interface RabbitCardProps {
  rabbit: Rabbit;
  onEdit: (rabbit: Rabbit) => void;
}

export function RabbitCard({ rabbit, onEdit }: RabbitCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'sold': return 'bg-info';
      case 'butchered': return 'bg-error';
      case 'deceased': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Healthy';
      case 'sold': return 'Sold';
      case 'butchered': return 'Butchered';
      case 'deceased': return 'Deceased';
      default: return status;
    }
  };

  const calculateAge = (birthDate: string) => {
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

  const isTooYoungToBreed = () => {
    const birth = new Date(rabbit.birthDate);
    const today = new Date();
    const monthsDiff = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return monthsDiff < 6; // Assuming 6 months minimum breeding age
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <FaPaw className="text-primary text-lg" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{rabbit.name}</h3>
              <Badge variant={rabbit.gender === 'female' ? 'secondary' : 'default'}>
                {rabbit.gender === 'female' ? '♀' : '♂'}
              </Badge>
              {rabbit.isBreeder && (
                <Badge variant="outline">
                  <Heart className="w-3 h-3 mr-1" />
                  Breeder
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{rabbit.breed}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Born: {format(new Date(rabbit.birthDate), 'MMM d, yyyy')} • 
              Age: {calculateAge(rabbit.birthDate)} • 
              Weight: {rabbit.weight ? `${rabbit.weight} lbs` : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-block w-2 h-2 ${getStatusColor(rabbit.status)} rounded-full`}></span>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{getStatusText(rabbit.status)}</p>
          </div>
        </div>
        
        <div className="mt-3 flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(rabbit)}>
            View
          </Button>
          {rabbit.status === 'active' && (
            <Button 
              size="sm" 
              variant="outline"
              disabled={isTooYoungToBreed()}
              className={isTooYoungToBreed() ? "opacity-50" : ""}
            >
              {isTooYoungToBreed() ? "Too Young" : "Breed"}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onEdit(rabbit)}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
