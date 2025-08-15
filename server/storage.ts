import { type User, type InsertUser, type Lead, type InsertLead, type BankOffer, type InsertBankOffer, type EmiCalculation, type InsertEmiCalculation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadById(id: string): Promise<Lead | undefined>;
  updateLeadOtp(leadId: string, otpCode: string, expiryTime: Date): Promise<void>;
  verifyOtp(leadId: string, otpCode: string): Promise<boolean>;
  updateLeadCreditScore(leadId: string, creditScore: number): Promise<void>;
  
  getBankOffers(loanType: string): Promise<BankOffer[]>;
  createBankOffer(offer: InsertBankOffer): Promise<BankOffer>;
  updateBankOffers(offers: InsertBankOffer[]): Promise<void>;
  
  createEmiCalculation(calculation: InsertEmiCalculation): Promise<EmiCalculation>;
  getEmiCalculationsByLead(leadId: string): Promise<EmiCalculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private bankOffers: Map<string, BankOffer>;
  private emiCalculations: Map<string, EmiCalculation>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.bankOffers = new Map();
    this.emiCalculations = new Map();
    
    // Initialize with top 10 Indian banks data
    this.initializeBankOffers();
  }

  private initializeBankOffers() {
    const initialOffers: InsertBankOffer[] = [
      // Personal Loans
      { bankName: "HDFC Bank", bankCode: "HDFC", loanType: "personal", interestRate: "10.50", processingFee: 0, maxLoanAmount: 4000000, minCibilScore: 700, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "ICICI Bank", bankCode: "ICICI", loanType: "personal", interestRate: "10.75", processingFee: 0, maxLoanAmount: 5000000, minCibilScore: 650, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "State Bank of India", bankCode: "SBI", loanType: "personal", interestRate: "9.95", processingFee: 999, maxLoanAmount: 3000000, minCibilScore: 700, tenureMin: 12, tenureMax: 84, isActive: true },
      { bankName: "Axis Bank", bankCode: "AXIS", loanType: "personal", interestRate: "11.25", processingFee: 0, maxLoanAmount: 4000000, minCibilScore: 650, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "Kotak Mahindra Bank", bankCode: "KOTAK", loanType: "personal", interestRate: "10.99", processingFee: 999, maxLoanAmount: 3000000, minCibilScore: 700, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "Yes Bank", bankCode: "YES", loanType: "personal", interestRate: "11.50", processingFee: 2999, maxLoanAmount: 2500000, minCibilScore: 650, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "IDBI Bank", bankCode: "IDBI", loanType: "personal", interestRate: "10.25", processingFee: 1499, maxLoanAmount: 2000000, minCibilScore: 700, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "Union Bank of India", bankCode: "UNION", loanType: "personal", interestRate: "9.75", processingFee: 1999, maxLoanAmount: 2500000, minCibilScore: 650, tenureMin: 12, tenureMax: 72, isActive: true },
      { bankName: "Bank of Baroda", bankCode: "BOB", loanType: "personal", interestRate: "9.85", processingFee: 1499, maxLoanAmount: 3000000, minCibilScore: 700, tenureMin: 12, tenureMax: 60, isActive: true },
      { bankName: "Punjab National Bank", bankCode: "PNB", loanType: "personal", interestRate: "9.50", processingFee: 999, maxLoanAmount: 2000000, minCibilScore: 700, tenureMin: 12, tenureMax: 72, isActive: true },
      
      // Home Loans
      { bankName: "HDFC Bank", bankCode: "HDFC", loanType: "home", interestRate: "8.50", processingFee: 0, maxLoanAmount: 50000000, minCibilScore: 700, tenureMin: 60, tenureMax: 360, isActive: true },
      { bankName: "ICICI Bank", bankCode: "ICICI", loanType: "home", interestRate: "8.75", processingFee: 0, maxLoanAmount: 75000000, minCibilScore: 650, tenureMin: 60, tenureMax: 360, isActive: true },
      { bankName: "State Bank of India", bankCode: "SBI", loanType: "home", interestRate: "8.25", processingFee: 10000, maxLoanAmount: 100000000, minCibilScore: 700, tenureMin: 60, tenureMax: 360, isActive: true },
      { bankName: "Axis Bank", bankCode: "AXIS", loanType: "home", interestRate: "8.95", processingFee: 0, maxLoanAmount: 50000000, minCibilScore: 650, tenureMin: 60, tenureMax: 360, isActive: true },
      { bankName: "Kotak Mahindra Bank", bankCode: "KOTAK", loanType: "home", interestRate: "8.65", processingFee: 5000, maxLoanAmount: 30000000, minCibilScore: 700, tenureMin: 60, tenureMax: 360, isActive: true },
      
      // Car Loans
      { bankName: "HDFC Bank", bankCode: "HDFC", loanType: "car", interestRate: "8.75", processingFee: 0, maxLoanAmount: 2000000, minCibilScore: 650, tenureMin: 12, tenureMax: 84, isActive: true },
      { bankName: "ICICI Bank", bankCode: "ICICI", loanType: "car", interestRate: "9.00", processingFee: 0, maxLoanAmount: 2500000, minCibilScore: 600, tenureMin: 12, tenureMax: 84, isActive: true },
      { bankName: "State Bank of India", bankCode: "SBI", loanType: "car", interestRate: "8.50", processingFee: 2999, maxLoanAmount: 1500000, minCibilScore: 650, tenureMin: 12, tenureMax: 84, isActive: true },
      { bankName: "Axis Bank", bankCode: "AXIS", loanType: "car", interestRate: "9.25", processingFee: 0, maxLoanAmount: 2000000, minCibilScore: 600, tenureMin: 12, tenureMax: 84, isActive: true },
      
      // Business Loans
      { bankName: "HDFC Bank", bankCode: "HDFC", loanType: "business", interestRate: "11.50", processingFee: 0, maxLoanAmount: 10000000, minCibilScore: 700, tenureMin: 12, tenureMax: 84, isActive: true },
      { bankName: "ICICI Bank", bankCode: "ICICI", loanType: "business", interestRate: "12.00", processingFee: 0, maxLoanAmount: 15000000, minCibilScore: 650, tenureMin: 12, tenureMax: 84, isActive: true },
      { bankName: "State Bank of India", bankCode: "SBI", loanType: "business", interestRate: "10.75", processingFee: 5000, maxLoanAmount: 20000000, minCibilScore: 700, tenureMin: 12, tenureMax: 120, isActive: true },
    ];

    initialOffers.forEach(offer => {
      const id = randomUUID();
      const bankOffer: BankOffer = {
        ...offer,
        id,
        lastUpdated: new Date(),
      };
      this.bankOffers.set(id, bankOffer);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const now = new Date();
    const lead: Lead = {
      ...insertLead,
      id,
      creditScore: null,
      isOtpVerified: false,
      otpCode: null,
      otpExpiry: null,
      createdAt: now,
      updatedAt: now,
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async updateLeadOtp(leadId: string, otpCode: string, expiryTime: Date): Promise<void> {
    const lead = this.leads.get(leadId);
    if (lead) {
      lead.otpCode = otpCode;
      lead.otpExpiry = expiryTime;
      lead.updatedAt = new Date();
      this.leads.set(leadId, lead);
    }
  }

  async verifyOtp(leadId: string, otpCode: string): Promise<boolean> {
    const lead = this.leads.get(leadId);
    if (!lead || !lead.otpCode || !lead.otpExpiry) {
      return false;
    }
    
    const now = new Date();
    if (now > lead.otpExpiry) {
      return false;
    }
    
    if (lead.otpCode === otpCode) {
      lead.isOtpVerified = true;
      lead.otpCode = null;
      lead.otpExpiry = null;
      lead.updatedAt = now;
      this.leads.set(leadId, lead);
      return true;
    }
    
    return false;
  }

  async updateLeadCreditScore(leadId: string, creditScore: number): Promise<void> {
    const lead = this.leads.get(leadId);
    if (lead) {
      lead.creditScore = creditScore;
      lead.updatedAt = new Date();
      this.leads.set(leadId, lead);
    }
  }

  async getBankOffers(loanType: string): Promise<BankOffer[]> {
    return Array.from(this.bankOffers.values())
      .filter(offer => offer.loanType === loanType && offer.isActive)
      .sort((a, b) => parseFloat(a.interestRate) - parseFloat(b.interestRate));
  }

  async createBankOffer(insertOffer: InsertBankOffer): Promise<BankOffer> {
    const id = randomUUID();
    const offer: BankOffer = {
      ...insertOffer,
      id,
      lastUpdated: new Date(),
    };
    this.bankOffers.set(id, offer);
    return offer;
  }

  async updateBankOffers(offers: InsertBankOffer[]): Promise<void> {
    offers.forEach(offer => {
      const id = randomUUID();
      const bankOffer: BankOffer = {
        ...offer,
        id,
        lastUpdated: new Date(),
      };
      this.bankOffers.set(id, bankOffer);
    });
  }

  async createEmiCalculation(insertCalculation: InsertEmiCalculation): Promise<EmiCalculation> {
    const id = randomUUID();
    const calculation: EmiCalculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
    };
    this.emiCalculations.set(id, calculation);
    return calculation;
  }

  async getEmiCalculationsByLead(leadId: string): Promise<EmiCalculation[]> {
    return Array.from(this.emiCalculations.values())
      .filter(calc => calc.leadId === leadId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }
}

export const storage = new MemStorage();
