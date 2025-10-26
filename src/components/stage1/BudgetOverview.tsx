import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, TrendingUp, PiggyBank, AlertCircle } from "lucide-react";
import { useState } from "react";

interface BudgetOverviewProps {
  monthlyIncome: number;
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
  onUpdateIncome: (income: number) => void;
}

const NEEDS_CATEGORIES = ["rent", "emi", "utilities", "groceries", "other-needs"];
const WANTS_CATEGORIES = ["dining", "delivery", "clothes", "entertainment", "gadgets", "travel", "other-wants"];

export default function BudgetOverview({ monthlyIncome, expenses, onUpdateIncome }: BudgetOverviewProps) {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState(monthlyIncome);

  // Calculate budgets based on 50/30/20 rule
  const needsBudget = monthlyIncome * 0.5;
  const wantsBudget = monthlyIncome * 0.3;
  const investmentBudget = monthlyIncome * 0.2;

  // Calculate actual spending
  const needsSpent = expenses
    .filter(exp => NEEDS_CATEGORIES.includes(exp.category))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const wantsSpent = expenses
    .filter(exp => WANTS_CATEGORIES.includes(exp.category))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalSpent = needsSpent + wantsSpent;
  const availableForInvestment = monthlyIncome - totalSpent;

  // Calculate percentages
  const needsPercentage = (needsSpent / needsBudget) * 100;
  const wantsPercentage = (wantsSpent / wantsBudget) * 100;
  const investmentPercentage = (availableForInvestment / investmentBudget) * 100;

  const handleUpdateIncome = () => {
    onUpdateIncome(newIncome);
    setIsEditingIncome(false);
  };

  const budgetItems = [
    {
      title: "Needs",
      icon: Wallet,
      budget: needsBudget,
      spent: needsSpent,
      percentage: needsPercentage,
      color: "primary",
      description: "Essential expenses (50%)"
    },
    {
      title: "Wants",
      icon: TrendingUp,
      budget: wantsBudget,
      spent: wantsSpent,
      percentage: wantsPercentage,
      color: "accent",
      description: "Lifestyle & desires (30%)"
    },
    {
      title: "Investment",
      icon: PiggyBank,
      budget: investmentBudget,
      spent: Math.max(0, availableForInvestment),
      percentage: Math.max(0, investmentPercentage),
      color: "success",
      description: "Future wealth (20%)"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Income Card */}
      <Card className="p-6 gradient-card border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-sm">Monthly Income</p>
            <p className="text-3xl font-bold">₹{monthlyIncome.toLocaleString()}</p>
          </div>
          <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Income</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Monthly Income</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="new-income">New Monthly Income (₹)</Label>
                  <Input
                    id="new-income"
                    type="number"
                    value={newIncome}
                    onChange={(e) => setNewIncome(Number(e.target.value))}
                    min="0"
                    step="1000"
                  />
                </div>
                <Button onClick={handleUpdateIncome} className="w-full">
                  Update Income
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Budget Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {budgetItems.map((item) => {
          const Icon = item.icon;
          const isOverBudget = item.percentage > 100;
          
          return (
            <Card 
              key={item.title}
              className={`p-6 gradient-card hover-lift ${isOverBudget ? 'border-destructive/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-5 w-5 text-${item.color}`} />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {isOverBudget && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold">
                    ₹{item.spent.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    of ₹{item.budget.toLocaleString()}
                  </span>
                </div>

                <Progress 
                  value={Math.min(item.percentage, 100)} 
                  className="h-2"
                />

                <div className="flex justify-between text-sm">
                  <span className={isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                    {item.percentage.toFixed(1)}% used
                  </span>
                  <span className="text-muted-foreground">
                    ₹{(item.budget - item.spent).toLocaleString()} left
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Warnings */}
      {(needsPercentage > 100 || wantsPercentage > 100) && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Budget Alert</p>
              <p className="text-sm text-muted-foreground mt-1">
                You've exceeded your budget in some categories. Consider adjusting your spending to maintain financial discipline.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
