import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, otpVerificationSchema, insertEmiCalculationSchema } from "@shared/schema";
import { z } from "zod";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateMockCreditScore(panNumber: string, income: number): number {
  // Generate a realistic credit score based on PAN and income
  const panSum = panNumber.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseScore = 600 + ((panSum % 200));
  const incomeBonus = Math.min(150, Math.floor(income / 50000) * 25);
  return Math.min(850, baseScore + incomeBonus);
}

function calculateEMI(principal: number, rate: number, tenure: number) {
  const monthlyRate = rate / (12 * 100);
  const months = tenure;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
             (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmount = Math.round(emi * months);
  const totalInterest = totalAmount - principal;
  
  return {
    monthlyEmi: Math.round(emi),
    totalAmount,
    totalInterest
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create lead with basic details
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Generate OTP and send (mock SMS service)
      const otpCode = generateOtp();
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await storage.updateLeadOtp(lead.id, otpCode, expiryTime);
      
      console.log(`Mock SMS: OTP ${otpCode} sent to ${validatedData.mobileNumber}`);
      
      res.json({ 
        leadId: lead.id, 
        message: "OTP sent successfully",
        otpSent: true 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Verify OTP
  app.post("/api/leads/verify-otp", async (req, res) => {
    try {
      const { leadId, otpCode } = otpVerificationSchema.parse(req.body);
      
      const isValid = await storage.verifyOtp(leadId, otpCode);
      
      if (isValid) {
        const lead = await storage.getLeadById(leadId);
        if (lead) {
          // Generate mock credit score
          const creditScore = generateMockCreditScore(lead.panNumber, lead.monthlyIncome);
          await storage.updateLeadCreditScore(leadId, creditScore);
          
          res.json({ 
            verified: true, 
            creditScore,
            message: "OTP verified successfully" 
          });
        } else {
          res.status(404).json({ message: "Lead not found" });
        }
      } else {
        res.status(400).json({ message: "Invalid or expired OTP" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Resend OTP
  app.post("/api/leads/:leadId/resend-otp", async (req, res) => {
    try {
      const { leadId } = req.params;
      const lead = await storage.getLeadById(leadId);
      
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      
      const otpCode = generateOtp();
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
      await storage.updateLeadOtp(leadId, otpCode, expiryTime);
      
      console.log(`Mock SMS: OTP ${otpCode} resent to ${lead.mobileNumber}`);
      
      res.json({ message: "OTP resent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get bank offers by loan type
  app.get("/api/bank-offers/:loanType", async (req, res) => {
    try {
      const { loanType } = req.params;
      const offers = await storage.getBankOffers(loanType);
      
      res.json({
        loanType,
        offers: offers.map(offer => ({
          ...offer,
          interestRate: parseFloat(offer.interestRate),
          lastUpdated: new Date().toISOString()
        })),
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Calculate EMI
  app.post("/api/calculate-emi", async (req, res) => {
    try {
      const schema = z.object({
        loanAmount: z.number().min(50000).max(50000000),
        interestRate: z.number().min(1).max(50),
        tenure: z.number().min(1).max(360),
        leadId: z.string().optional()
      });
      
      const { loanAmount, interestRate, tenure, leadId } = schema.parse(req.body);
      
      const calculation = calculateEMI(loanAmount, interestRate, tenure);
      
      if (leadId) {
        const emiCalculationData = {
          leadId,
          loanAmount,
          interestRate: interestRate.toString(),
          tenure,
          ...calculation
        };
        
        await storage.createEmiCalculation(emiCalculationData);
      }
      
      res.json({
        loanAmount,
        interestRate,
        tenure,
        ...calculation
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get lead details
  app.get("/api/leads/:leadId", async (req, res) => {
    try {
      const { leadId } = req.params;
      const lead = await storage.getLeadById(leadId);
      
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      
      // Don't return sensitive information
      const { otpCode, otpExpiry, ...safeLead } = lead;
      res.json(safeLead);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // WhatsApp share endpoint (mock)
  app.post("/api/share-whatsapp", async (req, res) => {
    try {
      const schema = z.object({
        mobileNumber: z.string(),
        message: z.string(),
        leadId: z.string().optional()
      });
      
      const { mobileNumber, message, leadId } = schema.parse(req.body);
      
      console.log(`Mock WhatsApp: Sending message to ${mobileNumber}`);
      console.log(`Message: ${message}`);
      
      // In production, integrate with WhatsApp Business API
      res.json({ 
        success: true, 
        message: "Details shared successfully on WhatsApp" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
