// DSA Platform JavaScript
class DSAApplication {
    constructor() {
        this.bankOffers = {
            personal: [
                { bankName: "HDFC Bank", bankCode: "HDFC", interestRate: 10.50, processingFee: 0, maxLoanAmount: 4000000, minCibilScore: 700 },
                { bankName: "ICICI Bank", bankCode: "ICICI", interestRate: 10.75, processingFee: 0, maxLoanAmount: 5000000, minCibilScore: 650 },
                { bankName: "State Bank of India", bankCode: "SBI", interestRate: 9.95, processingFee: 999, maxLoanAmount: 3000000, minCibilScore: 700 },
                { bankName: "Axis Bank", bankCode: "AXIS", interestRate: 11.25, processingFee: 0, maxLoanAmount: 4000000, minCibilScore: 650 },
                { bankName: "Kotak Mahindra Bank", bankCode: "KOTAK", interestRate: 10.99, processingFee: 999, maxLoanAmount: 3000000, minCibilScore: 700 },
                { bankName: "Yes Bank", bankCode: "YES", interestRate: 11.50, processingFee: 2999, maxLoanAmount: 2500000, minCibilScore: 650 },
                { bankName: "IDBI Bank", bankCode: "IDBI", interestRate: 10.25, processingFee: 1499, maxLoanAmount: 2000000, minCibilScore: 700 },
                { bankName: "Union Bank of India", bankCode: "UNION", interestRate: 9.75, processingFee: 1999, maxLoanAmount: 2500000, minCibilScore: 650 },
                { bankName: "Bank of Baroda", bankCode: "BOB", interestRate: 9.85, processingFee: 1499, maxLoanAmount: 3000000, minCibilScore: 700 },
                { bankName: "Punjab National Bank", bankCode: "PNB", interestRate: 9.50, processingFee: 999, maxLoanAmount: 2000000, minCibilScore: 700 }
            ],
            home: [
                { bankName: "HDFC Bank", bankCode: "HDFC", interestRate: 8.50, processingFee: 0, maxLoanAmount: 50000000, minCibilScore: 700 },
                { bankName: "ICICI Bank", bankCode: "ICICI", interestRate: 8.75, processingFee: 0, maxLoanAmount: 75000000, minCibilScore: 650 },
                { bankName: "State Bank of India", bankCode: "SBI", interestRate: 8.25, processingFee: 10000, maxLoanAmount: 100000000, minCibilScore: 700 },
                { bankName: "Axis Bank", bankCode: "AXIS", interestRate: 8.95, processingFee: 0, maxLoanAmount: 50000000, minCibilScore: 650 },
                { bankName: "Kotak Mahindra Bank", bankCode: "KOTAK", interestRate: 8.65, processingFee: 5000, maxLoanAmount: 30000000, minCibilScore: 700 }
            ],
            car: [
                { bankName: "HDFC Bank", bankCode: "HDFC", interestRate: 8.75, processingFee: 0, maxLoanAmount: 2000000, minCibilScore: 650 },
                { bankName: "ICICI Bank", bankCode: "ICICI", interestRate: 9.00, processingFee: 0, maxLoanAmount: 2500000, minCibilScore: 600 },
                { bankName: "State Bank of India", bankCode: "SBI", interestRate: 8.50, processingFee: 2999, maxLoanAmount: 1500000, minCibilScore: 650 },
                { bankName: "Axis Bank", bankCode: "AXIS", interestRate: 9.25, processingFee: 0, maxLoanAmount: 2000000, minCibilScore: 600 }
            ],
            business: [
                { bankName: "HDFC Bank", bankCode: "HDFC", interestRate: 11.50, processingFee: 0, maxLoanAmount: 10000000, minCibilScore: 700 },
                { bankName: "ICICI Bank", bankCode: "ICICI", interestRate: 12.00, processingFee: 0, maxLoanAmount: 15000000, minCibilScore: 650 },
                { bankName: "State Bank of India", bankCode: "SBI", interestRate: 10.75, processingFee: 5000, maxLoanAmount: 20000000, minCibilScore: 700 }
            ]
        };
        
        this.currentLoanType = 'personal';
        this.currentStep = 'lead'; // lead, otp, verified
        this.leadData = {};
        this.creditScore = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBankOffers();
        this.updateEMICalculation();
        this.updateLastUpdated();
    }

    setupEventListeners() {
        // Lead form submission
        document.getElementById('leadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLeadSubmission();
        });

