import bhawnaPortrait from "@assets/Gray Simple Corporate LinkedIn Post_1755237029302.jpg";

interface BhawnaLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  theme?: "light" | "dark";
}

export default function BhawnaLogo({ size = "md", showText = true, theme = "light" }: BhawnaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-trust-blue to-blue-600 p-0.5 shadow-lg`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          <img
            src={bhawnaPortrait}
            alt="Bhawna - DSA Partner"
            className="w-full h-full object-cover object-center"
            style={{
              clipPath: "circle(50% at 50% 45%)",
            }}
          />
        </div>
      </div>
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Bhawna Credit Card & Loans
          </h1>
          <p className={`${size === 'sm' ? 'text-xs' : 'text-sm'} ${theme === 'light' ? 'text-trust-blue' : 'text-gray-300'} font-medium`}>
            Authorized DSA Partner
          </p>
        </div>
      )}
    </div>
  );
}