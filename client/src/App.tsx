import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { NotificationsProvider } from "@/contexts/notifications-context";
import Dashboard from "@/pages/dashboard";
import Rabbits from "@/pages/rabbits";
import Breeding from "@/pages/breeding";
import Expenses from "@/pages/expenses";
import Records from "@/pages/records";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopBar } from "@/components/layout/top-bar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/rabbits" component={Rabbits} />
      <Route path="/breeding" component={Breeding} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/records" component={Records} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationsProvider>
          <TooltipProvider>
            <div className="max-w-md mx-auto bg-white dark:bg-black min-h-screen relative">
              <TopBar />
              <main className="pb-20">
                <Router />
              </main>
              <BottomNav />
            </div>
            <Toaster />
          </TooltipProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
