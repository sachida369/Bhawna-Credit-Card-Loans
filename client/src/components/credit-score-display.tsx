interface CreditScoreDisplayProps {
  creditScore: number;
}

export default function CreditScoreDisplay({ creditScore }: CreditScoreDisplayProps) {
  const getScoreGrade = (score: number) => {
    if (score >= 750) return { grade: "Excellent", color: "text-success-green", bgColor: "bg-success-green" };
    if (score >= 700) return { grade: "Good", color: "text-blue-600", bgColor: "bg-blue-600" };
    if (score >= 650) return { grade: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-600" };
    return { grade: "Poor", color: "text-red-600", bgColor: "bg-red-600" };
  };

  const { grade, color, bgColor } = getScoreGrade(creditScore);

  return (
    <section className="bg-white py-12" data-testid="credit-score-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${bgColor} rounded-2xl p-8 text-white text-center`}>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold" data-testid="credit-score-value">{creditScore}</div>
                  <div className="text-sm opacity-90">CREDIT SCORE</div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">{grade} Credit Score!</h3>
          <p className="opacity-90 mb-4">
            {creditScore >= 750 
              ? "You are eligible for premium loan offers from top banks" 
              : "You can still get competitive loan offers from our partner banks"
            }
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">12+</div>
              <div className="text-sm opacity-90">Bank Offers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {creditScore >= 750 ? "8.5%" : creditScore >= 700 ? "10.5%" : "12.5%"}
              </div>
              <div className="text-sm opacity-90">Min Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">₹50L</div>
              <div className="text-sm opacity-90">Max Amount</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
