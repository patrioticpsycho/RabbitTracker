import { 
  type Rabbit, 
  type InsertRabbit,
  type BreedingRecord,
  type InsertBreedingRecord,
  type Offspring,
  type InsertOffspring,
  type Expense,
  type InsertExpense,
  type ButcherRecord,
  type InsertButcherRecord
} from "@shared/schema";

export interface IStorage {
  // Rabbits
  getRabbits(): Promise<Rabbit[]>;
  getRabbit(id: number): Promise<Rabbit | undefined>;
  createRabbit(rabbit: InsertRabbit): Promise<Rabbit>;
  updateRabbit(id: number, updates: Partial<InsertRabbit>): Promise<Rabbit | undefined>;
  deleteRabbit(id: number): Promise<boolean>;
  
  // Breeding Records
  getBreedingRecords(): Promise<BreedingRecord[]>;
  getBreedingRecord(id: number): Promise<BreedingRecord | undefined>;
  createBreedingRecord(record: InsertBreedingRecord): Promise<BreedingRecord>;
  updateBreedingRecord(id: number, updates: Partial<InsertBreedingRecord>): Promise<BreedingRecord | undefined>;
  deleteBreedingRecord(id: number): Promise<boolean>;
  
  // Offspring
  getOffspring(): Promise<Offspring[]>;
  getOffspringByBreedingRecord(breedingRecordId: number): Promise<Offspring[]>;
  createOffspring(offspring: InsertOffspring): Promise<Offspring>;
  updateOffspring(id: number, updates: Partial<InsertOffspring>): Promise<Offspring | undefined>;
  deleteOffspring(id: number): Promise<boolean>;
  
  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
  
