# Bhawna Credit Card & Loans DSA Partner

A comprehensive loan comparison platform for DSA (Direct Selling Agent) services, featuring real-time loan offers from India's top 10 banks.

## 🌟 Features

- **Instant Loan Eligibility Check** - PAN and mobile verification with OTP
- **Real-time Bank Comparison** - Live rates from 10+ major Indian banks
- **EMI Calculator** - Interactive calculator with WhatsApp sharing
- **Credit Score Assessment** - Mock credit score generation
- **Professional Branding** - Bhawna's portrait as trusted DSA partner
- **Mobile Responsive** - Optimized for all devices
- **GitHub Pages Ready** - Static HTML/CSS/JS deployment

## 🏦 Supported Banks

- HDFC Bank
- ICICI Bank
- State Bank of India (SBI)
- Axis Bank
- Kotak Mahindra Bank
- Yes Bank
- IDBI Bank
- Union Bank of India
- Bank of Baroda
- Punjab National Bank

## 🚀 Deployment on GitHub Pages

1. **Fork or Clone** this repository
2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose branch: `main` or `master`
   - Select folder: `/ (root)`
   - Click Save

3. **Access Your Site**:
   - Your site will be available at: `https://yourusername.github.io/repository-name`

## 📁 File Structure

```
├── index.html          # Main landing page
├── styles.css          # Custom styling with Tailwind classes
├── script.js           # Application logic and functionality
├── assets/
│   ├── bhawna-portrait.jpg   # Professional headshot
│   └── india-banks-logo.jpg  # Bank logos compilation
└── README.md
```

## 💼 Loan Products

- **Personal Loans** - Up to ₹50L at competitive rates
- **Home Loans** - Up to ₹10Cr for property purchase
- **Car Loans** - Vehicle financing with minimal documentation
- **Business Loans** - Working capital and term loans

## 🔧 Customization

### Update Contact Information
The platform is configured with Bhawna's WhatsApp number throughout:
```javascript
const phone = '918595469797'; // Bhawna's WhatsApp contact
```

### Modify Bank Offers
Update interest rates and loan terms in `script.js`:
```javascript
this.bankOffers = {
    personal: [
        { bankName: "HDFC Bank", interestRate: 10.50, ... }
        // Add or modify bank offers
    ]
};
```

### Customize Branding
- Replace `assets/bhawna-portrait.jpg` with your DSA partner photo
- Update name and credentials in HTML content
- Modify RBI registration number in footer

## 📱 Mobile Optimization

- Responsive grid layout
- Touch-friendly form controls
- Optimized image loading
- Mobile-first CSS design

## 🔒 Security Features

- Input validation for PAN and mobile numbers
- OTP verification system (mock implementation)
- Secure form handling
- HTTPS ready deployment

## 📞 Contact & Support

- **WhatsApp**: +91 859-546-9797 (Direct chat with Bhawna)
- **RBI Registration**: DSA-001234
- **Service Areas**: Pan-India
- **LinkedIn**: Professional success stories and testimonials

## 🛡️ Compliance

This platform is designed for RBI registered DSA partners and includes:
- Data privacy consent management
- Regulatory compliance features
- Secure information handling
- Official bank partnerships display

---

**Note**: This is a demonstration platform. For production use, integrate with actual bank APIs and implement proper backend security measures.