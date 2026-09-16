# 🩸 WUB Blood — Student Blood Donation Platform

[![World University of Bangladesh](https://img.shields.io/badge/WUB-Campus%20Network-0E3A8A?style=for-the-badge&logo=google-scholar&logoColor=white)](https://wub.edu.bd)
[![Status](https://img.shields.io/badge/Release-Production%20Ready-10B981?style=for-the-badge)](https://github.com/XUTAL001/bloodconnect)
[![License](https://img.shields.io/badge/License-MIT-EF4444?style=for-the-badge)](LICENSE)

A dedicated, role-governed blood donation and emergency matching platform built exclusively for students, staff, and faculty of the **World University of Bangladesh (WUB)**.

> **Motto**: *Together We Learn, Together We Grow • One Unit Can Save Many Lives*

---

## 🌟 Key Features

* **🔍 Find Blood with Dhaka Area Filtering**: Search verified student donors across Dhaka zones (Uttara, Mirpur, Pallabi, Mohakhali, Dhanmondi, Mohammadpur, Gulshan, Banani, Farmgate, Motijheel, Badda, Rampura, Tejgaon, Agargaon, Kafrul, etc.).
* **🛡️ End-to-End Role-Based Access Control (RBAC)**:
  * **Student**: Access personal dashboard, post emergency blood requests, become a donor, toggle availability.
  * **Moderator**: Review and moderate blood requests, verify pending student donors.
  * **Admin**: Operational overview, manage requests, verified donor directory, audit activity.
  * **Super Admin**: Full institutional governance, assign/promote user account roles, system-wide management.
* **🚨 Emergency Blood Request Lifecycle**:
  * `New` ➔ `Pending Review` ➔ `Approved / Rejected` ➔ `Completed / Fulfilled`.
  * Real-time notifications dispatched to students and administrative queues.
* **⚡ Student Dashboard**:
  * Dynamic student profile and verified donor status badge.
  * Live availability toggle pill (**Available** ↔ **On Break**) with instant database sync.
  * Medical blood compatibility panel dynamically computed for the student's blood group.
  * Comprehensive **My Requests** tracking modal.
* **📱 Direct & Safe Donor Contact**:
  * Clean modal with direct **Call** and **WhatsApp** (pre-populated emergency template) actions.
  * Privacy-first design protecting student personal data.
* **📜 Institutional Security Audit Trail**:
  * Immutable record of all administrative status changes, verifications, and role modifications.
* **🎨 Pixel-Perfect UI & Campus Branding**:
  * Authentic World University of Bangladesh permanent campus visual backdrop.
  * Transparent WUB crest badges with natural shadow blending.
  * Fully responsive across Mobile, Tablet, Laptop, and Desktop viewports.

---

## 🔑 Demo Accounts & Quick Login

On `login.html`, click any of the 4 quick-role buttons or enter the credentials below:

| Role | Username / ID | Password | Access Scope |
|---|---|---|---|
| **Student** | `WUB-2023-0842` | `student123` | Personal dashboard, request blood, become donor |
| **Moderator** | `mod@wub.edu.bd` | `mod123` | Review requests, verify/reject student donors |
| **Admin** | `admin@wub.edu.bd` | `admin123` | Operational management, live stats, view audit logs |
| **Super Admin** | `superadmin@wub.edu.bd` | `super123` | Full system control, assign user roles (RBAC) |

---

## 📂 Project Architecture

```text
├── index.html            # Home Showcase & Campus Blood Network Landing
├── find-blood.html       # Verified Donor Directory & Dhaka Area Filters
├── request-blood.html    # Emergency Hospital Blood Request Form
├── become-donor.html     # Student Donor Registration (Pending Verification)
├── dashboard.html        # Student Dashboard, Availability Toggle & Live Tracking
├── admin.html            # Admin Console, Verification Queue & RBAC Role Center
├── login.html            # Authentication Portal with 1-Click Role Switcher
├── register.html         # Student Account Creation with BD Phone Validation
├── about.html            # About WUB Blood, Compatibility Matrix & Emergency Hotlines
├── script.js             # Core Application Engine, RBAC Logic & LocalStorage Store
├── style.css             # Vanilla CSS Design System & Responsive Breakpoints
├── test_runner.html      # Automated Integration Test Suite (100% Pass)
└── assets/
    ├── WUB-Logo.png      # Official World University of Bangladesh Crest
    └── campus-bg.png     # WUB Permanent Campus Photograph
```

---

## 🚀 Getting Started

No build steps or server dependencies are required. All features run client-side with persistent `localStorage` synchronization:

1. Clone this repository:
   ```bash
   git clone https://github.com/XUTAL001/bloodconnect.git
   ```
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
3. (Optional) Run with VS Code **Live Server** extension for local development.

---

## 🧪 Automated Testing

Open `test_runner.html` in your browser to run the 34-point automated test suite covering:
* Data store auto-initialization & seed integrity
* Hierarchical RBAC authorization & route protection
* Bangladeshi mobile number validation (`^01[3-9]\d{8}$`)
* Blood compatibility calculation
* Complete donor verification and request fulfillment lifecycles

---

## 🏛️ World University of Bangladesh

Developed for the health and safety of the **WUB Student Community**.  
Permanent Campus: Sector 17, Uttara Model Town, Dhaka, Bangladesh.
