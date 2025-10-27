import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, CreditCard, Calendar, Percent, DollarSign } from "lucide-react";
import { format } from "date-fns";

export interface Debt {
  id: string;
  name: string;
  platform: string;
  principal: number;
  currentBalance: number;
  interestRate: number;
  emiAmount: number;
  dueDate: number; // Day of month
  startDate: string;
  tenure: number; // months
  type: 'loan' | 'credit-card' | 'personal-loan' | 'other';
}

const DEBT_PLATFORMS = [
  'mPocket', 'Slice', 'LazyPay', 'Simpl', 'PayLater', 
  'Credit Card', 'Personal Loan', 'Home Loan', 'Car Loan', 
  'Education Loan', 'MoneyTap', 'KreditBee', 'CASHe', 
  'Navi', 'PaySense', 'EarlySalary', 'Other'
];

const DEBT_TYPES = [
  { value: 'loan', label: 'Loan' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'other', label: 'Other' }
];

export function DebtTracker() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    principal: '',
    currentBalance: '',
    interestRate: '',
    emiAmount: '',
    dueDate: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    tenure: '',
    type: 'loan' as Debt['type']
  });

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = () => {
    const saved = localStorage.getItem('debts');
    if (saved) {
      setDebts(JSON.parse(saved));
    }
  };

  const saveDebts = (newDebts: Debt[]) => {
    localStorage.setItem('debts', JSON.stringify(newDebts));
    setDebts(newDebts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.platform || !formData.principal || !formData.currentBalance || 
        !formData.interestRate || !formData.emiAmount || !formData.dueDate || !formData.tenure) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const debt: Debt = {
      id: editingDebt?.id || Date.now().toString(),
      name: formData.name,
      platform: formData.platform,
      principal: parseFloat(formData.principal),
      currentBalance: parseFloat(formData.currentBalance),
      interestRate: parseFloat(formData.interestRate),
      emiAmount: parseFloat(formData.emiAmount),
      dueDate: parseInt(formData.dueDate),
      startDate: formData.startDate,
      tenure: parseInt(formData.tenure),
      type: formData.type
    };

    if (editingDebt) {
      saveDebts(debts.map(d => d.id === debt.id ? debt : d));
      toast({ title: "Debt updated successfully" });
    } else {
      saveDebts([...debts, debt]);
      toast({ title: "Debt added successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      principal: '',
      currentBalance: '',
      interestRate: '',
      emiAmount: '',
      dueDate: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      tenure: '',
      type: 'loan'
    });
    setEditingDebt(null);
  };

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      name: debt.name,
      platform: debt.platform,
      principal: debt.principal.toString(),
      currentBalance: debt.currentBalance.toString(),
      interestRate: debt.interestRate.toString(),
      emiAmount: debt.emiAmount.toString(),
      dueDate: debt.dueDate.toString(),
      startDate: debt.startDate,
      tenure: debt.tenure.toString(),
      type: debt.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    saveDebts(debts.filter(d => d.id !== id));
    toast({ title: "Debt deleted successfully" });
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalEMI = debts.reduce((sum, d) => sum + d.emiAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="text-2xl font-bold text-destructive">₹{totalDebt.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly EMI</p>
                <p className="text-2xl font-bold">₹{totalEMI.toLocaleString('en-IN')}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Debts</p>
                <p className="text-2xl font-bold">{debts.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Debt Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Debts</CardTitle>
              <CardDescription>Track all your loans and debts in one place</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Debt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingDebt ? 'Edit Debt' : 'Add New Debt'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Debt Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Personal Loan 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform *</Label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEBT_PLATFORMS.map(platform => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Debt Type *</Label>
                      <Select value={formData.type} onValueChange={(value: Debt['type']) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DEBT_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="principal">Original Amount (₹) *</Label>
                      <Input
                        id="principal"
                        type="number"
                        value={formData.principal}
                        onChange={(e) => setFormData({...formData, principal: e.target.value})}
                        placeholder="50000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentBalance">Current Balance (₹) *</Label>
                      <Input
                        id="currentBalance"
                        type="number"
                        value={formData.currentBalance}
                        onChange={(e) => setFormData({...formData, currentBalance: e.target.value})}
                        placeholder="45000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (% p.a.) *</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.01"
                        value={formData.interestRate}
                        onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                        placeholder="12.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emiAmount">EMI Amount (₹) *</Label>
                      <Input
                        id="emiAmount"
                        type="number"
                        value={formData.emiAmount}
                        onChange={(e) => setFormData({...formData, emiAmount: e.target.value})}
                        placeholder="5000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date (Day of Month) *</Label>
                      <Input
                        id="dueDate"
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        placeholder="15"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure">Tenure (Months) *</Label>
                      <Input
                        id="tenure"
                        type="number"
                        value={formData.tenure}
                        onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                        placeholder="12"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDebt ? 'Update' : 'Add'} Debt
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {debts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No debts added yet. Click "Add Debt" to start tracking.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>EMI</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-medium">{debt.name}</TableCell>
                      <TableCell>{debt.platform}</TableCell>
                      <TableCell className="text-destructive font-semibold">
                        ₹{debt.currentBalance.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>{debt.interestRate}%</TableCell>
                      <TableCell>₹{debt.emiAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{debt.dueDate} of month</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(debt)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(debt.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
