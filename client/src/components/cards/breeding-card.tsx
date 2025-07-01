import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import type { BreedingRecord, Rabbit } from "@shared/schema";

interface BreedingCardProps {
  record: BreedingRecord;
  onEdit: (record: BreedingRecord) => void;
}

export function BreedingCard({ record, onEdit }: BreedingCardProps) {
  const { data: rabbits = [] } = useQuery<Rabbit[]>({
    queryKey: ["/api/rabbits"],
  });

  const mother = rabbits.find(r => r.id === record.motherId);
  const father = rabbits.find(r => r.id === record.fatherId);

  const getDaysFromMating = () => {
    return differenceInDays(new Date(), new Date(record.matingDate));
  };

  const getDaysUntilKindle = () => {
    return differenceInDays(new Date(record.expectedKindleDate), new Date());
  };

  const getStatusBadge = () => {
    const daysUntil = getDaysUntilKindle();
    const status = record.status;

    if (status === 'expecting') {
      if (daysUntil <= 1) {
        return <Badge className="bg-error/10 text-error">Due {daysUntil === 0 ? 'Today' : 'Tomorrow'}</Badge>;
      } else if (daysUntil <= 3) {
        return <Badge className="bg-warning/10 text-warning">Due Soon</Badge>;
      } else {
        return <Badge className="bg-info/10 text-info">{daysUntil} days left</Badge>;
      }
    }

    switch (status) {
      case 'kindled':
        return <Badge className="bg-success/10 text-success">Kindled</Badge>;
      case 'weaned':
        return <Badge className="bg-primary/10 text-primary">Weaned</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDaysBadge = () => {
    const days = getDaysFromMating();
    if (days <= 31) {
      return <Badge className="bg-secondary/20 text-secondary">Day {days}</Badge>;
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {mother?.name || 'Unknown'} × {father?.name || 'Unknown'}
            </h3>
            {getDaysBadge()}
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Mating Date:</span>
            <span className="font-medium">{format(new Date(record.matingDate), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span>Expected Kindle:</span>
            <span className="font-medium">{format(new Date(record.expectedKindleDate), 'MMM d, yyyy')}</span>
          </div>
          {record.actualKindleDate && (
            <div className="flex justify-between">
              <span>Actual Kindle:</span>
              <span className="font-medium">{format(new Date(record.actualKindleDate), 'MMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Nest Box:</span>
            <span className={`font-medium ${record.nestBoxDate ? 'text-success' : 'text-gray-400'}`}>
              {record.nestBoxDate ? `✓ ${format(new Date(record.nestBoxDate), 'MMM d')}` : 'Pending'}
            </span>
          </div>
          {record.litterSize && (
            <div className="flex justify-between">
              <span>Litter Size:</span>
              <span className="font-medium">{record.litterSize} kits</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex space-x-2">
          {record.status === 'expecting' && getDaysUntilKindle() <= 1 && (
            <Button size="sm" className="bg-primary/10 text-primary">
              Record Birth
            </Button>
          )}
          {record.status === 'expecting' && !record.nestBoxDate && getDaysUntilKindle() <= 7 && (
            <Button size="sm" className="bg-secondary/10 text-secondary">
              Add Nest Box
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onEdit(record)}>
            Add Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
