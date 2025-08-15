# Overview

This is a loan application platform that allows users to check eligibility and compare loan offers from multiple banks. The application has been converted to a static HTML/CSS/JavaScript website for easy deployment on GitHub Pages without requiring any third-party hosting services like Vercel or Railway.

The platform is designed as a DSA (Direct Selling Agent) partner business featuring Bhawna's professional portrait as the brand ambassador. It handles the complete loan application workflow from initial lead capture through OTP verification, credit score evaluation, bank offer comparison, and EMI calculations. The platform provides a comprehensive comparison tool for personal loans, home loans, car loans, and business loans from top Indian banks.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Static Website Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **Styling Framework**: Tailwind CSS via CDN for rapid UI development
- **Icons**: Font Awesome 6.0 for comprehensive icon library
- **Fonts**: Google Fonts (Inter) for professional typography
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Form Validation**: Client-side JavaScript validation with real-time feedback
- **State Management**: Vanilla JavaScript classes with local state management
- **Deployment**: GitHub Pages compatible static files
- **No Build Process**: Direct file serving without compilation or bundling

## Professional Branding Implementation
- **Brand Ambassador**: Bhawna's professional portrait as circular logo
- **Personal Touch**: DSA partner credentials prominently displayed
- **Trust Elements**: RBI registration, experience highlights, customer testimonials
- **Visual Identity**: Blue gradient backgrounds with professional styling
- **Contact Integration**: WhatsApp sharing and direct phone contact features

## Authentication and Authorization
- **Lead Verification**: OTP-based mobile number verification system
- **Session Management**: Express sessions for maintaining user state
- **Credit Score Generation**: Mock credit score calculation based on PAN and income
- **Consent Management**: User consent tracking for data processing compliance

## Key Features Implementation

### Lead Management System
- Multi-step form with PAN validation, mobile verification, and income assessment
- Real-time form validation using Zod schemas
- OTP generation and verification with expiry handling
- Credit score calculation and storage

### Bank Integration System
- Pre-configured bank offers for top 10 Indian banks
- Dynamic interest rate and eligibility filtering
- Real-time offer comparison with sorting capabilities
- Bank-specific loan parameters (tenure, processing fees, CIBIL requirements)

### EMI Calculator
- Dynamic EMI calculation with adjustable loan amount, interest rate, and tenure
- Interactive sliders for parameter adjustment
- WhatsApp sharing functionality for calculated EMI details
- Historical calculation storage per lead

### Responsive Design System
- Mobile-first responsive design approach
- Custom Tailwind configuration with brand colors and typography
- Comprehensive component library covering forms, tables, modals, and feedback elements
- Accessibility features built into UI components

## Development Tools and Configuration
- **TypeScript Configuration**: Strict type checking with path aliases for clean imports
- **Build Process**: Vite for frontend, ESBuild for backend bundling
- **Development Server**: Hot module replacement and runtime error overlay
- **Code Quality**: Structured file organization with shared schema definitions
- **Environment Management**: Environment-based configuration for development and production