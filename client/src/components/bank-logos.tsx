import bankLogosGrid from "@assets/india-banks-logo_1755236734737.jpg";

// SVG representations of major Indian banks for better display
const BankLogos = {
  HDFC: () => (
    <div className="bg-red-600 text-white p-2 rounded text-xs font-bold text-center">
      HDFC
    </div>
  ),
  ICICI: () => (
    <div className="bg-orange-500 text-white p-2 rounded text-xs font-bold text-center">
      ICICI
    </div>
  ),
  SBI: () => (
    <div className="bg-blue-800 text-white p-2 rounded text-xs font-bold text-center">
      SBI
    </div>
  ),
  AXIS: () => (
    <div className="bg-purple-600 text-white p-2 rounded text-xs font-bold text-center">
      AXIS
    </div>
  ),
  KOTAK: () => (
    <div className="bg-red-700 text-white p-2 rounded text-xs font-bold text-center">
      KOTAK
    </div>
  ),
  YES: () => (
    <div className="bg-blue-600 text-white p-2 rounded text-xs font-bold text-center">
      YES
    </div>
  ),
  IDBI: () => (
    <div className="bg-green-600 text-white p-2 rounded text-xs font-bold text-center">
      IDBI
    </div>
  ),
  UNION: () => (
    <div className="bg-indigo-600 text-white p-2 rounded text-xs font-bold text-center">
      UNION
    </div>
  ),
  BOB: () => (
    <div className="bg-orange-600 text-white p-2 rounded text-xs font-bold text-center">
      BOB
    </div>
  ),
  PNB: () => (
    <div className="bg-blue-700 text-white p-2 rounded text-xs font-bold text-center">
      PNB
    </div>
  ),
};

interface BankLogoProps {
  bankCode: string;
  bankName: string;
  size?: "sm" | "md" | "lg";
}

export function BankLogo({ bankCode, bankName, size = "md" }: BankLogoProps) {
  const LogoComponent = BankLogos[bankCode as keyof typeof BankLogos];
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  if (!LogoComponent) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-200 rounded flex items-center justify-center text-xs font-semibold text-gray-600`}>
        {bankCode}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <LogoComponent />
    </div>
  );
}

// Bank Logos Grid Component
export function BankLogosGrid() {
  const bankCodes = ["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "YES", "IDBI", "UNION", "BOB", "PNB"];
  
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted by India's Leading Banks</h3>
        <p className="text-gray-600">Official partnerships with RBI regulated financial institutions</p>
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
        {bankCodes.map((code) => (
          <div key={code} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BankLogo bankCode={code} bankName={code} size="md" />
          </div>
        ))}
      </div>
      
      {/* Original logos image as reference/background */}
      <div className="mt-8 text-center">
        <div className="inline-block relative rounded-lg overflow-hidden shadow-lg">
          <img 
            src={bankLogosGrid} 
            alt="India's Top Banks Partnership" 
            className="max-w-full h-auto opacity-90"
            style={{ maxHeight: "200px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            Official Bank Partners
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankLogo;