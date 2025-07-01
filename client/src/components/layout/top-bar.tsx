import { Search, Bell } from "lucide-react";
import { FaPaw } from "react-icons/fa";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function TopBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: rabbits = [] } = useQuery({ queryKey: ["/api/rabbits"] });
  const { data: breedingRecords = [] } = useQuery({ queryKey: ["/api/breeding-records"] });

  // Filter search results
  const searchResults = searchQuery.trim() ? [
    ...rabbits.filter((rabbit: any) => 
      rabbit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rabbit.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rabbit.earTag?.toLowerCase().includes(searchQuery.toLowerCase())
    ).map((rabbit: any) => ({ type: 'rabbit', item: rabbit })),
    ...breedingRecords.filter((record: any) =>
      record.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    ).map((record: any) => ({ type: 'breeding', item: record }))
  ].slice(0, 10) : [];

  // Generate notifications based on data
  const notifications = [
    ...breedingRecords.filter((record: any) => {
      if (!record.expectedKindleDate) return false;
      const kindleDate = new Date(record.expectedKindleDate);
      const today = new Date();
      const daysDiff = Math.ceil((kindleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7 && daysDiff >= 0;
    }).map((record: any) => ({
      id: record.id,
      type: 'kindle',
      title: 'Kindle Due Soon',
      message: `Expected kindle in ${Math.ceil((new Date(record.expectedKindleDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`,
      time: new Date(record.expectedKindleDate).toLocaleDateString()
    })),
    ...rabbits.filter((rabbit: any) => {
      if (!rabbit.lastHealthCheck) return false;
      const lastCheck = new Date(rabbit.lastHealthCheck);
      const today = new Date();
      const daysDiff = Math.ceil((today.getTime() - lastCheck.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 90;
    }).map((rabbit: any) => ({
      id: rabbit.id,
      type: 'health',
      title: 'Health Check Overdue',
      message: `${rabbit.name} needs a health check`,
      time: new Date(rabbit.lastHealthCheck).toLocaleDateString()
    }))
  ];

  const handleSearchItemClick = (result: any) => {
    if (result.type === 'rabbit') {
      setLocation('/rabbits');
    } else if (result.type === 'breeding') {
      setLocation('/breeding');
    }
    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaPaw className="text-xl" />
            <h1 className="text-lg font-semibold">RabbitTracker Pro</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search 
                className="text-lg cursor-pointer hover:text-primary-foreground/80" 
                onClick={() => setShowSearch(true)}
              />
            </div>
            <div className="relative">
              <Bell 
                className="text-lg cursor-pointer hover:text-primary-foreground/80" 
                onClick={() => setShowNotifications(true)}
              />
              {notifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
                  {notifications.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search rabbits, breeding records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchResults.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSearchItemClick(result)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {result.type === 'rabbit' ? result.item.name : 'Breeding Record'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.type === 'rabbit' 
                              ? `${result.item.breed} - ${result.item.earTag}`
                              : result.item.notes?.slice(0, 50) + '...'
                            }
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {result.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-muted-foreground text-center py-4">No results found</p>
            ) : (
              <p className="text-muted-foreground text-center py-4">Start typing to search...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        <Badge variant={notification.type === 'kindle' ? 'default' : 'destructive'}>
                          {notification.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No notifications</p>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </div>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowNotifications(false)}
                className="w-full"
              >
                Mark All as Read
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
