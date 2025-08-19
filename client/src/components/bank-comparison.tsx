import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield } from "lucide-react";
import { BankLogo, BankLogosGrid } from "@/components/bank-logos";

interface BankOffer {
  id: string;
  bankName: string;
  bankCode: string;
  interestRate: string;
  processingFee: number;
  maxLoanAmount: number;
  minCibilScore: number;
  tenureMin: number;
  tenureMax: number;
  isActive: boolean;
}

interface BankComparisonProps {
  selectedLoanType: string;
  onLoanTypeChange: (loanType: string) => void;
}

const loanTypes = [
  { value: "personal", label: "Personal Loan" },
  { value: "home", label: "Home Loan" },
  { value: "car", label: "Car Loan" },
  { value: "business", label: "Business Loan" },
];



export default function BankComparison({ selectedLoanType, onLoanTypeChange }: BankComparisonProps) {
  const { data: offersData, isLoading, error } = useQuery({
    queryKey: ['/api/bank-offers', selectedLoanType],
    refetchInterval: 60000, // Refresh every minute for real-time rates
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(0)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare Loan Offers from India's Top 10 Banks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time interest rates and terms from leading banks. Updated every hour for accuracy.
          </p>
        </div>

        {/* Bank Logos Grid */}
        <BankLogosGrid />

        {/* Loan Type Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {loanTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedLoanType === type.value ? "default" : "outline"}
              onClick={() => onLoanTypeChange(type.value)}
              className={`${
                selectedLoanType === type.value
                  ? "bg-trust-blue text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } px-6 py-2 rounded-full font-medium transition-colors`}
              data-testid={`filter-${type.value}`}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center" data-testid="loading-offers">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading latest offers...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600" data-testid="error-offers">
              Failed to load bank offers. Please try again.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="bank-offers-table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Interest Rate</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Processing Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Max Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Min CIBIL</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {offersData?.offers?.map((offer: BankOffer, index: number) => (
                      <tr key={offer.id} className="hover:bg-gray-50" data-testid={`bank-row-${index}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <BankLogo bankCode={offer.bankCode} bankName={offer.bankName} size="md" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{offer.bankName}</div>
                              <div className="text-sm text-gray-500">
                                {["SBI", "UNION", "BOB", "PNB"].includes(offer.bankCode) ? "Public Bank" : "Private Bank"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-success-green">
                            {parseFloat(offer.interestRate).toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-500">onwards</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">
                            {offer.processingFee === 0 ? "₹0" : `₹${offer.processingFee.toLocaleString()}`}
                          </div>
                          {offer.processingFee === 0 ? (
                            <div className="text-sm text-success-green">DSA Offer</div>
                          ) : (
                            <div className="text-sm text-gray-500">+ GST</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{formatCurrency(offer.maxLoanAmount)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{offer.minCibilScore}+</div>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            className="bg-trust-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            data-testid={`apply-${offer.bankCode.toLowerCase()}`}
                          >
                            Apply Now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 px-6 py-4 text-center">
                <p className="text-sm text-gray-600">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Rates updated: <span className="font-medium">{new Date(offersData?.lastUpdated || new Date()).toLocaleTimeString()}</span> | 
                  <Shield className="inline w-4 h-4 ml-3 mr-1" />
                  RBI Approved Banks Only
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
