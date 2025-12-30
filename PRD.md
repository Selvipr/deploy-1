Product Requirements Document (PRD)
Shop2games
Version: 1.0
Status: Draft
Date: December 28, 2025
1. Executive Summary
1.1 Product Vision
To build the definitive "Amazon for Digital Goods"—a hybrid platform that seamlessly merges the speed of a Direct Top-Up Retailer (like Jubaly) with the variety of a Peer-to-Peer (P2P) Marketplace (like Plati.Market). The platform will be an "Adaptive Web Application," providing a native-app-like experience via PWA on mobile devices while offering a comprehensive dashboard on desktop, all powered by a serverless Next.js 15 and Supabase architecture.
1.2 Core Value Propositions
Hybrid Inventory: Users can buy instant game credits (via API) OR unique software keys/accounts (from other users) in a single cart.
Adaptive "Native" Feel: A Mobile-First, Offline-Capable PWA that works seamlessly on low-end devices and unstable networks (e.g., 4G in South Asia).
Trustless Security: A "Safe Deal" Escrow system where seller funds are held until the buyer confirms the digital good works.
Hyper-Local Payments: Integration of global rails (Stripe/Crypto) with local necessities (bKash/Nagad).
2. User Personas
Persona
Role
Needs & Pain Points
The Hardcore Gamer
Buyer
Needs instant UC/Diamonds for a game event. Uses a low-end Android phone. Hates "out of stock" errors. Wants to pay via local mobile wallet.
The Digital Reseller
Seller
Sells spare Steam keys or software licenses. Needs fraud protection (chargebacks). Wants a simple mobile dashboard to reply to buyers.
The Platform Admin
Admin
Needs to resolve disputes between buyers and sellers efficiently. Requires a "God View" of all transactions and API health status.

3. Business Requirements (The Hybrid Model)
The platform must support two distinct business flows simultaneously.
3.1 Flow A: The Retailer (Direct Top-Up)
Model: B2C (Platform sells to User).
Inventory: Infinite/On-Demand.
Fulfillment: Synchronous API calls to suppliers (Smile.One, UniPin).
Profit: Margin between Wholesale API price and Retail price.
3.2 Flow B: The Marketplace (P2P Keys)
Model: C2C (User sells to User).
Inventory: Finite (Rows in a database).
Fulfillment: Asynchronous (Database lock & release).
Profit: Platform Commission (e.g., 10%) on every sale.
Trust: Escrow ("Safe Deal") required.
4. Functional Requirements
4.1 User Accounts & Adaptive Auth
Unified Auth: Single login for Buyers and Sellers using Supabase Auth (Email, Google, Discord).
Role Management: Users can upgrade to "Merchant" status by submitting KYC documents (ID Card upload to Supabase Storage).
Adaptive Profile:
Mobile: Bottom sheet navigation for Wallet/Profile.
Desktop: Sidebar dashboard with detailed analytics.
4.2 Product Management & Dynamic Schemas
The system must handle diverse digital goods with different required inputs.
Dynamic Input Forms: Stored as JSONB in the database.
Example (Mobile Legends): { "label": "User ID", "type": "number", "validation": "api_check" }
Example (Steam Key): { "label": "Region", "type": "select", "options": ["Global", "NA", "EU"] }
Inventory Types:
serial_key: A unique string locked to one order.
file: A downloadable asset (zip/pdf).
direct_api: A service triggered upon payment.
4.3 Search & Discovery (Adaptive)
Engine: MeiliSearch (for typo-tolerance on mobile keyboards).
Adaptive UI:
Mobile: Infinite scroll feed, large touch targets.
Desktop: Advanced filtering sidebar, table views for bulk browsing.
4.4 Checkout & Payments
Gateways:
Stripe Connect: For splitting payments between Platform and Seller automatically.
Local Aggregators (bKash/Nagad): Manual or API-based integration for local markets.
Crypto: For anonymous P2P transactions.
Fraud Protection: Velocity checks (max 3 orders/hour) and 3D Secure enforcement.
4.5 Post-Purchase & Dispute Resolution
Escrow Logic: Funds are moved to a balance_held state. They move to balance_available only after:
Buyer clicks "Confirm Received".
Auto-release timer (24h) expires without dispute.
Dispute Center: Real-time chat (Supabase Realtime) between Buyer and Seller. Admin can intervene to Force Release or Force Refund.
5. Technical Architecture
5.1 The "Serverless MACH" Stack
Frontend: Next.js 15 (App Router).
Rendering: React Server Components (RSC) for fast initial load.
Styling: Tailwind CSS (Mobile-First Utility Architecture).
PWA: Service Workers for offline caching of "My Keys" page.
Backend: Supabase.
Database: PostgreSQL.
Auth: JWT-based.
Storage: For KYC docs and Dispute screenshots.
Compute: Supabase Edge Functions (Deno).
Used for: Payment Webhooks, Supplier API Proxies, Escrow Release Logic.
5.2 System Architecture Diagram
graph TD
    User[User (Mobile/Desktop)] -->|HTTPS + PWA Cache| NextJS[Next.js 15 App (Vercel)]
    NextJS -->|RSC Fetch| SupabaseDB[(Supabase PostgreSQL)]
    NextJS -->|Auth| SupabaseAuth[Supabase Auth]
    
    subgraph "Supabase Edge Network"
        EdgePayment[Payment Webhook]
        EdgeSupplier[Supplier Adapter (Smile.One/UniPin)]
        EdgeEscrow[Escrow Cron/Trigger]
    end

    NextJS -->|API Call| EdgePayment
    NextJS -->|API Call| EdgeSupplier
    
    EdgeSupplier -->|REST| SmileOne[Smile.One API]
    EdgeSupplier -->|REST| UniPin[UniPin API]
    EdgePayment -->|Webhook| Stripe[Stripe]
    
    SupabaseDB -->|Realtime| NextJS


