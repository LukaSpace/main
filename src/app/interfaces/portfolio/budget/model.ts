export interface BudgetValue {
  value: number;
  date: Date;
}

export interface Cost extends BudgetValue {
  costType: CostType;
}

export enum CostType {
  None = 0,
  Operating = 1,
  Rent = 2,
  Salaries = 3,
  Marketing = 4,
  RnD = 5,
  Utilities = 6,
  Taxes = 7,
  Other = 8,
}

export const CostTypeDisplay: Record<CostType | number, string> = {
  [CostType.None]: 'None',
  [CostType.Operating]: 'Operating',
  [CostType.Rent]: 'Rent',
  [CostType.Salaries]: 'Salaries & Wages',
  [CostType.Marketing]: 'Marketing',
  [CostType.RnD]: 'R&D',
  [CostType.Utilities]: 'Utilities',
  [CostType.Taxes]: 'Taxes',
  [CostType.Other]: 'Other',
};

export interface Income extends BudgetValue {
  incomeType: IncomeType;
}

export enum IncomeType {
  None = 0,
  Sales = 1,
  Services = 2,
  Taxes = 3,
  Investment = 4,
  Grants = 5,
  Other = 6,
}

export const IncomeTypeDisplay: Record<IncomeType | number, string> = {
  [IncomeType.None]: 'None',
  [IncomeType.Sales]: 'Product Sales',
  [IncomeType.Services]: 'Service Revenue',
  [IncomeType.Taxes]: 'Taxes Collected',
  [IncomeType.Investment]: 'Investment',
  [IncomeType.Grants]: 'Grants/Subsidies',
  [IncomeType.Other]: 'Other',
};

export interface MonthSummary {
  month: number;
  year: number;
  incomes: Income[];
  costs: Cost[];
}
