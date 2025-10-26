import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ShoppingBag, Calendar } from "lucide-react";

const WANTS_CATEGORIES = ["dining", "delivery", "clothes", "entertainment", "gadgets", "travel", "other-wants"];

interface PurchasePlannerProps {
  monthlyIncome: number;
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

export default function PurchasePlanner({ monthlyIncome, expenses }: PurchasePlannerProps) {
  const [desiredPurchase, setDesiredPurchase] = useState({
    name: "",
    amount: ""
  });

  const wantsBudget = monthlyIncome * 0.3;
  const wantsSpent = expenses
    .filter(exp => WANTS_CATEGORIES.includes(exp.category))
    .reduce((sum, exp) => sum + exp.amount, 0);
  const wantsAvailable = wantsBudget - wantsSpent;

  const calculateMonthsNeeded = () => {
    const amount = parseFloat(desiredPurchase.amount);
    if (!amount || amount <= 0) return 0;
    
    if (wantsAvailable >= amount) return 1;
    
    return Math.ceil(amount / wantsBudget);
  };

  const monthsNeeded = calculateMonthsNeeded();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Calculator Card */}
      <Card className="p-6 gradient-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/20">
            <Calculator className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Purchase Calculator</h3>
            <p className="text-sm text-muted-foreground">Plan your big purchases wisely</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="purchase-name">What do you want to buy?</Label>
            <Input
              id="purchase-name"
              placeholder="e.g., New iPhone 15"
              value={desiredPurchase.name}
              onChange={(e) => setDesiredPurchase({ ...desiredPurchase, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="purchase-amount">How much does it cost? (₹)</Label>
            <Input
              id="purchase-amount"
              type="number"
              placeholder="e.g., 150000"
              value={desiredPurchase.amount}
              onChange={(e) => setDesiredPurchase({ ...desiredPurchase, amount: e.target.value })}
              min="0"
              step="1000"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your monthly "Wants" budget:</span>
                <span className="font-semibold">₹{wantsBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available this month:</span>
                <span className="font-semibold">₹{wantsAvailable.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Card */}
      <Card className="p-6 gradient-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-success/20">
            <ShoppingBag className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Purchase Plan</h3>
            <p className="text-sm text-muted-foreground">Your disciplined path to purchase</p>
          </div>
        </div>

        {desiredPurchase.amount && parseFloat(desiredPurchase.amount) > 0 ? (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 mb-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Months to save</p>
                  <p className="text-4xl font-bold text-gradient">{monthsNeeded}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
              <h4 className="font-semibold mb-3">Saving Strategy:</h4>
              
              {monthsNeeded === 1 ? (
                <div className="space-y-2">
                  <p className="text-sm text-success flex items-start gap-2">
                    <span className="text-lg">✓</span>
                    <span>Great news! You can afford this purchase with your current month's "Wants" budget.</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You'll have ₹{(wantsAvailable - parseFloat(desiredPurchase.amount)).toLocaleString()} remaining in your "Wants" budget.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm">
                    Save your entire "Wants" budget (₹{wantsBudget.toLocaleString()}) each month for {monthsNeeded} months to afford this purchase.
                  </p>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm font-medium text-accent mb-1">Discipline Check:</p>
                    <p className="text-xs text-muted-foreground">
                      This means cutting back on dining out, entertainment, and other "wants" for {monthsNeeded} months. 
                      Are you ready for this commitment?
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Remember: The 50/30/20 rule ensures you maintain financial discipline while working toward your goals.
                  </p>
                </div>
              )}
            </div>

            {monthsNeeded > 3 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium mb-1">💡 Alternative Suggestion</p>
                <p className="text-xs text-muted-foreground">
                  This purchase requires significant saving. Consider if this aligns with your financial goals or if 
                  there's a more affordable alternative that meets your needs.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Enter a purchase amount to see your savings plan</p>
          </div>
        )}
      </Card>
    </div>
  );
}
