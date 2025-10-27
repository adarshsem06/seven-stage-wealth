import { supabase } from "@/integrations/supabase/client";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

// Use localStorage as fallback
const getStorageKey = (userId: string, key: string) => `seven_stage_wealth_${userId}_${key}`;

/**
 * Load from localStorage as fallback
 */
const loadFromLocalStorage = (userId: string) => {
  try {
    const incomeKey = getStorageKey(userId, 'monthly_income');
    const expensesKey = getStorageKey(userId, 'expenses');
    
    const income = localStorage.getItem(incomeKey);
    const expenses = localStorage.getItem(expensesKey);
    
    return {
      monthlyIncome: income ? parseFloat(income) : 0,
      expenses: expenses ? JSON.parse(expenses) : []
    };
  } catch (error) {
    return {
      monthlyIncome: 0,
      expenses: []
    };
  }
};

/**
 * Save to localStorage as fallback
 */
const saveToLocalStorage = (userId: string, data: { monthlyIncome?: number; expenses?: Expense[] }) => {
  try {
    if (data.monthlyIncome !== undefined) {
      localStorage.setItem(getStorageKey(userId, 'monthly_income'), data.monthlyIncome.toString());
    }
    if (data.expenses !== undefined) {
      localStorage.setItem(getStorageKey(userId, 'expenses'), JSON.stringify(data.expenses));
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Load user profile including monthly income and expenses
 */
export const loadUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("monthly_income, expenses")
      .eq("id", userId)
      .single();

    // If error is about missing columns or any database error, use localStorage
    if (error) {
      console.log("Database not available or migration not run - using localStorage");
      return loadFromLocalStorage(userId);
    }

    // If we got data from database, use it (and save to localStorage as backup)
    if (data) {
      const profile = {
        monthlyIncome: data?.monthly_income || 0,
        expenses: (data?.expenses as unknown as Expense[]) || []
      };
      
      // Save to localStorage as backup
      saveToLocalStorage(userId, profile);
      
      return profile;
    }

    return loadFromLocalStorage(userId);
  } catch (error) {
    console.error("Error loading profile, using localStorage:", error);
    return loadFromLocalStorage(userId);
  }
};

/**
 * Save monthly income to user profile
 */
export const saveMonthlyIncome = async (userId: string, income: number) => {
  // Always save to localStorage
  saveToLocalStorage(userId, { monthlyIncome: income });
  
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ monthly_income: income })
      .eq("id", userId);

    if (error) {
      // If columns don't exist, that's fine - we're using localStorage
      if (error.message.includes('column') || error.code === 'PGRST116' || error.code === '42883') {
        console.warn("Database migration not run - saving to localStorage");
      } else {
        console.error("Error saving income:", error);
      }
    }
  } catch (error) {
    console.error("Error saving income, but localStorage saved:", error);
  }
};

/**
 * Save expenses to user profile
 */
export const saveExpenses = async (userId: string, expenses: Expense[]) => {
  // Always save to localStorage
  saveToLocalStorage(userId, { expenses });
  
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ expenses: expenses as any })
      .eq("id", userId);

    if (error) {
      // If columns don't exist, that's fine - we're using localStorage
      if (error.message.includes('column') || error.code === 'PGRST116' || error.code === '42883') {
        console.warn("Database migration not run - saving to localStorage");
      } else {
        console.error("Error saving expenses:", error);
      }
    }
  } catch (error) {
    console.error("Error saving expenses, but localStorage saved:", error);
  }
};

