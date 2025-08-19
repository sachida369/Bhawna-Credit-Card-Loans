import { useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import LeadForm from "./lead-form";
import bhawnaPortrait from "@assets/Gray Simple Corporate LinkedIn Post_1755237029302.jpg";

interface HeroSectionProps {
  onLeadCreated: (leadId: string) => void;
  onOtpVerified: (creditScore: number) => void;
}

export default function HeroSection({ onLeadCreated, onOtpVerified }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-trust-blue to-blue-600 text-white py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center bg-white/10 backdrop-blur rounded-full px-3 py-1 text-sm mb-4">
              <Shield className="w-4 h-4 mr-2" />
              RBI Registered DSA Partner
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get Instant Loan Approval from
              <span className="text-yellow-400"> Top 10 Banks</span>
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Compare rates, check eligibility, and get pre-approved loans in minutes. 
              Zero processing fees for DSA customers.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-green" />
                <span>Instant Approval</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-green" />
                <span>Best Interest Rates</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-green" />
                <span>Zero Processing Fee</span>
              </div>
            </div>
            
            {/* Professional Brand Ambassador */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-1 shadow-lg">
                  <img
                    src={bhawnaPortrait}
                    alt="Bhawna - Your Trusted DSA Partner"
                    className="w-full h-full object-cover rounded-full"
                    style={{
                      clipPath: "circle(50% at 50% 45%)",
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">Bhawna Sharma</h4>
                  <p className="text-blue-200 text-sm">Certified DSA Partner | 5+ Years Experience</p>
                  <p className="text-blue-100 text-sm mt-1">"Helping 1000+ customers get best loan deals"</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lead Capture Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Loan Eligibility</h3>
              <p className="text-gray-600">Get instant pre-approval from multiple banks</p>
            </div>
            
            <LeadForm 
              onLeadCreated={onLeadCreated}
              onOtpVerified={onOtpVerified}
            />
            
            <div className="text-center mt-4 text-sm text-gray-500">
              <Shield className="inline w-4 h-4 mr-1" />
              Your information is 100% secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
