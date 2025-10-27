import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, Zap, Target, DollarSign, Calendar } from "lucide-react";
import { Debt } from "./DebtTracker";

export function PayoffStrategies() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extraPayment, setExtraPayment] = useState<string>('5000');

  useEffect(() => {
    const saved = localStorage.getItem('debts');
    if (saved) {
      setDebts(JSON.parse(saved));
    }
  }, []);

  // Snowball Method: Pay off smallest balance first
  const calculateSnowball = () => {
    const sortedDebts = [...debts].sort((a, b) => a.currentBalance - b.currentBalance);
    const extra = parseFloat(extraPayment) || 0;
    let timeline: Array<{ month: number; debt: string; payment: number; remaining: number }> = [];
    let debtBalances = sortedDebts.map(d => ({ ...d, balance: d.currentBalance }));
    let month = 0;
    let totalInterestPaid = 0;

    while (debtBalances.some(d => d.balance > 0) && month < 360) {
      month++;
      let extraAvailable = extra;

      debtBalances.forEach((debt, index) => {
        if (debt.balance > 0) {
          const monthlyInterest = (debt.balance * debt.interestRate) / 12 / 100;
          totalInterestPaid += monthlyInterest;
          
          let payment = debt.emiAmount;
          
          // Apply extra payment to first debt with balance
          if (extraAvailable > 0 && index === debtBalances.findIndex(d => d.balance > 0)) {
            payment += extraAvailable;
            extraAvailable = 0;
          }

          const principalPayment = payment - monthlyInterest;
          debt.balance = Math.max(0, debt.balance - principalPayment);

          timeline.push({
            month,
            debt: debt.name,
            payment,
            remaining: debt.balance
          });
        }
      });
    }

    return { timeline, months: month, totalInterest: totalInterestPaid };
  };

  // Avalanche Method: Pay off highest interest rate first
  const calculateAvalanche = () => {
    const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    const extra = parseFloat(extraPayment) || 0;
    let timeline: Array<{ month: number; debt: string; payment: number; remaining: number }> = [];
    let debtBalances = sortedDebts.map(d => ({ ...d, balance: d.currentBalance }));
    let month = 0;
    let totalInterestPaid = 0;

    while (debtBalances.some(d => d.balance > 0) && month < 360) {
      month++;
      let extraAvailable = extra;

      debtBalances.forEach((debt, index) => {
        if (debt.balance > 0) {
          const monthlyInterest = (debt.balance * debt.interestRate) / 12 / 100;
          totalInterestPaid += monthlyInterest;
          
          let payment = debt.emiAmount;
          
          // Apply extra payment to first debt with balance (highest interest)
          if (extraAvailable > 0 && index === debtBalances.findIndex(d => d.balance > 0)) {
            payment += extraAvailable;
            extraAvailable = 0;
          }

          const principalPayment = payment - monthlyInterest;
          debt.balance = Math.max(0, debt.balance - principalPayment);

          timeline.push({
            month,
            debt: debt.name,
            payment,
            remaining: debt.balance
          });
        }
      });
    }

    return { timeline, months: month, totalInterest: totalInterestPaid };
  };

  const snowballResult = calculateSnowball();
  const avalancheResult = calculateAvalanche();

  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalMonthlyEMI = debts.reduce((sum, d) => sum + d.emiAmount, 0);

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add debts to see payoff strategies</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Extra Payment Input */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Extra Payment</CardTitle>
          <CardDescription>Add extra monthly payment to accelerate debt payoff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="extraPayment">Extra Monthly Payment (₹)</Label>
              <Input
                id="extraPayment"
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                placeholder="5000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Current EMIs</p>
                <p className="text-xl font-bold">₹{totalMonthlyEMI.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With Extra</p>
                <p className="text-xl font-bold text-success">
                  ₹{(totalMonthlyEMI + (parseFloat(extraPayment) || 0)).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Comparison */}
      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="snowball">Snowball Method</TabsTrigger>
          <TabsTrigger value="avalanche">Avalanche Method</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Snowball Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Snowball Method</CardTitle>
                </div>
                <CardDescription>Pay smallest balances first - Quick wins!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Debt-Free In</p>
                  <p className="text-3xl font-bold text-primary">{snowballResult.months} months</p>
                  <p className="text-sm text-muted-foreground">({(snowballResult.months / 12).toFixed(1)} years)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Interest Paid</p>
                  <p className="text-xl font-bold text-warning">
                    ₹{snowballResult.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm">Payoff Order:</h4>
                  <div className="space-y-2">
                    {[...debts].sort((a, b) => a.currentBalance - b.currentBalance).map((debt, i) => (
                      <div key={debt.id} className="flex items-center gap-2 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="truncate">{debt.name}</span>
                        <span className="ml-auto text-muted-foreground">₹{debt.currentBalance.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avalanche Card */}
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-accent" />
                  <CardTitle>Avalanche Method</CardTitle>
                </div>
                <CardDescription>Pay highest interest first - Save more!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Debt-Free In</p>
                  <p className="text-3xl font-bold text-accent">{avalancheResult.months} months</p>
                  <p className="text-sm text-muted-foreground">({(avalancheResult.months / 12).toFixed(1)} years)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Interest Paid</p>
                  <p className="text-xl font-bold text-warning">
                    ₹{avalancheResult.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm">Payoff Order:</h4>
                  <div className="space-y-2">
                    {[...debts].sort((a, b) => b.interestRate - a.interestRate).map((debt, i) => (
                      <div key={debt.id} className="flex items-center gap-2 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="truncate">{debt.name}</span>
                        <span className="ml-auto text-muted-foreground">{debt.interestRate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Time Difference</span>
                    <span className="text-sm font-semibold">
                      {Math.abs(snowballResult.months - avalancheResult.months)} months
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Interest Difference</span>
                    <span className="text-sm font-semibold">
                      ₹{Math.abs(snowballResult.totalInterest - avalancheResult.totalInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    {avalancheResult.totalInterest < snowballResult.totalInterest ? (
                      <><strong>Avalanche Method</strong> saves you ₹{(snowballResult.totalInterest - avalancheResult.totalInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })} in interest and gets you debt-free {snowballResult.months - avalancheResult.months} months faster!</>
                    ) : (
                      <><strong>Snowball Method</strong> gets you debt-free {avalancheResult.months - snowballResult.months} months faster, providing psychological wins along the way!</>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snowball">
          <StrategyDetails method="Snowball" result={snowballResult} debts={debts} />
        </TabsContent>

        <TabsContent value="avalanche">
          <StrategyDetails method="Avalanche" result={avalancheResult} debts={debts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StrategyDetails({ 
  method, 
  result, 
  debts 
}: { 
  method: string; 
  result: { months: number; totalInterest: number }; 
  debts: Debt[] 
}) {
  const sortedDebts = method === 'Snowball'
    ? [...debts].sort((a, b) => a.currentBalance - b.currentBalance)
    : [...debts].sort((a, b) => b.interestRate - a.interestRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{method} Method - Detailed Plan</CardTitle>
        <CardDescription>Your step-by-step debt elimination plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Payoff Timeline</p>
            <p className="text-2xl font-bold">{result.months} months</p>
          </div>
          <div className="p-4 border rounded-lg">
            <DollarSign className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Total Interest</p>
            <p className="text-2xl font-bold text-warning">
              ₹{result.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <Target className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Debts to Clear</p>
            <p className="text-2xl font-bold">{debts.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Payoff Sequence</h3>
          {sortedDebts.map((debt, index) => (
            <div key={debt.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{debt.name}</h4>
                    <p className="text-sm text-muted-foreground">{debt.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">₹{debt.currentBalance.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground">{debt.interestRate}% interest</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Monthly EMI</p>
                  <p className="font-semibold">₹{debt.emiAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-semibold">{debt.dueDate} of month</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <p className="font-semibold">
                    {method === 'Snowball' ? 'Smallest balance' : 'Highest interest'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
