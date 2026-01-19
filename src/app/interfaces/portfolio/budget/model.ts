export interface BudgetValue {
    value: number;
    date: Date;
}

export interface Cost extends BudgetValue { 
    costType: CostType;
}

export enum CostType {
    None = 0,
    General = 1,
    House = 2,
    Credit = 3,
    Food = 4,
    Cars = 5,
    Fun = 6,
    Pets = 7,
    Special = 8,
}

export const CostTypeDisplay: Record<CostType | number, string> = {
    [CostType.None]: 'None',
    [CostType.General]: 'General',
    [CostType.House]: 'House',
    [CostType.Credit]: 'Credit',
    [CostType.Food]: 'Food',
    [CostType.Cars]: 'Cars',
    [CostType.Fun]: 'Fun',
    [CostType.Pets]: 'Pets',
    [CostType.Special]: 'Special',
}

export interface Income extends BudgetValue { 
    incomeType: IncomeType;
}

export enum IncomeType {
    None = 0,
    Salary = 1,
    WifeSalary = 2,
    Extra = 3,
    Gift = 4,
    Sale = 5,
    Other = 6,
}

export const IncomeTypeDisplay: Record<IncomeType | number, string> = {
    [IncomeType.None]: 'None',
    [IncomeType.Salary]: 'My Salary',
    [IncomeType.WifeSalary]: 'Wife Salary',
    [IncomeType.Extra]: 'Extra',
    [IncomeType.Gift]: 'Gift',
    [IncomeType.Sale]: 'Sale',
    [IncomeType.Other]: 'Other',
}

export interface MonthSummary {
    month: number,
    year: number,
    incomes: Income[],
    costs: Cost[],
}