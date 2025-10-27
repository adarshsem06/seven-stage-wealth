import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseAnalyticsProps {
  expenses: Expense[];
  monthlyIncome: number;
}

const EXPENSE_CATEGORIES = [
  { value: "rent", label: "Rent", type: "needs" },
  { value: "emi", label: "EMIs", type: "needs" },
  { value: "utilities", label: "Utility Bills", type: "needs" },
  { value: "internet", label: "Internet/Phone", type: "needs" },
  { value: "groceries", label: "Groceries", type: "needs" },
  { value: "milk", label: "Milk", type: "needs" },
  { value: "vegetables", label: "Vegetables", type: "needs" },
  { value: "medicine", label: "Medicine/Healthcare", type: "needs" },
  { value: "insurance", label: "Insurance", type: "needs" },
  { value: "education", label: "Education", type: "needs" },
  { value: "transport-commute", label: "Commute Transport", type: "needs" },
  { value: "bus", label: "Bus", type: "needs" },
  { value: "metro", label: "Metro", type: "needs" },
  { value: "fuel", label: "Fuel", type: "needs" },
  { value: "other-needs", label: "Other Needs", type: "needs" },
  { value: "dining", label: "Dining Out", type: "wants" },
  { value: "lunch", label: "Lunch Out", type: "wants" },
  { value: "dinner", label: "Dinner Out", type: "wants" },
  { value: "breakfast", label: "Breakfast Out", type: "wants" },
  { value: "delivery", label: "Food Delivery", type: "wants" },
  { value: "swiggy", label: "Swiggy", type: "wants" },
  { value: "zomato", label: "Zomato", type: "wants" },
  { value: "rapido", label: "Rapido/Cab", type: "wants" },
  { value: "uber", label: "Uber/Ola", type: "wants" },
  { value: "clothes", label: "Clothes/Fashion", type: "wants" },
  { value: "shopping", label: "Shopping", type: "wants" },
  { value: "entertainment", label: "Entertainment", type: "wants" },
  { value: "movies", label: "Movies", type: "wants" },
  { value: "subscriptions", label: "Subscriptions", type: "wants" },
  { value: "gadgets", label: "Gadgets/Electronics", type: "wants" },
  { value: "gaming", label: "Gaming", type: "wants" },
  { value: "travel", label: "Travel/Vacation", type: "wants" },
  { value: "gym", label: "Gym/Fitness", type: "wants" },
  { value: "salon", label: "Salon/Grooming", type: "wants" },
  { value: "gifts", label: "Gifts", type: "wants" },
  { value: "hobbies", label: "Hobbies", type: "wants" },
  { value: "other-wants", label: "Other Wants", type: "wants" },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
];

