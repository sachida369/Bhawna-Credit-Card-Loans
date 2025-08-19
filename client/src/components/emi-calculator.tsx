import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare } from "lucide-react";

interface EmiCalculatorProps {
  leadId?: string | null;
}

interface EmiResult {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  monthlyEmi: number;
  totalAmount: number;
  totalInterest: number;
}

export default function EmiCalculator({ leadId }: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(12.0);
  const [tenure, setTenure] = useState(60); // in months
  const [emiResult, setEmiResult] = useState<EmiResult | null>(null);
  const { toast } = useToast();

  const calculateEmiMutation = useMutation({
    mutationFn: async (data: { loanAmount: number; interestRate: number; tenure: number; leadId?: string }) => {
      const response = await apiRequest("POST", "/api/calculate-emi", data);
      return response.json();
    },
    onSuccess: (data) => {
      setEmiResult(data);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: error.message || "Failed to calculate EMI",
      });
    },
  });

  const shareWhatsAppMutation = useMutation({
    mutationFn: async (message: string) => {
      // In a real app, this would use the user's mobile number from the lead
      const response = await apiRequest("POST", "/api/share-whatsapp", {
        mobileNumber: "9876543210", // Would be from lead data
        message,
        leadId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Shared Successfully",
        description: "EMI details have been shared on WhatsApp",
      });
    },
  });

  useEffect(() => {
    calculateEmiMutation.mutate({
      loanAmount,
      interestRate,
      tenure,
      leadId: leadId || undefined,
    });
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleShareWhatsApp = () => {
    if (!emiResult) return;

    const message = `🏦 Loan EMI Details
💰 Loan Amount: ${formatCurrency(emiResult.loanAmount)}
📊 Interest Rate: ${emiResult.interestRate}%
⏳ Tenure: ${emiResult.tenure} months (${(emiResult.tenure / 12).toFixed(1)} years)
💳 Monthly EMI: ${formatCurrency(emiResult.monthlyEmi)}
🔢 Total Amount: ${formatCurrency(emiResult.totalAmount)}
💸 Total Interest: ${formatCurrency(emiResult.totalInterest)}

Get the best loan deals through Bhawna DSA Partner!
Call: +91 98765 43210`;

    shareWhatsAppMutation.mutate(message);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">EMI Calculator</h2>
          <p className="text-xl text-gray-600">Calculate your monthly EMI for any loan amount</p>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Controls */}
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Loan Amount: {formatCurrency(loanAmount)}
                </Label>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={5000000}
                  min={50000}
                  step={50000}
                  className="w-full mb-2"
                  data-testid="slider-loan-amount"
                />
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                  className="w-full"
                  data-testid="input-loan-amount"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Interest Rate: {interestRate}% per annum
                </Label>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={24}
                  min={8}
                  step={0.1}
                  className="w-full mb-2"
                  data-testid="slider-interest-rate"
                />
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  step={0.1}
                  className="w-full"
                  data-testid="input-interest-rate"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Loan Tenure: {tenure} months ({(tenure / 12).toFixed(1)} years)
                </Label>
                <Slider
                  value={[tenure]}
                  onValueChange={(value) => setTenure(value[0])}
                  max={360}
                  min={12}
                  step={12}
                  className="w-full mb-2"
                  data-testid="slider-tenure"
                />
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
                  className="w-full"
                  data-testid="input-tenure"
                />
              </div>
            </div>
            
            {/* EMI Results */}
            <Card className="shadow-lg" data-testid="emi-results">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Monthly EMI</h3>
                  <div className="text-4xl font-bold text-trust-blue mb-4" data-testid="monthly-emi">
                    {emiResult ? formatCurrency(emiResult.monthlyEmi) : "Calculating..."}
                  </div>
                </div>
                
                {emiResult && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Principal Amount</span>
                      <span className="font-bold text-gray-900" data-testid="principal-amount">
                        {formatCurrency(emiResult.loanAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Total Interest</span>
                      <span className="font-bold text-gray-900" data-testid="total-interest">
                        {formatCurrency(emiResult.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-medium text-gray-700">Total Amount</span>
                      <span className="font-bold text-trust-blue text-lg" data-testid="total-amount">
                        {formatCurrency(emiResult.totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleShareWhatsApp}
                  disabled={!emiResult || shareWhatsAppMutation.isPending}
                  className="w-full mt-6 bg-success-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                  data-testid="share-whatsapp"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {shareWhatsAppMutation.isPending ? "Sharing..." : "Share EMI Details on WhatsApp"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
