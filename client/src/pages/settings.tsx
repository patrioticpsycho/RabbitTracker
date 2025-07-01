import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Download, Upload, Trash2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/theme-context";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notifications") !== "false";
  });
  const [autoBackup, setAutoBackup] = useState(() => {
    return localStorage.getItem("autoBackup") === "true";
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all data for export
  const { data: rabbits = [] } = useQuery({ queryKey: ["/api/rabbits"] });
  const { data: breedingRecords = [] } = useQuery({ queryKey: ["/api/breeding-records"] });
  const { data: expenses = [] } = useQuery({ queryKey: ["/api/expenses"] });
  const { data: offspring = [] } = useQuery({ queryKey: ["/api/offspring"] });
  const { data: butcherRecords = [] } = useQuery({ queryKey: ["/api/butcher-records"] });

  const handleExportData = () => {
    try {
      const exportData = {
        rabbits,
        breedingRecords,
        expenses,
        offspring,
        butcherRecords,
        exportDate: new Date().toISOString(),
        version: "1.0.0"
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `rabbit-manager-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate the data structure
        if (!data.rabbits || !Array.isArray(data.rabbits)) {
          throw new Error("Invalid data format");
        }

        toast({
          title: "Import Feature",
          description: "Data import functionality is coming soon. File validation successful.",
        });
      } catch (error) {
        toast({
          title: "Import Failed", 
          description: "Invalid file format. Please select a valid export file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    toast({
      title: "Clear Data",
      description: "This feature requires confirmation. Implementation coming soon.",
    });
  };

  const handleNotificationChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem("notifications", checked.toString());
  };

  const handleAutoBackupChange = (checked: boolean) => {
    setAutoBackup(checked);
    localStorage.setItem("autoBackup", checked.toString());
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications for breeding reminders
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically backup your data weekly
              </p>
            </div>
            <Switch
              checked={autoBackup}
              onCheckedChange={handleAutoBackupChange}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleImportData}
            >
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2"
              onClick={handleClearData}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Version</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
            <span className="text-sm font-medium">July 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Database</span>
            <span className="text-sm font-medium">In-Memory Storage</span>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileSelect}
      />
    </div>
  );
}