export default function ExpenseAnalytics({ expenses, monthlyIncome }: ExpenseAnalyticsProps) {
  const getCategoryLabel = (value: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === value)?.label || value;
  };

  const getCategoryType = (value: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === value)?.type || "wants";
  };

  // Calculate total spending
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calculate spending by category
  const categorySpending = expenses.reduce((acc, exp) => {
    const category = exp.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for pie chart (top 8 categories + others)
  const sortedCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  
  const othersAmount = Object.entries(categorySpending)
    .slice(8)
    .reduce((sum, [, amount]) => sum + amount, 0);

  const pieData = [
    ...sortedCategories.map(([category, amount]) => ({
      name: getCategoryLabel(category),
      value: amount,
      percentage: ((amount / totalSpent) * 100).toFixed(1)
    })),
    ...(othersAmount > 0 ? [{
      name: "Others",
      value: othersAmount,
      percentage: ((othersAmount / totalSpent) * 100).toFixed(1)
    }] : [])
  ];

  // Calculate spending by type (Needs vs Wants)
  const needsSpent = expenses
    .filter(exp => getCategoryType(exp.category) === "needs")
    .reduce((sum, exp) => sum + exp.amount, 0);
  
  const wantsSpent = expenses
    .filter(exp => getCategoryType(exp.category) === "wants")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const typeData = [
    { name: "Needs", amount: needsSpent, budget: monthlyIncome * 0.5 },
    { name: "Wants", amount: wantsSpent, budget: monthlyIncome * 0.3 },
    { name: "Savings", amount: monthlyIncome - totalSpent, budget: monthlyIncome * 0.2 }
  ];

  // Spending over time (last 30 days)
  const dailySpending = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const timelineData = Object.entries(dailySpending)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  // Calculate average daily spending
  const avgDailySpending = timelineData.length > 0
    ? timelineData.reduce((sum, day) => sum + day.amount, 0) / timelineData.length
    : 0;

  // Top spending categories
  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category: getCategoryLabel(category),
      amount,
      percentage: ((amount / totalSpent) * 100).toFixed(1)
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((totalSpent / monthlyIncome) * 100).toFixed(1)}% of income
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Daily Spend</p>
              <p className="text-2xl font-bold">₹{avgDailySpending.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last {timelineData.length} days
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Remaining Budget</p>
              <p className="text-2xl font-bold">₹{(monthlyIncome - totalSpent).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {totalSpent > monthlyIncome ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-destructive" />
                    Over budget
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    On track
                  </>
                )}
              </p>
            </div>
            <PieChartIcon className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ₹{(totalSpent / expenses.length || 0).toFixed(0)} avg/transaction
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <Card className="p-6 gradient-card">
          <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </Card>

        {/* Needs vs Wants vs Savings */}
        <Card className="p-6 gradient-card">
          <h3 className="text-xl font-semibold mb-4">50/30/20 Budget Analysis</h3>
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="hsl(var(--primary))" name="Actual Spending" radius={[8, 8, 0, 0]} />
                <Bar dataKey="budget" fill="hsl(var(--chart-2))" name="Budget" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Timeline */}
        <Card className="p-6 gradient-card">
          <h3 className="text-xl font-semibold mb-4">Spending Timeline</h3>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Daily Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </Card>

        {/* Top Spending Categories */}
        <Card className="p-6 gradient-card">
          <h3 className="text-xl font-semibold mb-4">Top Spending Categories</h3>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{cat.amount.toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${cat.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No expense data to display
            </div>
          )}
        </Card>
      </div>

      {/* Insights Card */}
      <Card className="p-6 gradient-card">
        <h3 className="text-xl font-semibold mb-4">Spending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Needs Spending</p>
            <p className="text-2xl font-bold">₹{needsSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Target: ₹{(monthlyIncome * 0.5).toLocaleString()} (50%)
            </p>
            <p className="text-xs mt-1 flex items-center gap-1">
              {needsSpent > monthlyIncome * 0.5 ? (
                <><TrendingUp className="h-3 w-3 text-destructive" /> {((needsSpent / (monthlyIncome * 0.5) - 1) * 100).toFixed(0)}% over budget</>
              ) : (
                <><TrendingDown className="h-3 w-3 text-green-500" /> {((1 - needsSpent / (monthlyIncome * 0.5)) * 100).toFixed(0)}% under budget</>
              )}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Wants Spending</p>
            <p className="text-2xl font-bold">₹{wantsSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Target: ₹{(monthlyIncome * 0.3).toLocaleString()} (30%)
            </p>
            <p className="text-xs mt-1 flex items-center gap-1">
              {wantsSpent > monthlyIncome * 0.3 ? (
                <><TrendingUp className="h-3 w-3 text-destructive" /> {((wantsSpent / (monthlyIncome * 0.3) - 1) * 100).toFixed(0)}% over budget</>
              ) : (
                <><TrendingDown className="h-3 w-3 text-green-500" /> {((1 - wantsSpent / (monthlyIncome * 0.3)) * 100).toFixed(0)}% under budget</>
              )}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Savings/Investment</p>
            <p className="text-2xl font-bold">₹{(monthlyIncome - totalSpent).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Target: ₹{(monthlyIncome * 0.2).toLocaleString()} (20%)
            </p>
            <p className="text-xs mt-1 flex items-center gap-1">
              {(monthlyIncome - totalSpent) < monthlyIncome * 0.2 ? (
                <><TrendingDown className="h-3 w-3 text-destructive" /> Below savings goal</>
              ) : (
                <><TrendingUp className="h-3 w-3 text-green-500" /> Meeting savings goal</>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
