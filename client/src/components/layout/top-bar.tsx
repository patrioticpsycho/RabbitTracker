import { Search, Bell } from "lucide-react";
import { FaPaw } from "react-icons/fa";

export function TopBar() {
  return (
    <header className="bg-primary text-primary-foreground px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaPaw className="text-xl" />
          <h1 className="text-lg font-semibold">RabbitTracker Pro</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="text-lg cursor-pointer" />
          <Bell className="text-lg cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
