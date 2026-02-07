# KindCents - Verified Donations, Real Impact

**Repository:** [https://github.com/nuha-riwaz/kindcents](https://github.com/nuha-riwaz/kindcents)  
**Live Demo:** [https://kindcents.web.app](https://kindcents.web.app)

## Tech Stack
- **Frontend**: React.js (v19)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom tokens, Modern & Premium aesthetics)
- **Icons**: Lucide React
- **Backend Architecture**: BaaS (Backend as a Service)
- **Backend / Database**: Firebase (Authentication, Firestore NoSQL, Storage, Hosting)
- **Routing**: React Router DOM (v7)

## Database Schema (Firestore)
Our application uses the following Firestore collections:

- **users** - User profiles with role-based access (donor, nonprofit, individual, admin)
- **campaigns** - Fundraising campaigns with goals, raised amounts, and status tracking
- **donations** - Transaction records linking donors to campaigns
- **expenses** - Proof of expense uploads by campaign owners (receipts, bills)
- **badges** - Gamification achievements for donors

All data is stored in Firebase Firestore (NoSQL) with real-time synchronization.

## Setup & Installation
### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/nuha-riwaz/kindcents.git
   cd kindcents
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password and Google Sign-In).
   - Initialize **Cloud Firestore**.
   - Add your Firebase configuration keys to `src/firebase.js`.

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

## Admin Credentials (For Testing)
- **Email**: `admin@kindcents.org`
- **Password**: `Admin@123`

### User Credentials (Test/Demo)
All test accounts use the password: `Test@123`

- **Individual:** `rashid.hsn@gmail.com` (Owner of "Help Ayaan's Surgery")
- **NGO Admin:** `admin@akshay.org` (Owner of "Akshay Society")
- **Donor:** `nuha@demo.com`

## Firebase Console Access (For Judges)
To view the database structure and collections directly:
- **Request Access:** Email `riwaznuha@gmail.com` with your Gmail address
- We will add you as a **Viewer** to the Firebase Console
- You'll be able to inspect all Firestore collections, authentication users, and storage files

## Development Team
This project was proudly developed by:
- **Mohamed Huraish Haadiya**
- **Nuha Riwaz**
- **Shabeeha Miftha**
- **Virgin Wardini**

---
© 2026 KindCents | All Rights Reserved.