        // OTP input handling
        document.querySelectorAll('.otp-input').forEach((input, index) => {
            input.addEventListener('input', (e) => {
                this.handleOTPInput(e, index);
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    document.querySelectorAll('.otp-input')[index - 1].focus();
                }
            });
        });

        // Resend OTP
        document.getElementById('resendOtp').addEventListener('click', () => {
            this.resendOTP();
        });

        // Loan type filter buttons
        document.querySelectorAll('.loan-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleLoanTypeChange(e.target.dataset.type);
            });
        });

        // EMI Calculator sliders and inputs
        const loanAmountSlider = document.getElementById('loanAmountSlider');
        const loanAmountInput = document.getElementById('loanAmountInput');
        const interestRateSlider = document.getElementById('interestRateSlider');
        const interestRateInput = document.getElementById('interestRateInput');
        const tenureSlider = document.getElementById('tenureSlider');
        const tenureInput = document.getElementById('tenureInput');

        // Sync sliders with inputs
        loanAmountSlider.addEventListener('input', (e) => {
            loanAmountInput.value = e.target.value;
            this.updateEMICalculation();
        });
        
        loanAmountInput.addEventListener('input', (e) => {
            loanAmountSlider.value = e.target.value;
            this.updateEMICalculation();
        });

        interestRateSlider.addEventListener('input', (e) => {
            interestRateInput.value = e.target.value;
            this.updateEMICalculation();
        });
        
        interestRateInput.addEventListener('input', (e) => {
            interestRateSlider.value = e.target.value;
            this.updateEMICalculation();
        });

        tenureSlider.addEventListener('input', (e) => {
            tenureInput.value = e.target.value;
            this.updateEMICalculation();
        });
        
        tenureInput.addEventListener('input', (e) => {
            tenureSlider.value = e.target.value;
            this.updateEMICalculation();
        });

        // WhatsApp share button
        document.getElementById('shareWhatsApp').addEventListener('click', () => {
            this.shareOnWhatsApp();
        });
    }

    validatePAN(pan) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    }

    validateMobile(mobile) {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(mobile);
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = field.nextElementSibling;
        
        field.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = field.nextElementSibling;
        
        field.classList.remove('error');
        errorDiv.classList.add('hidden');
    }

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.add('hidden');
        });
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    handleLeadSubmission() {
        this.clearAllErrors();
        
        const panNumber = document.getElementById('panNumber').value.trim().toUpperCase();
        const mobileNumber = document.getElementById('mobileNumber').value.trim();
        const monthlyIncome = document.getElementById('monthlyIncome').value;
        const loanType = document.getElementById('loanType').value;
        const consent = document.getElementById('consent').checked;
        
        let isValid = true;

        // Validate PAN
        if (!panNumber) {
            this.showError('panNumber', 'PAN number is required');
            isValid = false;
        } else if (!this.validatePAN(panNumber)) {
            this.showError('panNumber', 'Invalid PAN format (e.g., ABCDE1234F)');
            isValid = false;
        }

        // Validate Mobile
        if (!mobileNumber) {
            this.showError('mobileNumber', 'Mobile number is required');
            isValid = false;
        } else if (!this.validateMobile(mobileNumber)) {
            this.showError('mobileNumber', 'Invalid mobile number');
            isValid = false;
        }

        // Validate Income
        if (!monthlyIncome) {
            this.showError('monthlyIncome', 'Monthly income is required');
            isValid = false;
        }

        // Validate Loan Type
        if (!loanType) {
            this.showError('loanType', 'Loan type is required');
            isValid = false;
        }

        // Validate Consent
        if (!consent) {
            document.getElementById('consentError').textContent = 'Consent is required to proceed';
            document.getElementById('consentError').classList.remove('hidden');
            isValid = false;
        }

        if (isValid) {
            this.leadData = { panNumber, mobileNumber, monthlyIncome, loanType };
            this.sendOTP();
        }
    }

    sendOTP() {
        // Show loading state
        const submitBtn = document.querySelector('#leadForm button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i>Processing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            const otp = Math.floor(100000 + Math.random() * 900000);
            console.log(`Mock SMS: OTP ${otp} sent to ${this.leadData.mobileNumber}`);
            
            // Show OTP form
            document.getElementById('leadForm').classList.add('hidden');
            document.getElementById('otpForm').classList.remove('hidden');
            
            this.showToast('OTP sent successfully to your mobile number');
            
            // Reset button
            submitBtn.innerHTML = 'Check Eligibility <i class="fas fa-arrow-right ml-2"></i>';
            submitBtn.disabled = false;
            
            // Store OTP for verification (in real app, this would be server-side)
            this.sentOTP = otp.toString();
        }, 2000);
    }

    handleOTPInput(event, index) {
        const input = event.target;
        const value = input.value;

        // Only allow digits
        if (!/^\d$/.test(value)) {
            input.value = '';
            return;
        }

        // Move to next input
        if (value && index < 5) {
            document.querySelectorAll('.otp-input')[index + 1].focus();
        }

        // Check if all inputs are filled
        const otpInputs = document.querySelectorAll('.otp-input');
        const otpValue = Array.from(otpInputs).map(inp => inp.value).join('');
        
        if (otpValue.length === 6) {
            this.verifyOTP(otpValue);
        }
    }

    verifyOTP(otp) {
        // In real app, verify against server
        if (otp === this.sentOTP || otp === '123456') { // Allow test OTP
            this.creditScore = this.generateMockCreditScore();
            this.showCreditScore();
            this.showToast('OTP verified successfully!');
        } else {
            this.showToast('Invalid OTP. Please try again.', 'error');
            // Clear OTP inputs
            document.querySelectorAll('.otp-input').forEach(input => {
                input.value = '';
            });
            document.querySelectorAll('.otp-input')[0].focus();
        }
    }

    generateMockCreditScore() {
        const panSum = this.leadData.panNumber.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const baseScore = 600 + (panSum % 200);
        const incomeBonus = Math.min(150, Math.floor(parseInt(this.leadData.monthlyIncome) / 50000) * 25);
        return Math.min(850, baseScore + incomeBonus);
    }

    showCreditScore() {
        const section = document.getElementById('creditScoreSection');
        const card = document.getElementById('creditScoreCard');
        const value = document.getElementById('creditScoreValue');
        const grade = document.getElementById('creditScoreGrade');
        const message = document.getElementById('creditScoreMessage');
        const minRate = document.getElementById('minRate');

        value.textContent = this.creditScore;

        let gradeText, cardColor, rateText;
        if (this.creditScore >= 750) {
            gradeText = 'Excellent Credit Score!';
            cardColor = 'bg-green-600';
            rateText = '8.5%';
        } else if (this.creditScore >= 700) {
            gradeText = 'Good Credit Score!';
            cardColor = 'bg-blue-600';
            rateText = '10.5%';
        } else if (this.creditScore >= 650) {
            gradeText = 'Fair Credit Score!';
            cardColor = 'bg-yellow-600';
            rateText = '12.5%';
        } else {
            gradeText = 'Credit Score Needs Improvement';
            cardColor = 'bg-red-600';
            rateText = '15.5%';
        }

        grade.textContent = gradeText;
        minRate.textContent = rateText;
        card.className = `${cardColor} rounded-2xl p-8 text-white text-center`;
        
        message.textContent = this.creditScore >= 750 
            ? 'You are eligible for premium loan offers from top banks'
            : 'You can still get competitive loan offers from our partner banks';

        section.classList.remove('hidden');
        section.scrollIntoView({ behavior: 'smooth' });
    }

    resendOTP() {
        this.sendOTP();
        this.showToast('OTP resent to your mobile number');
    }

    handleLoanTypeChange(type) {
        this.currentLoanType = type;
        
        // Update active button
        document.querySelectorAll('.loan-type-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-50', 'border');
        });
        
        const activeBtn = document.querySelector(`[data-type="${type}"]`);
        activeBtn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-50', 'border');
        activeBtn.classList.add('active', 'bg-blue-600', 'text-white');
        
        this.updateBankOffers();
    }

    updateBankOffers() {
        const tbody = document.getElementById('bankOffersBody');
        const offers = this.bankOffers[this.currentLoanType] || [];
        
        tbody.innerHTML = '';
        
        offers.forEach((offer, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            const bankType = ['SBI', 'UNION', 'BOB', 'PNB'].includes(offer.bankCode) ? 'Public Bank' : 'Private Bank';
            const logoColor = this.getBankLogoColor(offer.bankCode);
            
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="mr-3">
                            <div class="w-10 h-10 flex items-center justify-center">
                                <div class="${logoColor} text-white p-2 rounded text-xs font-bold text-center">${offer.bankCode}</div>
                            </div>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-900">${offer.bankName}</div>
                            <div class="text-sm text-gray-500">${bankType}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-lg font-bold text-green-600">${offer.interestRate.toFixed(2)}%</div>
                    <div class="text-sm text-gray-500">onwards</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold">
                        ${offer.processingFee === 0 ? '₹0' : `₹${offer.processingFee.toLocaleString()}`}
                    </div>
                    ${offer.processingFee === 0 
                        ? '<div class="text-sm text-green-600">DSA Offer</div>' 
                        : '<div class="text-sm text-gray-500">+ GST</div>'
                    }
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold">${this.formatCurrency(offer.maxLoanAmount)}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold">${offer.minCibilScore}+</div>
                </td>
                <td class="px-6 py-4">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors" onclick="app.applyForLoan('${offer.bankCode}')">
                        Apply Now
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    getBankLogoColor(bankCode) {
        const colors = {
            'HDFC': 'bg-red-600',
            'ICICI': 'bg-orange-500',
            'SBI': 'bg-blue-800',
            'AXIS': 'bg-purple-600',
            'KOTAK': 'bg-red-700',
            'YES': 'bg-blue-600',
            'IDBI': 'bg-green-600',
            'UNION': 'bg-indigo-600',
            'BOB': 'bg-orange-600',
            'PNB': 'bg-blue-700'
        };
        return colors[bankCode] || 'bg-gray-600';
    }

    formatCurrency(amount) {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(0)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} L`;
        return `₹${(amount / 1000).toFixed(0)}K`;
    }

    updateEMICalculation() {
        const loanAmount = parseInt(document.getElementById('loanAmountInput').value);
        const interestRate = parseFloat(document.getElementById('interestRateInput').value);
        const tenure = parseInt(document.getElementById('tenureInput').value);

        // Update display values
        document.getElementById('loanAmountDisplay').textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(loanAmount);
        
        document.getElementById('interestRateDisplay').textContent = `${interestRate.toFixed(1)}%`;
        document.getElementById('tenureDisplay').textContent = `${tenure} months (${(tenure / 12).toFixed(1)} years)`;

        // Calculate EMI
        const monthlyRate = interestRate / (12 * 100);
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                   (Math.pow(1 + monthlyRate, tenure) - 1);
        const totalAmount = Math.round(emi * tenure);
        const totalInterest = totalAmount - loanAmount;

        // Update results
        document.getElementById('monthlyEmi').textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(emi));

        document.getElementById('principalAmount').textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(loanAmount);

        document.getElementById('totalInterest').textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(totalInterest);

        document.getElementById('totalAmount').textContent = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(totalAmount);
    }

    shareOnWhatsApp() {
        const loanAmount = parseInt(document.getElementById('loanAmountInput').value);
        const interestRate = parseFloat(document.getElementById('interestRateInput').value);
        const tenure = parseInt(document.getElementById('tenureInput').value);
        const emi = document.getElementById('monthlyEmi').textContent;
        const totalAmount = document.getElementById('totalAmount').textContent;
        const totalInterest = document.getElementById('totalInterest').textContent;

        const message = `🏦 Loan EMI Details

💰 Loan Amount: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(loanAmount)}
📊 Interest Rate: ${interestRate}%
⏳ Tenure: ${tenure} months (${(tenure / 12).toFixed(1)} years)
💳 Monthly EMI: ${emi}
🔢 Total Amount: ${totalAmount}
💸 Total Interest: ${totalInterest}

Get the best loan deals through Bhawna DSA Partner!
WhatsApp: +91 859-546-9797`;

        const whatsappUrl = `https://wa.me/918595469797?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        this.showToast('EMI details shared with Bhawna on WhatsApp');
    }

    applyForLoan(bankCode) {
        const phone = '918595469797';
        const message = `Hi Bhawna! I'm interested in applying for a ${this.currentLoanType} loan from ${bankCode} bank through your DSA services. Please help me with the application process and best rates available.`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    updateLastUpdated() {
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
        
        // Update every minute
        setInterval(() => {
            document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
        }, 60000);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toast.classList.remove('bg-green-600');
            toast.classList.add('bg-red-600');
        } else {
            toast.classList.remove('bg-red-600');
            toast.classList.add('bg-green-600');
        }
        
        // Show toast
        toast.classList.remove('translate-x-full');
        toast.classList.add('translate-x-0');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('translate-x-0');
            toast.classList.add('translate-x-full');
        }, 3000);
    }
}

// Initialize the application
const app = new DSAApplication();

// Handle page visibility change to update rates
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        app.updateLastUpdated();
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});