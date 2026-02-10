# KindCents - Verified Donations, Real Impact

**Repository:** [https://github.com/nuha-riwaz/kindcents](https://github.com/nuha-riwaz/kindcents)  
**Live Demo:** [https://kindcents.web.app](https://kindcents.web.app)

## Tech Stack
- **Frontend**: React.js (v19)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom tokens, Modern & Premium aesthetics)
- **Icons**: Lucide React
- **AI Chatbot**: Custom React FAQ assistant (`KindBot`) powered by a rule-based dialog engine and Firestore-backed contact requests (no external LLM/API dependency)
- **Backend Architecture**: BaaS (Backend as a Service)
- **Backend / Database**: Firebase (Authentication, Firestore NoSQL, Storage, Hosting)
- **Routing**: React Router DOM (v7)

## Database Schema (Firestore)
Our application uses the following Firestore collections:

- **users** - User profiles with role-based access (donor, nonprofit, individual, admin)
- **campaigns** - Fundraising campaigns with goals, raised amounts, and status tracking
- **donations** - Transaction records linking donors to campaigns
- **expenses** - Proof of expense uploads by campaign owners (receipts, bills)
- **contact_requests** - Support messages and queries submitted via the AI chatbot

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

5. **(Optional) Seed the database**:
   - To populate the database with mock campaigns and users, visit `http://localhost:5173/seed` in your browser.
   - Click the **"Seed Database"** button to initialize the Firestore collections.

## Admin Credentials (For Testing)
- **Email**: `admin@kindcents.org`
- **Password**: `Admin@123`

### User Credentials (Test/Demo)
All test accounts use the password: `Test@123`

- **Individual:** `rashid.hsn@gmail.com` (Owner of "Help Ayaan's Surgery")
- **NGO:** `admin@akshay.org` (Owner of "Akshay Society")
- **Donor:** `nuha@demo.com`

## Firebase Console Access & Data Visibility (For Judges)
Judges can use the following URLs when reviewing the project:
- **Public app (main experience)**: `https://kindcents.web.app`
- **Judge‑only data view (read‑only)**: `https://kindcents.web.app/judge`

- **Primary option – In‑app Judge Data View (recommended)**  
  - Open the hidden, read‑only route (not linked from the public UI):  
    `https://kindcents.web.app/judge`
  - Log in using the **Admin test account**:
    - Email: `admin@kindcents.org`
    - Password: `Admin@123`
  - This page shows real‑time, read‑only tables for the main Firestore collections:
    - `users`
    - `campaigns`
    - `donations`
    - `expenses`
    - `contact_requests` (support messages submitted via the AI chatbot)
  - This view is designed specifically for judges reviewing the project remotely and is safe to use because it relies on standard Firebase client‑side security (no service account keys or extra privileges are exposed).
- **Backup option – Direct Console Access (optional)**  
  - If you prefer inspecting the raw data directly in Firebase, email `riwaznuha@gmail.com` with your Gmail address to request temporary **Viewer** access to the Firebase Console (Firestore + Authentication).

## Development Team
This project was proudly developed by:
- **Mohamed Huraish Haadiya**
- **Nuha Riwaz**
- **Shabeeha Miftha**
- **Virgin Wardini**

---
© 2026 KindCents | All Rights Reserved.

