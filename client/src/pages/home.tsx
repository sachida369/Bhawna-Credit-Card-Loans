import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/hero-section";
import BankComparison from "@/components/bank-comparison";
import EmiCalculator from "@/components/emi-calculator";
import CreditScoreDisplay from "@/components/credit-score-display";
import BhawnaLogo from "@/components/bhawna-logo";
import { Phone, Shield, Headset, Rocket, Percent, Award } from "lucide-react";

export default function Home() {
  const [leadId, setLeadId] = useState<string | null>(null);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>("personal");

  const handleLeadCreated = (id: string) => {
    setLeadId(id);
  };

  const handleOtpVerified = (score: number) => {
    setCreditScore(score);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <BhawnaLogo size="md" showText={true} />
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">Customer Support:</span>
              <a href="tel:+919876543210" className="text-trust-blue font-medium hover:underline">
                <Phone className="inline w-4 h-4 mr-1" />
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection 
        onLeadCreated={handleLeadCreated}
        onOtpVerified={handleOtpVerified}
      />

      {/* Credit Score Display */}
      {creditScore && (
        <CreditScoreDisplay creditScore={creditScore} />
      )}

      {/* Bank Comparison */}
      <BankComparison 
        selectedLoanType={selectedLoanType}
        onLoanTypeChange={setSelectedLoanType}
      />

      {/* EMI Calculator */}
      <EmiCalculator leadId={leadId} />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Bhawna DSA?</h2>
            <p className="text-xl text-gray-600">Your trusted partner for all banking needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-trust-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-2xl text-trust-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Approval</h3>
              <p className="text-gray-600 text-sm">Get loan approval in minutes with our digital process</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-success-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Percent className="text-2xl text-success-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Rates</h3>
              <p className="text-gray-600 text-sm">Compare and get the lowest interest rates from top banks</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">RBI Registered</h3>
              <p className="text-gray-600 text-sm">Authorized DSA partner with full regulatory compliance</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Headset className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Dedicated relationship manager for all your queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <BhawnaLogo size="md" showText={true} theme="dark" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                RBI registered DSA partner helping customers get the best loan deals from India's top banks.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Loan Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Personal Loans</a></li>
                <li><a href="#" className="hover:text-white">Home Loans</a></li>
                <li><a href="#" className="hover:text-white">Car Loans</a></li>
                <li><a href="#" className="hover:text-white">Business Loans</a></li>
                <li><a href="#" className="hover:text-white">Credit Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">EMI Calculator</a></li>
                <li><a href="#" className="hover:text-white">Eligibility Check</a></li>
                <li><a href="#" className="hover:text-white">Interest Rates</a></li>
                <li><a href="#" className="hover:text-white">Compare Banks</a></li>
                <li><a href="#" className="hover:text-white">Credit Score</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>RBI Registration: DSA-001234</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Bhawna Credit Card & Loans DSA Partner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
