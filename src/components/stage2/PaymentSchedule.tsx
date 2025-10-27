import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Debt } from "./DebtTracker";
import { format, addMonths, isBefore, isAfter, startOfMonth, endOfMonth } from "date-fns";

interface Payment {
  debtId: string;
  debtName: string;
  platform: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
}

export function PaymentSchedule() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    generatePayments();
  }, [debts, currentMonth]);

  const loadData = () => {
    const savedDebts = localStorage.getItem('debts');
    const savedPayments = localStorage.getItem('payments');
    
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts));
    }
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments).map((p: any) => ({
        ...p,
        dueDate: new Date(p.dueDate)
      })));
    }
  };

  const generatePayments = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    const monthPayments: Payment[] = debts.map(debt => {
      const dueDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), debt.dueDate);
      
      // Check if already paid
      const existingPayment = payments.find(
        p => p.debtId === debt.id && 
        p.dueDate.getMonth() === currentMonth.getMonth() &&
        p.dueDate.getFullYear() === currentMonth.getFullYear()
      );

      return {
        debtId: debt.id,
        debtName: debt.name,
        platform: debt.platform,
        amount: debt.emiAmount,
        dueDate,
        isPaid: existingPayment?.isPaid || false
      };
    });

    setPayments(monthPayments);
  };

  const togglePayment = (debtId: string) => {
    const updatedPayments = payments.map(p => 
      p.debtId === debtId ? { ...p, isPaid: !p.isPaid } : p
    );
    setPayments(updatedPayments);
    
    // Save to localStorage
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const resetToCurrentMonth = () => setCurrentMonth(new Date());

  const sortedPayments = [...payments].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const totalDue = payments.reduce((sum, p) => sum + (p.isPaid ? 0 : p.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.isPaid ? p.amount : 0), 0);
  const upcomingPayments = payments.filter(p => !p.isPaid && isAfter(p.dueDate, new Date())).length;
  const overduePayments = payments.filter(p => !p.isPaid && isBefore(p.dueDate, new Date())).length;

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add debts to see payment schedule</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Due</p>
                <p className="text-2xl font-bold text-destructive">₹{totalDue.toLocaleString('en-IN')}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString('en-IN')}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingPayments}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-warning">{overduePayments}</p>
              </div>
              <Bell className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription>Track your monthly debt payments</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>Previous</Button>
              <Button variant="outline" size="sm" onClick={resetToCurrentMonth}>Today</Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>Next</Button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
          </div>
        </CardHeader>
        <CardContent>
          {sortedPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payments scheduled for this month</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPayments.map((payment) => {
                const isOverdue = !payment.isPaid && isBefore(payment.dueDate, new Date());
                const isToday = format(payment.dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                
                return (
                  <div
                    key={payment.debtId}
                    className={`p-4 border rounded-lg transition-all ${
                      payment.isPaid ? 'bg-success/5 border-success/20' : 
                      isOverdue ? 'bg-destructive/5 border-destructive/20' :
                      isToday ? 'bg-warning/5 border-warning/20' :
                      'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {payment.isPaid ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : isOverdue ? (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{payment.debtName}</h4>
                              {isToday && !payment.isPaid && (
                                <Badge variant="outline" className="text-xs">Due Today</Badge>
                              )}
                              {isOverdue && !payment.isPaid && (
                                <Badge variant="destructive" className="text-xs">Overdue</Badge>
                              )}
                              {payment.isPaid && (
                                <Badge variant="outline" className="text-xs border-success text-success">Paid</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{payment.platform}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Due: </span>
                                <span className="font-medium">{format(payment.dueDate, 'MMM dd, yyyy')}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Amount: </span>
                                <span className="font-semibold">₹{payment.amount.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={payment.isPaid ? "outline" : "default"}
                        onClick={() => togglePayment(payment.debtId)}
                      >
                        {payment.isPaid ? 'Mark Unpaid' : 'Mark as Paid'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Reminders */}
      {overduePayments > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Overdue Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">You have {overduePayments} overdue payment(s). Please clear them as soon as possible to avoid penalties.</p>
            <div className="space-y-2">
              {payments.filter(p => !p.isPaid && isBefore(p.dueDate, new Date())).map(payment => (
                <div key={payment.debtId} className="flex items-center justify-between text-sm p-2 bg-background rounded">
                  <span>{payment.debtName}</span>
                  <span className="font-semibold">₹{payment.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
