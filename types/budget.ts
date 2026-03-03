export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type BudgetStatus = 'active' | 'exceeded' | 'archived';

export type CreateBudgetData = {
  categoryId?: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate?: string;
  alertThreshold?: number;
};

export type UpdateBudgetData = {
  id: string;
  categoryId?: string;
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  alertThreshold?: number;
  status?: BudgetStatus;
};

export type ListBudgetsParams = {
  page?: string;
  limit?: string;
  categoryId?: string;
  period?: BudgetPeriod;
  status?: BudgetStatus;
  startDate?: string;
  endDate?: string;
};

export type CurrentBudgetsParams = {
  period?: BudgetPeriod;
};

export type BudgetStatusParams = {
  id: string;
};
