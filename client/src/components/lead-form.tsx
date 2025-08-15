import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, Smartphone } from "lucide-react";

const leadFormSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  monthlyIncome: z.number().min(25000, "Minimum income should be ₹25,000"),
  loanType: z.enum(["personal", "home", "car", "business", "creditcard"], {
    required_error: "Please select a loan type"
  }),
  consentGiven: z.boolean().refine(val => val === true, "Consent is required"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface LeadFormProps {
  onLeadCreated: (leadId: string) => void;
  onOtpVerified: (creditScore: number) => void;
}

export default function LeadForm({ onLeadCreated, onOtpVerified }: LeadFormProps) {
  const [currentStep, setCurrentStep] = useState<"lead" | "otp">("lead");
  const [leadId, setLeadId] = useState<string>("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const { toast } = useToast();

  const leadForm = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      panNumber: "",
      mobileNumber: "",
      monthlyIncome: 50000,
      loanType: "personal",
      consentGiven: false,
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: (data) => {
      setLeadId(data.leadId);
      setCurrentStep("otp");
      onLeadCreated(data.leadId);
      toast({
        title: "OTP Sent!",
        description: "Please check your mobile for the verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create lead",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { leadId: string; otpCode: string }) => {
      const response = await apiRequest("POST", "/api/leads/verify-otp", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.verified) {
        onOtpVerified(data.creditScore);
        toast({
          title: "Verification Successful!",
          description: `Your credit score: ${data.creditScore}`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/leads/${leadId}/resend-otp`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "OTP Resent",
        description: "Please check your mobile for the new verification code.",
      });
    },
  });

  const handleOtpInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-verify when all fields are filled
      if (newOtpValues.every(v => v) && newOtpValues.join("").length === 6) {
        verifyOtpMutation.mutate({
          leadId,
          otpCode: newOtpValues.join(""),
        });
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  if (currentStep === "otp") {
    return (
      <div className="space-y-6" data-testid="otp-verification-form">
        <div className="text-center mb-4">
          <Smartphone className="mx-auto w-12 h-12 text-trust-blue mb-2" />
          <h4 className="text-lg font-semibold text-gray-900">OTP Verification</h4>
          <p className="text-sm text-gray-600">Enter the 6-digit code sent to your mobile</p>
        </div>
        
        <div className="flex justify-center space-x-2 mb-4">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpInputChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold"
              data-testid={`otp-input-${index}`}
            />
          ))}
        </div>
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => resendOtpMutation.mutate()}
          disabled={resendOtpMutation.isPending}
          className="w-full text-trust-blue"
          data-testid="resend-otp-button"
        >
          {resendOtpMutation.isPending ? "Resending..." : "Didn't receive OTP? Resend"}
        </Button>
      </div>
    );
  }

  return (
    <form 
      onSubmit={leadForm.handleSubmit((data) => createLeadMutation.mutate(data))}
      className="space-y-4"
      data-testid="lead-capture-form"
    >
      <div>
        <Label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-2">
          PAN Number
        </Label>
        <Input
          id="panNumber"
          type="text"
          placeholder="ABCDE1234F"
          {...leadForm.register("panNumber", {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          })}
          className="w-full"
          data-testid="input-pan"
        />
        {leadForm.formState.errors.panNumber && (
          <p className="mt-1 text-sm text-red-600">{leadForm.formState.errors.panNumber.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number
        </Label>
        <Input
          id="mobileNumber"
          type="tel"
          placeholder="9876543210"
          {...leadForm.register("mobileNumber")}
          className="w-full"
          data-testid="input-mobile"
        />
        {leadForm.formState.errors.mobileNumber && (
          <p className="mt-1 text-sm text-red-600">{leadForm.formState.errors.mobileNumber.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Income
        </Label>
        <Select
          value={leadForm.watch("monthlyIncome")?.toString()}
          onValueChange={(value) => leadForm.setValue("monthlyIncome", parseInt(value))}
        >
          <SelectTrigger data-testid="select-income">
            <SelectValue placeholder="Select Income Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25000">₹25,000 - ₹50,000</SelectItem>
            <SelectItem value="50000">₹50,000 - ₹1,00,000</SelectItem>
            <SelectItem value="100000">₹1,00,000 - ₹2,00,000</SelectItem>
            <SelectItem value="200000">₹2,00,000+</SelectItem>
          </SelectContent>
        </Select>
        {leadForm.formState.errors.monthlyIncome && (
          <p className="mt-1 text-sm text-red-600">{leadForm.formState.errors.monthlyIncome.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-2">
          Loan Type
        </Label>
        <Select
          value={leadForm.watch("loanType")}
          onValueChange={(value) => leadForm.setValue("loanType", value as any)}
        >
          <SelectTrigger data-testid="select-loan-type">
            <SelectValue placeholder="Select Loan Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal Loan</SelectItem>
            <SelectItem value="home">Home Loan</SelectItem>
            <SelectItem value="car">Car Loan</SelectItem>
            <SelectItem value="business">Business Loan</SelectItem>
            <SelectItem value="creditcard">Credit Card</SelectItem>
          </SelectContent>
        </Select>
        {leadForm.formState.errors.loanType && (
          <p className="mt-1 text-sm text-red-600">{leadForm.formState.errors.loanType.message}</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="consent"
          checked={leadForm.watch("consentGiven")}
          onCheckedChange={(checked) => leadForm.setValue("consentGiven", !!checked)}
          data-testid="checkbox-consent"
        />
        <Label htmlFor="consent" className="text-sm text-gray-600">
          I agree to share my information with banks and authorize them to contact me for loan offers.
          I have read and accept the terms & conditions.
        </Label>
      </div>
      {leadForm.formState.errors.consentGiven && (
        <p className="text-sm text-red-600">{leadForm.formState.errors.consentGiven.message}</p>
      )}

      <Button
        type="submit"
        disabled={createLeadMutation.isPending}
        className="w-full bg-trust-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        data-testid="button-submit"
      >
        <span>{createLeadMutation.isPending ? "Processing..." : "Check Eligibility"}</span>
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </form>
  );
}
