# MERN Rent Receipt Generator SPA (Single Page Application)

A production-ready, minimalist, and authentic **Rent Receipt Generator Single Page Application (SPA)** built with the MERN stack (MongoDB, Express, React, Node.js + Vite & Tailwind CSS).

The printed receipt layout is built to replicate the typewriter-styled rent receipt format with pixel-perfect fidelity, featuring **two duplicate copies on a single A4 page (Owner Copy and Occupier Copy)** separated by a clean cut line.

---

## 📸 Receipt Structure & Design Replica

The receipt reproduces the exact authentic typewriter format:

```
                            PROPERTY OF
     SRI KIRTI AGRAWAL S/O LATE SRI SATYA PRAKASH AGRAWAL
No. 00015                RENT RECEIPT                    DATE 05/11/2026

RECEIVED FROM   SRI SUNNY KUMAR
R/O             

THE SUM OF RUPEES   SEVEN THOUSAND FIVE HUNDRED ONLY

TOWARDS RENT FOR THE MONTH OF       NOVEMBER 2026

FOR SHOP NO. Second floor portion    IN BUXIPUR  SHER KOTHI, GORAKHPUR

                                                    [ AFFIX REVENUE STAMP ]
Rs. 7,500                                              Signature of Owner

------------------- ✄ CUT HERE (Owner Copy above / Occupier Copy below) -------------------

                            PROPERTY OF
     SRI KIRTI AGRAWAL S/O LATE SRI SATYA PRAKASH AGRAWAL
No. 00015                RENT RECEIPT                    DATE 05/11/2026

RECEIVED FROM   SRI SUNNY KUMAR
R/O             

THE SUM OF RUPEES   SEVEN THOUSAND FIVE HUNDRED ONLY

TOWARDS RENT FOR THE MONTH OF       NOVEMBER 2026

FOR SHOP NO. Second floor portion    IN BUXIPUR  SHER KOTHI, GORAKHPUR


Rs. 7,500                                           Signature of Occupier
```

---

## 🚀 Key Features

### 1. Fast & Minimalist Receipt Generation
- **Searchable Customer Dropdown**: Quickly select any saved tenant; automatically auto-fills tenant name, father's name / R/O, default shop portion, and default rent amount.
- **Auto-sequential Receipt Numbering**: Auto-generates leading-zero sequential numbers (e.g. `#00015`, `#00016`) backed by an atomic MongoDB sequence counter with collision protection.
- **Auto English Number to Words Conversion**: Automatically translates numeric rupees (e.g. `₹7500` -> `"SEVEN THOUSAND FIVE HUNDRED ONLY"`, `₹12000` -> `"TWELVE THOUSAND ONLY"`) using the Indian numbering system. Allows manual edits if required.
- **Date & Month Pickers**: One-click "Today" and "Current Month" buttons.
- **Configurable Property Defaults**: Default Shop (`Second floor portion`), Default Address (`BUXIPUR SHER KOTHI, GORAKHPUR`), and Owner Header (`SRI KIRTI AGRAWAL S/O LATE SRI SATYA PRAKASH AGRAWAL`).

### 2. A4 Duplicate Printing (Owner & Occupier Copies)
- Uses native browser printing (`window.print()`) with custom `@media print` CSS.
- Completely hides dashboards, navigation bars, buttons, forms, and alerts during printing.
- Prints **two duplicate receipts on a single A4 page**:
  - **Top Receipt**: Owner Copy with revenue stamp box (`AFFIX REVENUE STAMP`) and `Signature of Owner`.
  - **Dotted Cut Line**: Center cut divider with scissors indicator.
  - **Bottom Receipt**: Occupier Copy with `Signature of Occupier`.
- Typewriter monospaced typography using Google Font `Courier Prime` with zero unnecessary ink usage or background noise.

