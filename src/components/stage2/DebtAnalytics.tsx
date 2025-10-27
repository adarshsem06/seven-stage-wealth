import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import { TrendingDown, Percent, Calendar, AlertCircle } from "lucide-react";
import { Debt } from "./DebtTracker";

export function DebtAnalytics() {
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('debts');
    if (saved) {
      setDebts(JSON.parse(saved));
    }
  }, []);

  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalPrincipal = debts.reduce((sum, d) => sum + d.principal, 0);
  const totalPaid = totalPrincipal - totalDebt;
  const totalInterest = debts.reduce((sum, d) => {
    const monthlyRate = d.interestRate / 12 / 100;
    const totalPayment = d.emiAmount * d.tenure;
    const interest = totalPayment - d.principal;
    return sum + interest;
  }, 0);

  const avgInterestRate = debts.length > 0 
    ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length 
    : 0;

  // Debt by platform
  const platformData = Object.entries(
    debts.reduce((acc, debt) => {
      acc[debt.platform] = (acc[debt.platform] || 0) + debt.currentBalance;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Interest rate comparison
  const interestComparison = debts
    .sort((a, b) => b.interestRate - a.interestRate)
    .map(d => ({
      name: d.name.substring(0, 20),
      rate: d.interestRate,
      balance: d.currentBalance
    }));

  // Monthly payment projection
  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const remaining = debts.reduce((sum, debt) => {
      const monthsElapsed = i;
      const newBalance = Math.max(0, debt.currentBalance - (debt.emiAmount * monthsElapsed));
      return sum + newBalance;
    }, 0);
    return {
      month: `Month ${month}`,
      balance: Math.round(remaining)
    };
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--warning))'];

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add debts to see analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <p className="text-sm">Total Debt</p>
              </div>
              <p className="text-2xl font-bold text-destructive">₹{totalDebt.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <p className="text-sm">Amount Paid</p>
              </div>
              <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Percent className="h-4 w-4" />
                <p className="text-sm">Avg Interest Rate</p>
              </div>
              <p className="text-2xl font-bold">{avgInterestRate.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <p className="text-sm">Total Interest</p>
              </div>
              <p className="text-2xl font-bold text-warning">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debt Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Debt by Platform</CardTitle>
            <CardDescription>Distribution of your debt across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Interest Rate Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Interest Rates</CardTitle>
            <CardDescription>Compare interest rates across your debts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interestComparison}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'rate') return `${value}%`;
                    return `₹${value.toLocaleString('en-IN')}`;
                  }}
                />
                <Bar dataKey="rate" fill="hsl(var(--destructive))" name="Interest Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Debt Payoff Projection */}
      <Card>
        <CardHeader>
          <CardTitle>12-Month Debt Projection</CardTitle>
          <CardDescription>Expected debt balance over the next year (with current EMIs)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProjection}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Remaining Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Debt Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Debt Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts.map(debt => {
              const monthlyRate = debt.interestRate / 12 / 100;
              const totalPayment = debt.emiAmount * debt.tenure;
              const totalInterestForDebt = totalPayment - debt.principal;
              const percentPaid = ((debt.principal - debt.currentBalance) / debt.principal) * 100;
              const monthsRemaining = Math.ceil(debt.currentBalance / debt.emiAmount);

              return (
                <div key={debt.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{debt.name}</h4>
                      <p className="text-sm text-muted-foreground">{debt.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-destructive">₹{debt.currentBalance.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-muted-foreground">of ₹{debt.principal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Progress</p>
                      <p className="font-semibold">{percentPaid.toFixed(1)}% paid</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">{debt.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Interest</p>
                      <p className="font-semibold text-warning">₹{totalInterestForDebt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Months Left</p>
                      <p className="font-semibold">{monthsRemaining} months</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
