# KindCents - Verified Donations, Real Impact

## Overview
KindCents is a transparent, crowdfunding platform designed to eliminate fraud and restore trust in digital donations. We ensure every contribution reaches genuine causes with 100% accountability. Our mission is to bridge the trust gap in philanthropy through secure, data-driven transparency.

## Core Features
- **Mandatory Document Verification**: High-trust onboarding for Individuals and NGOs with mandatory document submissions.
- **Admin Review Panel**: Advanced interface for manual verification of user identities and payment approvals.
- **Role-Based Dashboards**: Custom-tailored dashboard experiences for Donors, NGOs, Individuals, and Administrators.
- **Real-Time Transparency**: Automated fund utilization tracking and verified campaign updates.
- **Donation Management**: Secure payment flow with admin-controlled fund releases.

## Tech Stack
- **Frontend**: React.js (v19)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom tokens, Modern & Premium aesthetics)
- **Icons**: Lucide React
- **Backend / Database**: Firebase (Authentication, Firestore NoSQL, Hosting)
- **Routing**: React Router DOM (v7)

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kindcents-1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password and Google Sign-In).
   - Initialize **Cloud Firestore** in test mode or with appropriate security rules.
   - Add your Firebase configuration keys to the project (ensure `src/firebase.js` is updated).

4. **Run development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

5. **Build for production**:
   ```bash
   npm run build
   ```

## Development Team
This project was proudly developed by:
- **Mohamed Huraish Haadiya**
- **Nuha Riwaz**
- **Shabeeha Miftha**
- **Virgin Wardini**

---
© 2026 KindCents | All Rights Reserved.