### 3. Full Customer & Tenant Directory
- Add, Edit, Delete tenants.
- Stores customer name, father's name / R/O, phone number, address, default rented shop number, and standard monthly rent.
- One-click receipt generation directly from the customer table.

### 4. Receipt History & Record Keeping
- Search past receipts by receipt number, tenant name, or shop number.
- Filter by rent month.
- Shows total rent collected calculation.
- Reprint previous receipts anytime with full duplicate fidelity.

### 5. Settings Management
- Customize Property Owner Name and Father's Name.
- Customize Property Address and Default Shop No.
- Adjust the next sequence number (e.g. jump sequence to `#00100` if desired).
- Adjust zero padding width.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Printing**: Native browser `window.print()` with custom print CSS
- **Typography**: Courier Prime (authentic typewriter monospaced font) & Inter

---

## 📦 Project Structure

```
Center owner app/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── customerController.js # Customer CRUD operations
│   │   ├── receiptController.js  # Receipt generation & numbering
│   │   └── settingsController.js # Owner and property settings
│   ├── models/
│   │   ├── Customer.js           # Customer schema
│   │   ├── Receipt.js            # Rent receipt schema
│   │   ├── Counter.js            # Atomic sequence counter
│   │   └── Settings.js           # Property settings schema
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   ├── receiptRoutes.js
│   │   └── settingsRoutes.js
│   ├── server.js                 # Express app entry & seed data
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js            # REST API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReceiptForm.jsx
│   │   │   ├── SingleReceiptView.jsx
│   │   │   ├── PrintableReceiptSheet.jsx
│   │   │   ├── ReceiptPreviewModal.jsx
│   │   │   ├── CustomerList.jsx
│   │   │   ├── CustomerModal.jsx
│   │   │   ├── ReceiptHistory.jsx
│   │   │   ├── SettingsModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── utils/
│   │   │   ├── numberToWords.js  # Indian number to English words
│   │   │   └── formatDate.js    # Date & month helpers
│   │   ├── App.jsx
│   │   ├── index.css             # Print CSS & Tailwind setup
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                  # Root runner (concurrently)
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
1. **Node.js** (v18 or higher installed)
2. **MongoDB** (running locally on port `27017` or a MongoDB Atlas connection URI)

### Quick Start

1. **Clone or Navigate to the Project Root**:
   ```bash
   cd "Center owner app"
   ```

2. **Install Dependencies**:
   Install root, server, and client dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

3. **Environment Configuration**:
   A default `.env` is created in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rent_receipt_db
   ```

4. **Start Development Server**:
   Start both backend and frontend simultaneously with a single command:
   ```bash
   npm run dev
   ```
   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000/api`

---

## 🖨️ Printing Guidelines

1. In the application, click **"Preview Receipt"** or **"Save & Print"**.
2. When the browser print preview opens:
   - **Paper Size**: Set to **A4**.
   - **Orientation**: Set to **Portrait**.
   - **Margins**: Set to **Default** or **None**.
   - **Options**: Uncheck "Headers and footers" to keep browser URLs/dates off the printed paper.
3. Both Owner and Occupier duplicate copies will print cleanly on one page.

---

## 🔌 API Endpoints Summary

### Customers
- `GET /api/customers` — Get all customers (supports `?search=...`)
- `POST /api/customers` — Create a customer
- `GET /api/customers/:id` — Get customer details
- `PUT /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer

### Receipts
- `GET /api/receipts/next-number` — Fetch next sequential receipt number (e.g. `00015`)
- `GET /api/receipts` — Get past receipts (supports `?search=...&month=...`)
- `POST /api/receipts` — Save new receipt with auto/custom receipt number
- `GET /api/receipts/:id` — Get single receipt
- `PUT /api/receipts/:id` — Update receipt
- `DELETE /api/receipts/:id` — Delete receipt

### Settings
- `GET /api/settings` — Get owner and property settings
- `PUT /api/settings` — Update owner details, property address, and sequence counter

# Rent-Management
