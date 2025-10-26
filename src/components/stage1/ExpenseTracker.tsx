import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const EXPENSE_CATEGORIES = [
  { value: "rent", label: "Rent", type: "needs" },
  { value: "emi", label: "EMIs", type: "needs" },
  { value: "utilities", label: "Utility Bills", type: "needs" },
  { value: "groceries", label: "Food/Groceries", type: "needs" },
  { value: "dining", label: "Dining Out", type: "wants" },
  { value: "delivery", label: "Food Delivery", type: "wants" },
  { value: "clothes", label: "Clothes", type: "wants" },
  { value: "entertainment", label: "Entertainment", type: "wants" },
  { value: "gadgets", label: "Gadgets", type: "wants" },
  { value: "travel", label: "Travel/Vacation", type: "wants" },
  { value: "other-needs", label: "Other Needs", type: "needs" },
  { value: "other-wants", label: "Other Wants", type: "wants" },
];

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseTrackerProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
}

export default function ExpenseTracker({ expenses, onExpensesChange }: ExpenseTrackerProps) {
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date
    };

    onExpensesChange([...expenses, expense]);
    setNewExpense({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0]
    });
    toast.success("Expense added successfully!");
  };

  const handleDeleteExpense = (id: string) => {
    onExpensesChange(expenses.filter(exp => exp.id !== id));
    toast.success("Expense deleted");
  };

  const getCategoryLabel = (value: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Add Expense Form */}
      <Card className="p-6 gradient-card">
        <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Monthly rent"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 15000"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Needs (50%)</div>
                  {EXPENSE_CATEGORIES.filter(cat => cat.type === "needs").map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">Wants (30%)</div>
                  {EXPENSE_CATEGORIES.filter(cat => cat.type === "wants").map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </form>
      </Card>

      {/* Expenses List */}
      <Card className="p-6 gradient-card">
        <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No expenses added yet. Start tracking your spending!
          </p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {getCategoryLabel(expense.category)} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-semibold">₹{expense.amount.toLocaleString()}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
