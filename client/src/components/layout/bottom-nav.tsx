import { Home, Heart, MoreHorizontal } from "lucide-react";
import { FaPaw } from "react-icons/fa";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DollarSign, ClipboardList, Calendar, BarChart, Download, CloudUpload, Settings, HelpCircle } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const MoreMenu = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">More</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Link href="/expenses">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center space-y-2"
            onClick={() => setMoreOpen(false)}
          >
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <DollarSign className="text-warning text-lg" />
            </div>
            <span className="text-sm font-medium">Expenses</span>
          </Button>
        </Link>
        
        <Link href="/records">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center space-y-2"
            onClick={() => setMoreOpen(false)}
          >
            <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
              <ClipboardList className="text-info text-lg" />
            </div>
            <span className="text-sm font-medium">Records</span>
          </Button>
        </Link>
        
        <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="text-primary text-lg" />
          </div>
          <span className="text-sm font-medium">Calendar</span>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <BarChart className="text-secondary text-lg" />
          </div>
          <span className="text-sm font-medium">Reports</span>
        </Button>
      </div>

      <div className="space-y-3">
        <Button variant="ghost" className="w-full justify-start">
          <Download className="mr-3 h-4 w-4" />
          Export Data
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <CloudUpload className="mr-3 h-4 w-4" />
          Backup & Sync
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-3 h-4 w-4" />
          Help & Support
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto grid grid-cols-4 py-2">
        <Link href="/">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-2 px-4 h-auto ${
              isActive("/") ? "text-primary" : "text-gray-400"
            }`}
          >
            <Home className="text-lg mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </Button>
        </Link>
        
        <Link href="/rabbits">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-2 px-4 h-auto ${
              isActive("/rabbits") ? "text-primary" : "text-gray-400"
            }`}
          >
            <FaPaw className="text-lg mb-1" />
            <span className="text-xs">Rabbits</span>
          </Button>
        </Link>
        
        <Link href="/breeding">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-2 px-4 h-auto ${
              isActive("/breeding") ? "text-primary" : "text-gray-400"
            }`}
          >
            <Heart className="text-lg mb-1" />
            <span className="text-xs">Breeding</span>
          </Button>
        </Link>
        
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2 px-4 h-auto text-gray-400"
            >
              <MoreHorizontal className="text-lg mb-1" />
              <span className="text-xs">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <MoreMenu />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