  // Butcher Records
  getButcherRecords(): Promise<ButcherRecord[]>;
  createButcherRecord(record: InsertButcherRecord): Promise<ButcherRecord>;
  updateButcherRecord(id: number, updates: Partial<InsertButcherRecord>): Promise<ButcherRecord | undefined>;
  deleteButcherRecord(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private rabbits: Map<number, Rabbit> = new Map();
  private breedingRecords: Map<number, BreedingRecord> = new Map();
  private offspring: Map<number, Offspring> = new Map();
  private expenses: Map<number, Expense> = new Map();
  private butcherRecords: Map<number, ButcherRecord> = new Map();
  
  private currentRabbitId = 1;
  private currentBreedingRecordId = 1;
  private currentOffspringId = 1;
  private currentExpenseId = 1;
  private currentButcherRecordId = 1;

  // Rabbits
  async getRabbits(): Promise<Rabbit[]> {
    return Array.from(this.rabbits.values());
  }

  async getRabbit(id: number): Promise<Rabbit | undefined> {
    return this.rabbits.get(id);
  }

  async createRabbit(insertRabbit: InsertRabbit): Promise<Rabbit> {
    const id = this.currentRabbitId++;
    const rabbit: Rabbit = {
      id,
      name: insertRabbit.name,
      breed: insertRabbit.breed,
      gender: insertRabbit.gender,
      birthDate: insertRabbit.birthDate,
      weight: insertRabbit.weight || null,
      color: insertRabbit.color || null,
      status: insertRabbit.status || "active",
      isBreeder: insertRabbit.isBreeder || null,
      motherId: insertRabbit.motherId || null,
      fatherId: insertRabbit.fatherId || null,
      photoUrl: insertRabbit.photoUrl || null,
      notes: insertRabbit.notes || null,
      createdAt: new Date(),
    };
    this.rabbits.set(id, rabbit);
    return rabbit;
  }

  async updateRabbit(id: number, updates: Partial<InsertRabbit>): Promise<Rabbit | undefined> {
    const rabbit = this.rabbits.get(id);
    if (!rabbit) return undefined;
    
    const updatedRabbit = { ...rabbit, ...updates };
    this.rabbits.set(id, updatedRabbit);
    return updatedRabbit;
  }

  async deleteRabbit(id: number): Promise<boolean> {
    return this.rabbits.delete(id);
  }

  // Breeding Records
  async getBreedingRecords(): Promise<BreedingRecord[]> {
    return Array.from(this.breedingRecords.values());
  }

  async getBreedingRecord(id: number): Promise<BreedingRecord | undefined> {
    return this.breedingRecords.get(id);
  }

  async createBreedingRecord(insertRecord: InsertBreedingRecord): Promise<BreedingRecord> {
    const id = this.currentBreedingRecordId++;
    const record: BreedingRecord = {
      id,
      motherId: insertRecord.motherId,
      fatherId: insertRecord.fatherId,
      matingDate: insertRecord.matingDate,
      expectedKindleDate: insertRecord.expectedKindleDate,
      actualKindleDate: insertRecord.actualKindleDate || null,
      nestBoxDate: insertRecord.nestBoxDate || null,
      litterSize: insertRecord.litterSize || null,
      kitsAlive: insertRecord.kitsAlive || null,
      status: insertRecord.status || "expecting",
      notes: insertRecord.notes || null,
      createdAt: new Date(),
    };
    this.breedingRecords.set(id, record);
    return record;
  }

  async updateBreedingRecord(id: number, updates: Partial<InsertBreedingRecord>): Promise<BreedingRecord | undefined> {
    const record = this.breedingRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord = { ...record, ...updates };
    this.breedingRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteBreedingRecord(id: number): Promise<boolean> {
    return this.breedingRecords.delete(id);
  }

  // Offspring
  async getOffspring(): Promise<Offspring[]> {
    return Array.from(this.offspring.values());
  }

  async getOffspringByBreedingRecord(breedingRecordId: number): Promise<Offspring[]> {
    return Array.from(this.offspring.values()).filter(o => o.breedingRecordId === breedingRecordId);
  }

  async createOffspring(insertOffspring: InsertOffspring): Promise<Offspring> {
    const id = this.currentOffspringId++;
    const offspring: Offspring = {
      id,
      breedingRecordId: insertOffspring.breedingRecordId,
      gender: insertOffspring.gender || null,
      weight: insertOffspring.weight || null,
      color: insertOffspring.color || null,
      status: insertOffspring.status || "alive",
      salePrice: insertOffspring.salePrice || null,
      saleDate: insertOffspring.saleDate || null,
      notes: insertOffspring.notes || null,
      createdAt: new Date(),
    };
    this.offspring.set(id, offspring);
    return offspring;
  }

  async updateOffspring(id: number, updates: Partial<InsertOffspring>): Promise<Offspring | undefined> {
    const offspring = this.offspring.get(id);
    if (!offspring) return undefined;
    
    const updatedOffspring = { ...offspring, ...updates };
    this.offspring.set(id, updatedOffspring);
    return updatedOffspring;
  }

  async deleteOffspring(id: number): Promise<boolean> {
    return this.offspring.delete(id);
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(expense => {
      return expense.date >= startDate && expense.date <= endDate;
    });
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const expense: Expense = {
      id,
      category: insertExpense.category,
      subcategory: insertExpense.subcategory || null,
      description: insertExpense.description,
      amount: insertExpense.amount,
      date: insertExpense.date,
      vendor: insertExpense.vendor || null,
      notes: insertExpense.notes || null,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    
    const updatedExpense = { ...expense, ...updates };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Butcher Records
  async getButcherRecords(): Promise<ButcherRecord[]> {
    return Array.from(this.butcherRecords.values());
  }

  async createButcherRecord(insertRecord: InsertButcherRecord): Promise<ButcherRecord> {
    const id = this.currentButcherRecordId++;
    const record: ButcherRecord = {
      id,
      rabbitId: insertRecord.rabbitId || null,
      offspringId: insertRecord.offspringId || null,
      butcherDate: insertRecord.butcherDate,
      liveWeight: insertRecord.liveWeight || null,
      dressedWeight: insertRecord.dressedWeight || null,
      processingNotes: insertRecord.processingNotes || null,
      meatDistribution: insertRecord.meatDistribution || null,
      totalValue: insertRecord.totalValue || null,
      createdAt: new Date(),
    };
    this.butcherRecords.set(id, record);
    return record;
  }

  async updateButcherRecord(id: number, updates: Partial<InsertButcherRecord>): Promise<ButcherRecord | undefined> {
    const record = this.butcherRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord = { ...record, ...updates };
    this.butcherRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteButcherRecord(id: number): Promise<boolean> {
    return this.butcherRecords.delete(id);
  }
}

export const storage = new MemStorage();