5.3 Data Schema (Key Tables)
Merging the schemas from PRD 1 and Reverse Engineering research.
users: id, email, role, wallet_balance, kyc_status.
products: id, type (key/api), input_schema (JSONB), supplier_config (JSONB for API mapping).
inventory: id, product_id, secret_data (Encrypted), status (available/locked/sold).
orders: id, buyer_id, total, status (pending/escrow/complete), escrow_release_at.
disputes: id, order_id, chat_log (JSONB or separate table).
6. Adaptive UX/UI Strategy
6.1 Breakpoint Strategy (Mobile-First)
Default (0px+): Single column, bottom navigation bar, card-based lists.
md (768px+): Tablet view, condensed sidebar, 2-column grids.
lg (1024px+): Desktop view, full sidebar, data tables instead of cards.
6.2 PWA & Offline Strategy
Service Worker: Cache the "App Shell" (Nav, Footer) and "My Orders" data.
Offline Mode: If a user loses internet, they can still open the app and view the keys/codes they previously purchased (critical for gamers).
Installability: Manifest.json configured for standalone display on Android/iOS.
7. Security & Compliance
7.1 Row Level Security (RLS)
Inventory: SELECT only allowed for the owner (seller) OR the buyer linked to a completed order.
Orders: Users can only see their own orders.
Admin: Special role bypasses RLS via Service Key or Custom Claims.
7.2 Encryption
Digital Vault: Product keys in the inventory table must be encrypted at rest using pgsodium or application-level encryption, decrypted only upon valid purchase delivery.
8. Roadmap
Phase 1: Foundation (Weeks 1-3)
Setup Next.js 15 + Supabase.
Implement Auth & Role-based Profiles.
Define Core Database Schema & RLS.
Phase 2: The Retailer Module (Weeks 4-6)
Build "Direct Top-Up" Product Type.
Develop Edge Function Adapters for Smile.One/UniPin APIs.
Implement Adaptive Form Inputs (JSONB schema rendering).
Phase 3: The Marketplace Module (Weeks 7-9)
Build Seller Dashboard (Inventory Management).
Implement "Safe Deal" Escrow Logic & Stripe Split Payments.
Build "My Orders" PWA Offline Caching.
Phase 4: Trust & Polish (Weeks 10-12)
Dispute Resolution Chat System.
KYC Document Upload Pipeline.
Load Testing (simulating game launch spikes).
