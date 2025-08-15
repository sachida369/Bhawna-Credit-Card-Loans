import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  panNumber: varchar("pan_number", { length: 10 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 10 }).notNull(),
  monthlyIncome: integer("monthly_income").notNull(),
  loanType: varchar("loan_type", { length: 20 }).notNull(),
  creditScore: integer("credit_score"),
  isOtpVerified: boolean("is_otp_verified").default(false),
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiry: timestamp("otp_expiry"),
  consentGiven: boolean("consent_given").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bankOffers = pgTable("bank_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bankName: varchar("bank_name", { length: 100 }).notNull(),
  bankCode: varchar("bank_code", { length: 20 }).notNull(),
  loanType: varchar("loan_type", { length: 20 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  processingFee: integer("processing_fee").notNull(),
  maxLoanAmount: integer("max_loan_amount").notNull(),
  minCibilScore: integer("min_cibil_score").notNull(),
  tenureMin: integer("tenure_min").notNull(),
  tenureMax: integer("tenure_max").notNull(),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const emiCalculations = pgTable("emi_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  loanAmount: integer("loan_amount").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  tenure: integer("tenure").notNull(),
  monthlyEmi: integer("monthly_emi").notNull(),
  totalInterest: integer("total_interest").notNull(),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  creditScore: true,
  isOtpVerified: true,
  otpCode: true,
  otpExpiry: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  monthlyIncome: z.number().min(25000, "Minimum income should be ₹25,000"),
  loanType: z.enum(["personal", "home", "car", "business", "creditcard"]),
});

export const insertBankOfferSchema = createInsertSchema(bankOffers).omit({
  id: true,
  lastUpdated: true,
});

export const insertEmiCalculationSchema = createInsertSchema(emiCalculations).omit({
  id: true,
  createdAt: true,
});

export const otpVerificationSchema = z.object({
  leadId: z.string(),
  otpCode: z.string().length(6, "OTP must be 6 digits"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertBankOffer = z.infer<typeof insertBankOfferSchema>;
export type BankOffer = typeof bankOffers.$inferSelect;
export type InsertEmiCalculation = z.infer<typeof insertEmiCalculationSchema>;
export type EmiCalculation = typeof emiCalculations.$inferSelect;
export type OtpVerification = z.infer<typeof otpVerificationSchema>;
