import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { DebtTracker } from "@/components/stage2/DebtTracker";
import { DebtAnalytics } from "@/components/stage2/DebtAnalytics";
import { PayoffStrategies } from "@/components/stage2/PayoffStrategies";
import { PaymentSchedule } from "@/components/stage2/PaymentSchedule";

export default function Stage2() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Stage 2: Debt Elimination</h1>
              <p className="text-sm text-muted-foreground">Clear your debts and build financial freedom</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="tracker">Debt Tracker</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="strategies">Payoff Plans</TabsTrigger>
            <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <DebtTracker />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <DebtAnalytics />
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <PayoffStrategies />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <PaymentSchedule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
