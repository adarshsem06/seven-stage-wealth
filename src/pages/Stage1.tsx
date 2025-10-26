import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, PieChart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ExpenseTracker from "@/components/stage1/ExpenseTracker";
import BudgetOverview from "@/components/stage1/BudgetOverview";
import PurchasePlanner from "@/components/stage1/PurchasePlanner";

export default function Stage1() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }>>([]);

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyIncome > 0) {
      toast.success("Monthly income set successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Stage 1: Money Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Master the 50/30/20 rule and achieve budgeting discipline
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Income Setup Card */}
        {monthlyIncome === 0 && (
          <Card className="p-8 gradient-card border-primary/20 mb-8 shadow-glow animate-scale-in">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Let's Start With Your Income
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                Enter your monthly income to set up your 50/30/20 budget
              </p>
              <form onSubmit={handleIncomeSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 50000"
                    value={monthlyIncome || ""}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="text-lg"
                    min="0"
                    step="1000"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Set Up Budget
                </Button>
              </form>
            </div>
          </Card>
        )}

        {/* Main Content - Only show after income is set */}
        {monthlyIncome > 0 && (
          <div className="space-y-8">
            {/* Budget Overview */}
            <BudgetOverview 
              monthlyIncome={monthlyIncome} 
              expenses={expenses}
              onUpdateIncome={setMonthlyIncome}
            />

            {/* Tabs for different sections */}
            <Tabs defaultValue="expenses" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="expenses">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <PieChart className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="planner">
                  <Plus className="h-4 w-4 mr-2" />
                  Purchase Planner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="expenses" className="mt-6">
                <ExpenseTracker 
                  expenses={expenses}
                  onExpensesChange={setExpenses}
                />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <Card className="p-6 gradient-card">
                  <h3 className="text-xl font-semibold mb-4">Expense Analytics</h3>
                  <p className="text-muted-foreground">
                    Category breakdown and spending insights coming soon...
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="planner" className="mt-6">
                <PurchasePlanner 
                  monthlyIncome={monthlyIncome}
                  expenses={expenses}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
