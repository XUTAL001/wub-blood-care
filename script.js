/**
 * WUB BLOOD — STUDENT BLOOD DONATION NETWORK
 * Core JavaScript Engine: Unified Data Architecture, RBAC & Workflows
 * World University of Bangladesh (WUB)
 */

// ==========================================================================
// 1. STANDARDIZED CONSTANTS & DHAKA LOCATIONS
// ==========================================================================
const DHAKA_LOCATIONS = [
  "Uttara",
  "Mirpur",
  "Pallabi",
  "Mohakhali",
  "Dhanmondi",
  "Mohammadpur",
  "Gulshan",
  "Banani",
  "Farmgate",
  "Motijheel",
  "Badda",
  "Rampura",
  "Tejgaon",
  "Agargaon",
  "Kafrul",
  "Khilkhet",
  "Bashundhara",
  "WUB Permanent Campus"
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DEPARTMENTS = [
  "Computer Science & Engineering (CSE)",
  "Electrical & Electronic Engineering (EEE)",
  "Business Administration (BBA)",
  "English (ENG)",
  "Pharmacy",
  "Civil Engineering",
  "Law",
  "Public Health"
];

// ==========================================================================
// 2. INITIAL SEED DATA (Consistent Data Models)
// ==========================================================================
const INITIAL_USERS = [
  {
    id: "WUB-ADMIN-001",
    username: "superadmin",
    password: "super123",
    name: "Prof. Dr. M. Rahman",
    email: "superadmin@wub.edu.bd",
    role: "super_admin",
    dept: "WUB Health Office / Directorate",
    blood: "O+",
    phone: "01711000001",
    address: "Uttara",
    status: "active"
  },
  {
    id: "WUB-ADMIN-002",
    username: "admin",
    password: "admin123",
    name: "Dr. Kazi Fahim",
    email: "healthadmin@wub.edu.bd",
    role: "admin",
    dept: "Campus Medical Center",
    blood: "A+",
    phone: "01711000002",
    address: "Uttara",
    status: "active"
  },
  {
    id: "WUB-MOD-001",
    username: "moderator",
    password: "mod123",
    name: "Sharmin Sultana",
    email: "moderator@wub.edu.bd",
    role: "moderator",
    dept: "Student Affairs & Red Crescent",
    blood: "B+",
    phone: "01711000003",
    address: "Mirpur",
    status: "active"
  },
  {
    id: "WUB-2023-0842",
    username: "WUB-2023-0842",
    password: "student123",
    name: "Tanvir Alam",
    email: "tanvir.alam@wub.edu.bd",
    role: "student",
    dept: "Computer Science & Engineering (CSE)",
    blood: "B+",
    phone: "01712345678",
    address: "Uttara",
    isDonor: true,
    donorAvailable: true,
    verificationStatus: "verified",
    totalDonations: 4,
    lastDonation: "2026-06-15",
    privacy: {
      showPhone: true,
      showAddress: false,
      showInDonorList: true
    },
    status: "active"
  },
  {
    id: "WUB-2022-1145",
    username: "WUB-2022-1145",
    password: "student123",
    name: "Sadia Meem",
    email: "sadia.meem@wub.edu.bd",
    role: "student",
    dept: "Computer Science & Engineering (CSE)",
    blood: "O+",
    phone: "01812345602",
    address: "Pallabi",
    isDonor: true,
    donorAvailable: true,
    verificationStatus: "verified",
    totalDonations: 3,
    lastDonation: "2026-06-15",
    privacy: {
      showPhone: true,
      showAddress: true,
      showInDonorList: true
    },
    status: "active"
  },
  {
    id: "WUB-2024-0319",
    username: "WUB-2024-0319",
    password: "student123",
    name: "Mahmud Hasan",
    email: "mahmud.hasan@wub.edu.bd",
    role: "student",
    dept: "Business Administration (BBA)",
    blood: "A+",
    phone: "01912345699",
    address: "Dhanmondi",
    isDonor: true,
    donorAvailable: true,
    verificationStatus: "pending",
    totalDonations: 0,
    lastDonation: "Newly Registered",
    privacy: {
      showPhone: true,
      showAddress: false,
      showInDonorList: true
    },
    status: "active"
  }
];

const INITIAL_DONORS = [
  {
    id: "donor-1",
    userId: "WUB-2023-0842",
    name: "Ashrafur Rahman",
    initials: "AR",
    avatarClass: "avatar-ar",
    blood: "B+",
    dept: "CSE",
    campus: "Uttara",
    location: "Uttara",
    phone: "01712345601",
    available: true,
    verificationStatus: "verified",
    donationsCount: 4,
    lastDonation: "2026-05-10"
  },
  {
    id: "donor-2",
    userId: "WUB-2022-1145",
    name: "Sadia Meem",
    initials: "SM",
    avatarClass: "avatar-sm",
    blood: "O+",
    dept: "CSE",
    campus: "Pallabi",
    location: "Pallabi",
    phone: "01812345602",
    available: true,
    verificationStatus: "verified",
    donationsCount: 3,
    lastDonation: "2026-06-15"
  },
  {
    id: "donor-3",
    userId: "WUB-2023-0491",
    name: "Nahid Islam",
    initials: "NI",
    avatarClass: "avatar-ni",
    blood: "A+",
    dept: "BBA",
    campus: "Mirpur",
    location: "Mirpur",
    phone: "01912345603",
    available: true,
    verificationStatus: "verified",
    donationsCount: 2,
    lastDonation: "2026-04-20"
  },
  {
    id: "donor-4",
    userId: "WUB-2022-0981",
    name: "Tanjim Ravez",
    initials: "TR",
    avatarClass: "avatar-tp",
    blood: "AB+",
    dept: "CSE",
    campus: "Mohakhali",
    location: "Mohakhali",
    phone: "01612345604",
    available: true,
    verificationStatus: "verified",
    donationsCount: 5,
    lastDonation: "2026-07-01"
  },
  {
    id: "donor-5",
    userId: "WUB-2023-0712",
    name: "Rafiat Rahman",
    initials: "RR",
    avatarClass: "avatar-fr",
    blood: "O+",
    dept: "ENG",
    campus: "Dhanmondi",
    location: "Dhanmondi",
    phone: "01798765405",
    available: true,
    verificationStatus: "verified",
    donationsCount: 1,
    lastDonation: "2026-03-12"
  },
  {
    id: "donor-6",
    userId: "WUB-2021-0554",
    name: "Farhan Sayeed",
    initials: "FS",
    avatarClass: "avatar-fs",
    blood: "A+",
    dept: "CSE",
    campus: "Mohammadpur",
    location: "Mohammadpur",
    phone: "01898765406",
    available: true,
    verificationStatus: "verified",
    donationsCount: 6,
    lastDonation: "2026-08-05"
  },
  {
    id: "donor-7",
    userId: "WUB-2022-0887",
    name: "Mushfiq Alam",
    initials: "MA",
    avatarClass: "avatar-ma",
    blood: "B+",
    dept: "BBA",
    campus: "Gulshan",
    location: "Gulshan",
    phone: "01512345607",
    available: true,
    verificationStatus: "verified",
    donationsCount: 2,
    lastDonation: "2026-02-18"
  },
  {
    id: "donor-8",
    userId: "WUB-2023-0112",
    name: "Shamim Hossain",
    initials: "SH",
    avatarClass: "avatar-sh",
    blood: "O+",
    dept: "CSE",
    campus: "Banani",
    location: "Banani",
    phone: "01312345608",
    available: true,
    verificationStatus: "verified",
    donationsCount: 3,
    lastDonation: "2026-06-25"
  },
  {
    id: "donor-9",
    userId: "WUB-2023-0902",
    name: "Nusrat Jahan",
    initials: "NJ",
    avatarClass: "avatar-sm",
    blood: "O-",
    dept: "EEE",
    campus: "Farmgate",
    location: "Farmgate",
    phone: "01723456789",
    available: true,
    verificationStatus: "verified",
    donationsCount: 2,
    lastDonation: "2026-05-14"
  },
  {
    id: "donor-10",
    userId: "WUB-2023-0842",
    name: "Tanvir Ahmed",
    initials: "TA",
    avatarClass: "avatar-tp",
    blood: "B-",
    dept: "CSE",
    campus: "Badda",
    location: "Badda",
    phone: "01834567890",
    available: true,
    verificationStatus: "verified",
    donationsCount: 4,
    lastDonation: "2026-07-22"
  },
  {
    id: "donor-11",
    userId: "WUB-2024-0012",
    name: "Fahmida Akter",
    initials: "FA",
    avatarClass: "avatar-fr",
    blood: "A-",
    dept: "Pharmacy",
    campus: "Rampura",
    location: "Rampura",
    phone: "01945678901",
    available: true,
    verificationStatus: "verified",
    donationsCount: 1,
    lastDonation: "2026-06-11"
  },
  {
    id: "donor-12",
    userId: "WUB-2022-0731",
    name: "Shakil Mahmud",
    initials: "SM",
    avatarClass: "avatar-ni",
    blood: "AB-",
    dept: "Civil",
    campus: "Tejgaon",
    location: "Tejgaon",
    phone: "01556789012",
    available: true,
    verificationStatus: "verified",
    donationsCount: 3,
    lastDonation: "2026-04-30"
  },
  // Pending Donors for Admin Verification Queue
  {
    id: "donor-13",
    userId: "WUB-2024-0319",
    name: "Mahmud Hasan",
    initials: "MH",
    avatarClass: "avatar-ar",
    blood: "A+",
    dept: "BBA",
    campus: "Dhanmondi",
    location: "Dhanmondi",
    phone: "01912345699",
    available: true,
    verificationStatus: "pending",
    donationsCount: 0,
    lastDonation: "Newly Registered"
  },
  {
    id: "donor-14",
    userId: "WUB-2024-0552",
    name: "Ayesha Siddiqua",
    initials: "AS",
    avatarClass: "avatar-sm",
    blood: "O+",
    dept: "Pharmacy",
    campus: "Uttara",
    location: "Uttara",
    phone: "01788776655",
    available: true,
    verificationStatus: "pending",
    donationsCount: 1,
    lastDonation: "2026-08-10"
  }
];

const INITIAL_REQUESTS = [
  {
    id: "req-1",
    requesterId: "WUB-2023-0842",
    blood: "B+",
    units: "1 unit",
    location: "Kurmitola General Hospital, Uttara",
    urgency: "Emergency",
    reason: "Urgent surgery scheduled at nearby Kurmitola General Hospital.",
    studentName: "Tanvir Alam",
    studentId: "WUB-2023-0842",
    contactPhone: "01712345678",
    date: "15 mins ago",
    status: "Approved",
    reviewedBy: "Dr. Kazi Fahim"
  },
  {
    id: "req-2",
    requesterId: "WUB-2022-1145",
    blood: "O-",
    units: "2 units",
    location: "Uttara Modern Hospital",
    urgency: "Urgent",
    reason: "Thalassemia patient regular transfusion requirement.",
    studentName: "Sadia Meem",
    studentId: "WUB-2022-1145",
    contactPhone: "01812345602",
    date: "3 hours ago",
    status: "Pending",
    reviewedBy: null
  },
  {
    id: "req-3",
    requesterId: "WUB-2023-0491",
    blood: "A+",
    units: "1 unit",
    location: "Dhaka Medical College Hospital",
    urgency: "Normal",
    reason: "Scheduled medical procedure next Monday.",
    studentName: "Nahid Islam",
    studentId: "WUB-2023-0491",
    contactPhone: "01912345603",
    date: "Yesterday",
    status: "Approved",
    reviewedBy: "Dr. Kazi Fahim"
  },
  {
    id: "req-4",
    requesterId: "WUB-2023-0842",
    blood: "B+",
    units: "1 unit",
    location: "Kurmitola General Hospital",
    urgency: "Urgent",
    reason: "Platelet transfusion support for dengue patient.",
    studentName: "Tanvir Alam",
    studentId: "WUB-2023-0842",
    contactPhone: "01712345678",
    date: "3 days ago",
    status: "Completed",
    reviewedBy: "Dr. Kazi Fahim"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    targetRole: "student",
    targetUserId: "WUB-2023-0842",
    title: "Donor Match Found",
    desc: "Ashrafur Rahman (B+) accepted your emergency blood request for Kurmitola Hospital.",
    category: "match",
    categoryLabel: "Donor Match",
    time: "15 mins ago",
    read: false
  },
  {
    id: "notif-2",
    targetRole: "student",
    targetUserId: "WUB-2023-0842",
    title: "Request Verified & Approved",
    desc: "Your blood request for B+ (1 unit) has been reviewed and approved by WUB Health Office.",
    category: "update",
    categoryLabel: "Request Update",
    time: "2 hours ago",
    read: false
  },
  {
    id: "notif-3",
    targetRole: "all",
    targetUserId: "all",
    title: "Urgent Campus Alert",
    desc: "Emergency O- blood needed for student family member at Uttara Modern Hospital.",
    category: "urgent",
    categoryLabel: "Urgent Alert",
    time: "5 hours ago",
    read: false
  },
  {
    id: "notif-4",
    targetRole: "admin",
    targetUserId: "all",
    title: "New Donor Pending Verification",
    desc: "Mahmud Hasan (A+, BBA) registered as a donor and requires identity approval.",
    category: "update",
    categoryLabel: "Admin Queue",
    time: "6 hours ago",
    read: false
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    timestamp: "2026-09-16 09:30:15",
    actorName: "Dr. Kazi Fahim",
    actorRole: "admin",
    action: "APPROVE_REQUEST",
    target: "req-1 (Tanvir Alam - B+)",
    details: "Reviewed hospital prescription & approved emergency broadcast."
  },
  {
    id: "log-2",
    timestamp: "2026-09-15 14:12:00",
    actorName: "Sharmin Sultana",
    actorRole: "moderator",
    action: "VERIFY_DONOR",
    target: "donor-2 (Sadia Meem - O+)",
    details: "Verified student ID card & departmental enrollment."
  },
  {
    id: "log-3",
    timestamp: "2026-09-14 11:05:40",
    actorName: "Prof. Dr. M. Rahman",
    actorRole: "super_admin",
    action: "ROLE_CHANGE",
    target: "Sharmin Sultana",
    details: "Granted 'moderator' permissions for Red Crescent committee."
  }
];

// ==========================================================================
// 3. PERSISTENT STORAGE MANAGEMENT
// ==========================================================================
function getStoredUsers() {
  const data = localStorage.getItem("wub_blood_users");
  if (!data) {
    localStorage.setItem("wub_blood_users", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem("wub_blood_users", JSON.stringify(users));
}

function getStoredDonors() {
  const data = localStorage.getItem("wub_blood_donors");
  if (!data) {
    localStorage.setItem("wub_blood_donors", JSON.stringify(INITIAL_DONORS));
    return INITIAL_DONORS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DONORS;
  }
}

function saveDonors(donors) {
  localStorage.setItem("wub_blood_donors", JSON.stringify(donors));
}

function getStoredRequests() {
  const data = localStorage.getItem("wub_blood_requests");
  if (!data) {
    localStorage.setItem("wub_blood_requests", JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

function saveRequests(reqs) {
  localStorage.setItem("wub_blood_requests", JSON.stringify(reqs));
}

function getStoredNotifications() {
  const data = localStorage.getItem("wub_blood_notifications");
  if (!data) {
    localStorage.setItem("wub_blood_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

function saveNotifications(notifs) {
  localStorage.setItem("wub_blood_notifications", JSON.stringify(notifs));
  updateNotificationBadge();
}

function getStoredAuditLogs() {
  const data = localStorage.getItem("wub_blood_audit_logs");
  if (!data) {
    localStorage.setItem("wub_blood_audit_logs", JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

function saveAuditLogs(logs) {
  localStorage.setItem("wub_blood_audit_logs", JSON.stringify(logs));
}

function logAuditEvent(action, target, details) {
  const user = getCurrentUser() || { name: "System", role: "system" };
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
  
  const newLog = {
    id: "log-" + Date.now(),
    timestamp: timestamp,
    actorName: user.name || "Administrator",
    actorRole: user.role || "admin",
    action: action,
    target: target,
    details: details
  };

  const logs = getStoredAuditLogs();
  logs.unshift(newLog);
  saveAuditLogs(logs);
}

function createNotification(targetRole, targetUserId, title, desc, category = "update", categoryLabel = "Notification") {
  const notif = {
    id: "notif-" + Date.now(),
    targetRole: targetRole,
    targetUserId: targetUserId,
    title: title,
    desc: desc,
    category: category,
    categoryLabel: categoryLabel,
    time: "Just now",
    read: false
  };

  const notifs = getStoredNotifications();
  notifs.unshift(notif);
  saveNotifications(notifs);
}

// ==========================================================================
// 4. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
// ==========================================================================
function getCurrentUser() {
  const user = localStorage.getItem("wub_blood_session");
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("wub_blood_session", JSON.stringify(user));
  } else {
    localStorage.removeItem("wub_blood_session");
  }
  updateTopbarAuthUI();
}

const ROLE_HIERARCHY = {
  "student": 1,
  "moderator": 2,
  "admin": 3,
  "super_admin": 4
};

function hasRole(requiredRole) {
  const user = getCurrentUser();
  if (!user) return false;
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(r => hasRole(r));
  }
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const reqLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= reqLevel;
}

/**
 * Enforce RBAC on restricted administrative pages
 */
function protectAdminPage() {
  const user = getCurrentUser();
  if (!user) {
    showToast("Authentication required. Redirecting to login...", "danger");
    setTimeout(() => {
      window.location.href = "login.html?redirect=admin.html";
    }, 800);
    return false;
  }

  // Only moderator, admin, super_admin can enter admin console
  const adminRoles = ["moderator", "admin", "super_admin"];
  if (!adminRoles.includes(user.role)) {
    showToast("Access Denied: You do not have administrative permissions.", "danger");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
    return false;
  }
  return true;
}

function protectStudentDashboard() {
  const user = getCurrentUser();
  if (!user) {
    showToast("Please login to access your student dashboard.", "danger");
    setTimeout(() => {
      window.location.href = "login.html?redirect=dashboard.html";
    }, 800);
    return false;
  }
  return true;
}

function loginUser(event) {
  if (event) event.preventDefault();

  const idInput = document.getElementById("loginId")?.value.trim();
  const passInput = document.getElementById("loginPassword")?.value.trim();

  if (!idInput || !passInput) {
    showToast("Please enter your Student ID / Username and Password.", "danger");
    return;
  }

  const users = getStoredUsers();
  const user = users.find(u => 
    (u.username.toLowerCase() === idInput.toLowerCase() || u.id.toLowerCase() === idInput.toLowerCase() || u.email.toLowerCase() === idInput.toLowerCase()) && 
    u.password === passInput
  );

  if (!user) {
    showToast("Invalid credentials. Please check your ID and password.", "danger");
    return;
  }

  if (user.status === "suspended") {
    showToast("Your account has been suspended by campus administration.", "danger");
    return;
  }

  // Create active session
  const sessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    dept: user.dept,
    blood: user.blood,
    phone: user.phone,
    address: user.address,
    isDonor: user.isDonor || false,
    donorAvailable: user.donorAvailable !== false,
    verificationStatus: user.verificationStatus || "unverified",
    lastDonation: user.lastDonation || "Never",
    totalDonations: user.totalDonations || 0,
    privacy: user.privacy || { showPhone: true, showAddress: false, showInDonorList: true },
    initials: user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  };

  setCurrentUser(sessionUser);
  logAuditEvent("USER_LOGIN", user.id, `User logged in with role [${user.role}]`);

  showToast(`Welcome back, ${user.name}!`, "success");

  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get("redirect");

  setTimeout(() => {
    if (redirectTarget) {
      window.location.href = redirectTarget;
    } else if (["admin", "super_admin", "moderator"].includes(user.role)) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }, 700);
}

function quickFillLogin(roleType) {
  const idEl = document.getElementById("loginId");
  const passEl = document.getElementById("loginPassword");
  if (!idEl || !passEl) return;

  switch(roleType) {
    case "student":
      idEl.value = "WUB-2023-0842";
      passEl.value = "student123";
      break;
    case "moderator":
      idEl.value = "moderator";
      passEl.value = "mod123";
      break;
    case "admin":
      idEl.value = "admin";
      passEl.value = "admin123";
      break;
    case "super_admin":
      idEl.value = "superadmin";
      passEl.value = "super123";
      break;
    default:
      idEl.value = "WUB-2023-0842";
      passEl.value = "student123";
  }
}

function registerAccount(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("regName")?.value.trim();
  const id = document.getElementById("regId")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const pass = document.getElementById("regPassword")?.value.trim();
  const blood = document.getElementById("regBlood")?.value || "O+";
  const dept = document.getElementById("regDept")?.value || "Computer Science & Engineering (CSE)";
  const phone = document.getElementById("regPhone")?.value.trim();
  const address = document.getElementById("regAddress")?.value.trim() || "Uttara";

  if (!name || !id || !email || !pass || !phone) {
    showToast("Please fill in all mandatory fields.", "danger");
    return;
  }

  if (!isValidBDPhone(phone)) {
    showToast("Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).", "danger");
    return;
  }

  if (pass.length < 6) {
    showToast("Password must be at least 6 characters.", "danger");
    return;
  }

  const users = getStoredUsers();
  if (users.some(u => u.id.toLowerCase() === id.toLowerCase() || u.username.toLowerCase() === id.toLowerCase())) {
    showToast("A user with this Student ID is already registered.", "danger");
    return;
  }

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showToast("This email address is already in use.", "danger");
    return;
  }

  const newUser = {
    id: id,
    username: id,
    password: pass,
    name: name,
    email: email,
    role: "student",
    dept: dept,
    blood: blood,
    phone: phone,
    address: address,
    isDonor: false,
    donorAvailable: true,
    verificationStatus: "pending",
    totalDonations: 0,
    lastDonation: "Never",
    privacy: {
      showPhone: true,
      showAddress: false,
      showInDonorList: true
    },
    status: "active"
  };

  users.push(newUser);
  saveUsers(users);

  logAuditEvent("USER_REGISTER", id, `New student account created (${name})`);
  createNotification("admin", "all", "New Student Registration", `${name} (${id}) created a new student account.`, "update", "Registration");

  // Sign in immediately
  setCurrentUser({
    ...newUser,
    initials: name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  });

  showToast("Account created successfully! Welcome to WUB Blood.", "success");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 900);
}

function logoutUser() {
  const user = getCurrentUser();
  if (user) {
    logAuditEvent("USER_LOGOUT", user.id, "User signed out.");
  }
  setCurrentUser(null);
  showToast("You have been logged out securely.", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
}

function togglePasswordVisibility(fieldId = "loginPassword") {
  const input = document.getElementById(fieldId);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

// ==========================================================================
// 5. TOPBAR UI & NOTIFICATIONS
// ==========================================================================
function updateTopbarAuthUI() {
  const user = getCurrentUser();
  const profileWrap = document.getElementById("topbarUserMenuWrap");
  if (!profileWrap) return;

  if (user) {
    const initials = user.initials || user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const roleLabel = user.role === 'super_admin' ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : (user.role === 'moderator' ? 'Moderator' : 'Student'));

    profileWrap.innerHTML = `
      <button class="user-profile-btn" id="userProfileBtn" onclick="toggleProfileDropdown()">
        <div class="avatar-initials">${initials}</div>
        <span>${user.name.split(' ')[0]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="dropdown-menu" id="userDropdownMenu">
        <div class="dropdown-header">
          <b>${user.name}</b>
          <small>${user.id} · <span style="text-transform: capitalize; color: var(--primary); font-weight: 700;">${roleLabel}</span></small>
        </div>
        ${["admin", "super_admin", "moderator"].includes(user.role) ? `
          <a href="admin.html" class="dropdown-item">⚙ Admin Console</a>
        ` : ''}
        <a href="dashboard.html" class="dropdown-item">⌂ My Dashboard</a>
        <a href="request-blood.html" class="dropdown-item">⊕ Request Blood</a>
        <a href="find-blood.html" class="dropdown-item">⌕ Find Blood</a>
        <div class="dropdown-divider"></div>
        <a href="javascript:void(0)" onclick="logoutUser()" class="dropdown-item" style="color: var(--accent);">⎋ Log Out</a>
      </div>
    `;
  } else {
    profileWrap.innerHTML = `
      <a href="login.html" class="user-profile-btn" style="border: 1px solid var(--border); padding: 6px 14px; background: #fff; border-radius: var(--radius-md);">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style="font-weight: 600;">Login ▾</span>
      </a>
    `;
  }
}

function toggleProfileDropdown() {
  const menu = document.getElementById("userDropdownMenu");
  if (menu) menu.classList.toggle("show");
}

function updateNotificationBadge() {
  const notifs = getStoredNotifications();
  const user = getCurrentUser();
  
  // Filter notifications visible to this user/role
  const userNotifs = notifs.filter(n => {
    if (!user) return n.targetRole === "all";
    if (n.targetRole === "all") return true;
    if (n.targetUserId === user.id) return true;
    if (["admin", "super_admin"].includes(user.role) && n.targetRole === "admin") return true;
    if (user.role === "moderator" && (n.targetRole === "moderator" || n.targetRole === "admin")) return true;
    if (user.role === "student" && n.targetRole === "student") return true;
    return false;
  });

  const unreadCount = userNotifs.filter(n => !n.read).length;
  const badges = document.querySelectorAll(".notification-badge");
  badges.forEach(b => {
    if (unreadCount > 0) {
      b.style.display = "block";
      b.textContent = unreadCount > 9 ? "9+" : unreadCount;
      b.classList.add("has-unread");
    } else {
      b.style.display = "none";
      b.textContent = "";
      b.classList.remove("has-unread");
    }
  });
}

function toggleNotifications() {
  let panel = document.getElementById("notificationsPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "notificationsPanel";
    panel.className = "notifications-panel";
    
    const topbarRight = document.querySelector(".topbar-right");
    if (topbarRight) {
      topbarRight.style.position = "relative";
      topbarRight.appendChild(panel);
    } else {
      document.body.appendChild(panel);
    }
  }

  const isShowing = panel.classList.contains("show");
  if (isShowing) {
    panel.classList.remove("show");
  } else {
    renderNotifications();
    panel.classList.add("show");
  }
}

function renderNotifications() {
  const panel = document.getElementById("notificationsPanel");
  if (!panel) return;

  const notifs = getStoredNotifications();
  const user = getCurrentUser();

  const userNotifs = notifs.filter(n => {
    if (!user) return n.targetRole === "all";
    if (n.targetRole === "all") return true;
    if (n.targetUserId === user.id) return true;
    if (["admin", "super_admin"].includes(user.role) && n.targetRole === "admin") return true;
    if (user.role === "moderator" && (n.targetRole === "moderator" || n.targetRole === "admin")) return true;
    if (user.role === "student" && n.targetRole === "student") return true;
    return false;
  });

  const unreadCount = userNotifs.filter(n => !n.read).length;

  const getCategoryClass = (cat) => {
    switch(cat) {
      case "match": return "cat-match";
      case "urgent": return "cat-urgent";
      case "campaign": return "cat-campaign";
      default: return "cat-update";
    }
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case "match": return "🤝";
      case "urgent": return "🚨";
      case "campaign": return "📢";
      default: return "📋";
    }
  };

  panel.innerHTML = `
    <div class="notif-header">
      <h4>
        <span>🔔 Notifications</span>
        ${unreadCount > 0 ? `<span class="notif-count-badge">${unreadCount} new</span>` : ''}
      </h4>
      ${unreadCount > 0 ? `
        <button class="notif-clear-btn" onclick="markAllNotificationsRead()">Mark all read</button>
      ` : `
        <span style="font-size: 11px; color: var(--text-muted);">All caught up</span>
      `}
    </div>
    <div class="notif-list">
      ${userNotifs.length === 0 ? `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12.5px;">
          No notifications yet.
        </div>
      ` : userNotifs.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}')">
          <div class="notif-icon ${getCategoryClass(n.category)}">
            ${getCategoryIcon(n.category)}
          </div>
          <div class="notif-content">
            <div class="notif-title">
              <span>${n.title}</span>
              ${!n.read ? '<span style="width: 7px; height: 7px; background: var(--accent); border-radius: 50%;"></span>' : ''}
            </div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-meta">
              <span class="notif-category-pill ${getCategoryClass(n.category)}">${n.categoryLabel || 'Update'}</span>
              <span>•</span>
              <span>${n.time}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function markAllNotificationsRead() {
  const notifs = getStoredNotifications();
  notifs.forEach(n => n.read = true);
  saveNotifications(notifs);
  renderNotifications();
  showToast("All notifications marked as read.", "success");
}

function markNotificationRead(id) {
  const notifs = getStoredNotifications();
  const found = notifs.find(n => n.id === id);
  if (found && !found.read) {
    found.read = true;
    saveNotifications(notifs);
    renderNotifications();
  }
}

// ==========================================================================
// 6. DONOR REGISTRATION & PROFILE WORKFLOW (Phase 4)
// Student Registration -> Student Account -> Donor Profile -> Pending Verification -> Verified -> Available in Find Blood
// ==========================================================================
function registerDonor(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("donorFullName")?.value.trim();
  const blood = document.getElementById("donorBloodGroup")?.value;
  const dept = document.getElementById("donorDept")?.value;
  const studentId = document.getElementById("donorStudentId")?.value.trim();
  const phone = document.getElementById("donorPhone")?.value.trim();
  const campus = document.getElementById("donorCampus")?.value || "Uttara";

  if (!name || !studentId || !phone) {
    showToast("Please fill in your Name, Student ID, and Phone Number.", "danger");
    return;
  }

  if (!isValidBDPhone(phone)) {
    showToast("Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).", "danger");
    return;
  }

  if (!blood || blood.includes("Select")) {
    showToast("Please select your blood group.", "danger");
    return;
  }

  if (!dept || dept.includes("Select")) {
    showToast("Please select your department.", "danger");
    return;
  }

  const initials = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  const avatarClasses = ["avatar-ar", "avatar-sm", "avatar-ni", "avatar-tp", "avatar-fr", "avatar-fs", "avatar-ma", "avatar-sh"];
  const randomAvatarClass = avatarClasses[Math.floor(Math.random() * avatarClasses.length)];

  // Register donor record with 'pending' verification status
  const newDonor = {
    id: "donor-" + Date.now(),
    userId: studentId,
    name: name,
    initials: initials,
    avatarClass: randomAvatarClass,
    blood: blood,
    dept: dept,
    campus: campus,
    location: campus,
    phone: phone,
    available: true,
    verificationStatus: "pending", // Verified by Admin before visible in Find Blood
    donationsCount: 0,
    lastDonation: "Newly Registered"
  };

  const donors = getStoredDonors();
  // Check if donor already exists
  const existingIdx = donors.findIndex(d => d.userId === studentId || d.phone === phone);
  if (existingIdx !== -1) {
    donors[existingIdx] = { ...donors[existingIdx], ...newDonor, verificationStatus: "pending" };
  } else {
    donors.unshift(newDonor);
  }
  saveDonors(donors);

  // Synchronize current user session if student is logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    currentUser.isDonor = true;
    currentUser.donorAvailable = true;
    currentUser.verificationStatus = "pending";
    currentUser.blood = blood;
    currentUser.phone = phone;
    currentUser.dept = dept;
    currentUser.address = campus;
    setCurrentUser(currentUser);

    // Also update in users database
    const users = getStoredUsers();
    const uIdx = users.findIndex(u => u.id === currentUser.id);
    if (uIdx !== -1) {
      users[uIdx] = { ...users[uIdx], ...currentUser };
      saveUsers(users);
    }
  }

  // Audit log & Admin notification
  logAuditEvent("DONOR_REGISTER", studentId, `${name} registered as donor (${blood}, ${campus}) - Verification Pending.`);
  createNotification("admin", "all", "New Donor Verification Pending", `${name} (${studentId}) registered as a ${blood} donor. Identity review needed.`, "update", "Verification");

  showToast(`Thank you, ${name}! Your donor profile is submitted for verification by WUB Health Office.`, "success");

  const form = document.getElementById("donorRegForm");
  if (form) form.reset();

  setTimeout(() => {
    if (currentUser) {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "find-blood.html";
    }
  }, 1200);
}

// ==========================================================================
// 7. FIND BLOOD SEARCH & FILTER LOGIC (Phase 6)
// Only VERIFIED and AVAILABLE donors appear in Find Blood results.
// Standard Dhaka locations filter used. Department filter removed.
// ==========================================================================
function renderDonorCards(donorsToRender, containerId = "donorCardsContainer") {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (donorsToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #fff; border-radius: var(--radius-lg); border: 1.5px dashed var(--border);">
        <div style="font-size: 32px; margin-bottom: 8px;">🩸</div>
        <p style="font-size: 16px; font-weight: 700; color: var(--text);">No matching verified donors found</p>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px; max-width: 420px; margin-left: auto; margin-right: auto;">
          Try expanding your Dhaka location filter or selecting a different blood group. Need blood urgently? Post an emergency request.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 16px;">
          <button onclick="resetDonorFilters()" class="btn btn-outline btn-sm">↻ Reset Filters</button>
          <a href="request-blood.html" class="btn btn-danger btn-sm">⊕ Post Blood Request</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = donorsToRender.map(donor => `
    <div class="donor-card" data-id="${donor.id}">
      <div>
        <div class="donor-card-top">
          <div class="donor-avatar ${donor.avatarClass || 'avatar-ar'}">
            ${donor.initials || donor.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
          </div>
          <div class="donor-info">
            <h4 class="donor-name" title="${donor.name}">${donor.name}</h4>
            <div class="donor-blood-tag">${donor.blood}</div>
          </div>
        </div>

        <div class="donor-meta-row" style="margin-top: 10px;">
          <div class="donor-meta-item" title="Department">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>${donor.dept}</span>
          </div>
          <div class="donor-meta-item" title="Dhaka Location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${donor.campus || donor.location || 'Uttara'}</span>
          </div>
        </div>
      </div>

      <div>
        <div style="margin: 8px 0 10px; display: flex; align-items: center; justify-content: space-between;">
          <span class="donor-status-pill ${donor.available ? 'status-available' : 'status-urgent'}">
            ${donor.available ? '● Available' : '● On Break'}
          </span>
          <span style="font-size: 11px; color: var(--text-muted);">${donor.donationsCount || 1} donations</span>
        </div>
        <button class="btn btn-outline btn-block btn-sm" onclick="openContactModal('${donor.id}')">
          Contact Donor
        </button>
      </div>
    </div>
  `).join('');
}

function filterDonors() {
  const bloodFilter = document.getElementById("bloodFilter")?.value || "";
  const locationFilter = document.getElementById("locationFilter")?.value || "";
  const availabilityFilter = document.getElementById("availabilityFilter")?.value || "";
  const searchInput = document.getElementById("globalSearchInput")?.value.toLowerCase().trim() || "";
  const sortSelect = document.getElementById("donorSortSelect")?.value || "latest";

  // Data flow requirement: Only verified donors should appear in Find Blood
  let donors = getStoredDonors().filter(d => d.verificationStatus === "verified" || !d.verificationStatus);

  let filtered = donors.filter(d => {
    const matchBlood = !bloodFilter || bloodFilter === "Select blood group" || d.blood.toUpperCase() === bloodFilter.toUpperCase();
    
    const donorLoc = (d.campus || d.location || "").toLowerCase();
    const matchLocation = !locationFilter || locationFilter === "Select area/campus" || locationFilter === "Select location" || 
      donorLoc.includes(locationFilter.toLowerCase());

    const matchAvailability = !availabilityFilter || 
      (availabilityFilter === "available" && d.available === true) || 
      (availabilityFilter === "paused" && d.available === false);

    const matchSearch = !searchInput || 
      d.name.toLowerCase().includes(searchInput) || 
      d.blood.toLowerCase().includes(searchInput) || 
      (d.dept && d.dept.toLowerCase().includes(searchInput)) || 
      donorLoc.includes(searchInput);

    return matchBlood && matchLocation && matchAvailability && matchSearch;
  });

  if (sortSelect === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect === "blood") {
    filtered.sort((a, b) => a.blood.localeCompare(b.blood));
  } else if (sortSelect === "donations") {
    filtered.sort((a, b) => (b.donationsCount || 0) - (a.donationsCount || 0));
  }

  renderDonorCards(filtered);

  const countEl = document.getElementById("donorCountDisplay");
  if (countEl) {
    countEl.textContent = `${filtered.length} verified donor${filtered.length === 1 ? '' : 's'} available in Dhaka`;
  }
}

function resetDonorFilters() {
  const bf = document.getElementById("bloodFilter");
  const lf = document.getElementById("locationFilter");
  const af = document.getElementById("availabilityFilter");
  const sf = document.getElementById("globalSearchInput");
  const so = document.getElementById("donorSortSelect");

  if (bf) bf.value = "";
  if (lf) lf.value = "";
  if (af) af.value = "";
  if (sf) sf.value = "";
  if (so) so.value = "latest";

  filterDonors();
}

// ==========================================================================
// 8. DONOR CONTACT MODAL (Phase 7)
// Safe, professional contact modal with Call & WhatsApp
// ==========================================================================
function openContactModal(donorId) {
  const donors = getStoredDonors();
  const donor = donors.find(d => d.id === donorId);
  if (!donor) return;

  const cleanPhone = donor.phone.replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(`Assalamu Alaikum ${donor.name},\nI found your verified contact on WUB Blood and urgently need ${donor.blood} blood for a patient at ${donor.campus || 'Dhaka'}. Are you available to help?`);

  const modalHtml = `
    <div class="custom-modal-backdrop show" id="contactModal">
      <div class="custom-modal-window" style="max-width: 480px;">
        <div class="custom-modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Donor Contact Information
          </h3>
          <button class="modal-close-btn" onclick="closeContactModal()">&times;</button>
        </div>
        <div class="custom-modal-body">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border);">
            <div class="donor-avatar ${donor.avatarClass || 'avatar-ar'}" style="width: 48px; height: 48px; font-size: 17px;">
              ${donor.initials || donor.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 style="font-size: 16px; margin: 0; color: var(--text);">${donor.name}</h3>
              <div style="font-size: 12px; color: var(--text-muted);">${donor.dept} · ${donor.campus || donor.location || 'Dhaka'}</div>
              <span class="donor-status-pill status-available" style="margin-top: 4px; display: inline-flex;">● Verified WUB Student Donor</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <div style="background: var(--surface-alt); padding: 10px 12px; border-radius: 8px;">
              <small style="color: var(--text-muted); font-size: 11px;">Blood Group</small>
              <div style="font-size: 20px; font-weight: 800; color: var(--primary);">${donor.blood}</div>
            </div>
            <div style="background: var(--surface-alt); padding: 10px 12px; border-radius: 8px;">
              <small style="color: var(--text-muted); font-size: 11px;">Donations Given</small>
              <div style="font-size: 20px; font-weight: 800; color: var(--secondary);">${donor.donationsCount || 1} times</div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label style="font-size: 12px; font-weight: 600; color: var(--text);">Direct Contact Options</label>
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <input type="text" class="form-input" value="${donor.phone}" readonly style="font-weight: 700; letter-spacing: 0.5px;">
              <a href="tel:${donor.phone}" class="btn btn-primary btn-sm" style="flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;">
                📞 Call
              </a>
              <a href="https://wa.me/88${cleanPhone}?text=${waMessage}" target="_blank" class="btn btn-outline btn-sm" style="flex-shrink: 0; color: #059669; border-color: #10B981; display: inline-flex; align-items: center; gap: 4px;">
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 4px;">
            <label for="inAppMsg" style="font-size: 12px; font-weight: 600; color: var(--text);">Send Fast In-App Emergency Alert</label>
            <textarea class="form-textarea" id="inAppMsg" rows="2" placeholder="Hi ${donor.name}, we urgently require ${donor.blood} blood for a student family member at..."></textarea>
          </div>

          <div style="margin-top: 10px; font-size: 11px; color: var(--text-muted); line-height: 1.4; background: #F8FAFC; padding: 8px 10px; border-radius: 6px;">
            🛡️ <b>Etiquette:</b> Please only contact donors for genuine medical needs. Be polite and state hospital name clearly.
          </div>
        </div>
        <div class="custom-modal-footer">
          <button class="btn btn-outline" onclick="closeContactModal()">Cancel</button>
          <button class="btn btn-danger" onclick="sendAlertMessage('${donor.name}', '${donor.id}')">🚨 Dispatch Alert</button>
        </div>
      </div>
    </div>
  `;

  closeContactModal();
  const wrap = document.createElement("div");
  wrap.id = "contactModalWrapper";
  wrap.innerHTML = modalHtml;
  document.body.appendChild(wrap);
}

function closeContactModal() {
  const modal = document.getElementById("contactModalWrapper");
  if (modal) modal.remove();
}

function sendAlertMessage(donorName, donorId) {
  const msg = document.getElementById("inAppMsg")?.value.trim();
  const user = getCurrentUser() || { name: "A fellow WUB student", id: "Student" };
  
  createNotification("student", donorId, "Urgent Emergency Contact", `${user.name} dispatched an urgent blood alert to you: "${msg || 'Immediate blood support needed'}"`, "urgent", "Emergency");
  
  closeContactModal();
  showToast(`Emergency alert dispatched to ${donorName}. They have received your notification and contact info.`, "success");
}

// ==========================================================================
// 9. BLOOD REQUEST WORKFLOW (Phase 8)
// Student submits -> Admin reviews -> Admin Approves / Rejects / Completes -> Student sees status
// ==========================================================================
function submitRequest(event) {
  if (event) event.preventDefault();

  const bloodGroup = document.getElementById("requestBlood")?.value;
  const units = document.getElementById("requestUnits")?.value.trim() || "1 unit";
  const location = document.getElementById("requestLocation")?.value;
  const urgency = document.getElementById("requestUrgency")?.value || "Normal";
  const reason = document.getElementById("requestReason")?.value.trim() || "Immediate student emergency.";
  const contactPhone = document.getElementById("requestPhone")?.value.trim();

  if (!bloodGroup || bloodGroup.includes("Select")) {
    showToast("Please select the required blood group.", "danger");
    return;
  }

  if (!location || location.includes("Select")) {
    showToast("Please select the hospital / campus location.", "danger");
    return;
  }

  if (!contactPhone) {
    showToast("Please enter an emergency contact phone number.", "danger");
    return;
  }

  if (!isValidBDPhone(contactPhone)) {
    showToast("Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).", "danger");
    return;
  }

  const user = getCurrentUser() || { name: "Tanvir Alam", id: "WUB-2023-0842", phone: "01712345678" };

  const newRequest = {
    id: "req-" + Date.now(),
    requesterId: user.id,
    blood: bloodGroup,
    units: units,
    location: location,
    urgency: urgency,
    reason: reason,
    studentName: user.name,
    studentId: user.id,
    contactPhone: contactPhone || user.phone || "017XXXXXXXX",
    date: "Just now",
    status: "Pending", // Starts as Pending Review
    reviewedBy: null
  };

  const currentRequests = getStoredRequests();
  currentRequests.unshift(newRequest);
  saveRequests(currentRequests);

  // Notify Admins
  logAuditEvent("REQUEST_SUBMIT", newRequest.id, `New blood request submitted by ${user.name} (${bloodGroup}, ${units} at ${location})`);
  createNotification("admin", "all", "New Blood Request Pending Review", `${user.name} (${user.id}) requested ${units} of ${bloodGroup} at ${location}.`, "urgent", "Blood Request");

  showToast(`Blood request submitted! It has been dispatched to WUB Health Office for verification.`, "success");

  const form = document.getElementById("bloodRequestForm");
  if (form) form.reset();

  renderRequestsList();
}

function renderRequestsList() {
  const container = document.getElementById("recentRequestsTableBody");
  if (!container) return;

  // Show only Approved requests on public feed
  const reqs = getStoredRequests().filter(r => r.status === "Approved" || r.status === "Active");
  if (reqs.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">No active campus blood requests currently.</td></tr>`;
    return;
  }

  container.innerHTML = reqs.map(r => `
    <tr>
      <td><b style="color: var(--accent); font-size: 14px;">${r.blood}</b></td>
      <td>${r.units}</td>
      <td>${r.location}</td>
      <td>
        <span class="donor-status-pill ${r.urgency === 'Emergency' ? 'status-urgent' : 'status-available'}">
          ${r.urgency}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="showToast('Connecting with requester ${r.studentName}... Dialing ${r.contactPhone || 'campus office'}', 'success')">
          Offer Blood
        </button>
      </td>
    </tr>
  `).join('');
}

// ==========================================================================
// 10. STUDENT DASHBOARD (Phase 5)
// Real-time synchronization of Profile, Availability, Requests & Stats
// ==========================================================================
function renderDashboardProfile() {
  const container = document.getElementById("studentProfileSection");
  if (!container) return;

  const user = getCurrentUser() || getStoredUsers().find(u => u.id === "WUB-2023-0842");
  if (!user) return;

  // Update greeting heading
  const greetingEl = document.getElementById("dashStudentGreeting");
  if (greetingEl) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    greetingEl.textContent = `${greeting}, ${user.name.split(' ')[0]}!`;
  }

  const isVerified = user.verificationStatus === "verified";
  const verificationBadgeHtml = isVerified 
    ? `<span class="badge-status badge-verified-student" title="Identity verified by WUB Health Office">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        WUB Verified Student
       </span>`
    : `<span class="badge-status badge-unverified-student" title="Verification under review">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Pending Verification
       </span>`;

  let donorBadgeHtml = "";
  if (user.isDonor) {
    if (user.donorAvailable) {
      donorBadgeHtml = `
        <span class="badge-status badge-donor-active" title="Available to receive blood requests">
          <span style="width: 7px; height: 7px; background: #059669; border-radius: 50%;"></span>
          Active Donor — Available
        </span>
      `;
    } else {
      donorBadgeHtml = `
        <span class="badge-status badge-donor-paused" title="Temporarily paused">
          <span style="width: 7px; height: 7px; background: #D97706; border-radius: 50%;"></span>
          Donor Status — On Break
        </span>
      `;
    }
  } else {
    donorBadgeHtml = `
      <span class="badge-status badge-donor-not-registered" title="Not yet registered as donor">
        <span style="width: 7px; height: 7px; background: #94A3B8; border-radius: 50%;"></span>
        Not Registered as Donor
      </span>
    `;
  }

  container.innerHTML = `
    <div class="profile-hero-card">
      <div class="profile-header-layout">
        
        <div class="profile-identity-group">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar-img">
              ${user.initials || user.name.substring(0, 2).toUpperCase()}
            </div>
            <div class="profile-avatar-badge" title="Student Status Active">✓</div>
          </div>

          <div class="profile-meta-main">
            <h2>
              <span>${user.name}</span>
              <span class="blood-group-tag" style="font-size: 18px; margin-left: 4px;">(${user.blood})</span>
            </h2>
            <div class="profile-sub-title">
              <span><b>ID:</b> ${user.id}</span>
              <span class="dot">•</span>
              <span>${user.dept}</span>
              <span class="dot">•</span>
              <span>World University of Bangladesh</span>
            </div>
          </div>
        </div>

        <div class="profile-actions-bar">
          <button class="btn btn-outline btn-sm" onclick="openEditProfileModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Profile
          </button>
          <button class="btn btn-outline btn-sm" onclick="openPrivacyModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Privacy Settings
          </button>
        </div>

      </div>

      <div class="profile-details-grid">
        <div class="profile-detail-card">
          <small>Verification Status</small>
          <div style="margin-top: 4px;">${verificationBadgeHtml}</div>
        </div>

        <div class="profile-detail-card">
          <small>Donor Status</small>
          <div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between;">
            <div>${donorBadgeHtml}</div>
            ${user.isDonor ? `
              <button class="btn btn-outline btn-sm" onclick="toggleMyDonorAvailability()" style="font-size: 11px; padding: 2px 8px;" title="Toggle between Available and On Break">
                Toggle
              </button>
            ` : `
              <a href="become-donor.html" class="btn btn-primary btn-sm" style="font-size: 11px; padding: 2px 8px;">
                Register
              </a>
            `}
          </div>
        </div>

        <div class="profile-detail-card">
          <small>Last Donation Date</small>
          <div class="detail-value">${user.lastDonation || 'Never'}</div>
        </div>

        <div class="profile-detail-card">
          <small>Contact Phone</small>
          <div class="detail-value">${user.phone}</div>
        </div>

        <div class="profile-detail-card">
          <small>Dhaka Location</small>
          <div class="detail-value">${user.address || 'Uttara, Dhaka'}</div>
        </div>

        <div class="profile-detail-card">
          <small>Total Donations Given</small>
          <div class="detail-value" style="color: var(--secondary); font-size: 16px; font-weight: 800;">
            ${user.totalDonations || 0} times
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleMyDonorAvailability() {
  const user = getCurrentUser();
  if (!user) return;

  user.donorAvailable = !user.donorAvailable;
  setCurrentUser(user);

  // Sync users list
  const users = getStoredUsers();
  const uIdx = users.findIndex(u => u.id === user.id);
  if (uIdx !== -1) {
    users[uIdx].donorAvailable = user.donorAvailable;
    saveUsers(users);
  }

  // Sync donors list
  const donors = getStoredDonors();
  const dIdx = donors.findIndex(d => d.userId === user.id || d.phone === user.phone);
  if (dIdx !== -1) {
    donors[dIdx].available = user.donorAvailable;
    saveDonors(donors);
  }

  logAuditEvent("AVAILABILITY_TOGGLE", user.id, `Donor availability changed to [${user.donorAvailable ? 'Available' : 'Paused'}]`);
  showToast(`Your donor availability is now set to ${user.donorAvailable ? 'Available' : 'On Break'}.`, "success");

  renderDashboardProfile();
  updateDashboardStats();
}

function updateDashboardStats() {
  const donors = getStoredDonors();
  const requests = getStoredRequests();
  const user = getCurrentUser();

  const availableDonorsCount = donors.filter(d => (d.verificationStatus === "verified" || !d.verificationStatus) && d.available).length;
  
  const myRequests = user 
    ? requests.filter(r => r.requesterId === user.id || r.studentId === user.id)
    : requests;

  const statDonors = document.getElementById("statAvailableDonors");
  if (statDonors) statDonors.textContent = availableDonorsCount;

  const statReqs = document.getElementById("statMyRequests");
  if (statReqs) statReqs.textContent = myRequests.length;

  const statLives = document.getElementById("statLivesHelped");
  if (statLives) statLives.textContent = user?.totalDonations || 0;

  // Populate Donor Status Card dynamically
  const statDonorTitle = document.getElementById("statDonorTitle");
  const statDonorDesc = document.getElementById("statDonorDesc");
  const donorStatusCard = document.getElementById("donorStatusCard");
  if (user && statDonorTitle && statDonorDesc) {
    if (user.isDonor) {
      const isAvailable = user.donorAvailable !== false;
      statDonorTitle.textContent = isAvailable ? "Available" : "On Break";
      statDonorTitle.style.color = isAvailable ? "#059669" : "#D97706";
      statDonorDesc.textContent = isAvailable ? "Active Campus Donor" : "Donor Paused";
      if (donorStatusCard) {
        // Append toggle button if not already present
        let existingBtn = donorStatusCard.querySelector(".availability-pill-btn");
        if (!existingBtn) {
          const overviewContent = donorStatusCard.querySelector(".overview-content");
          if (overviewContent) {
            const btn = document.createElement("button");
            btn.className = "availability-pill-btn " + (isAvailable ? "available" : "paused");
            btn.id = "statDonorBtn";
            btn.onclick = toggleDonorAvailability;
            btn.textContent = isAvailable ? "Switch to Break" : "Go Available";
            overviewContent.appendChild(btn);
          }
        } else {
          existingBtn.className = "availability-pill-btn " + (isAvailable ? "available" : "paused");
          existingBtn.textContent = isAvailable ? "Switch to Break" : "Go Available";
        }
      }
    } else {
      statDonorTitle.textContent = "Not Donor";
      statDonorTitle.style.color = "#94A3B8";
      statDonorDesc.innerHTML = '<a href="become-donor.html" style="color: var(--primary); font-weight: 700; font-size: 11px;">Register as Donor →</a>';
    }
  }

  // Render blood compatibility panel
  renderBloodCompatibilityPanel();
}

/**
 * Blood compatibility lookup table
 */
const BLOOD_COMPATIBILITY = {
  "A+":  { donateTo: "A+, AB+",               receiveFrom: "A+, A-, O+, O-" },
  "A-":  { donateTo: "A+, A-, AB+, AB-",      receiveFrom: "A-, O-" },
  "B+":  { donateTo: "B+, AB+",               receiveFrom: "B+, B-, O+, O-" },
  "B-":  { donateTo: "B+, B-, AB+, AB-",      receiveFrom: "B-, O-" },
  "AB+": { donateTo: "AB+",                   receiveFrom: "All Blood Groups (Universal Recipient)" },
  "AB-": { donateTo: "AB+, AB-",              receiveFrom: "A-, B-, AB-, O-" },
  "O+":  { donateTo: "A+, B+, AB+, O+",      receiveFrom: "O+, O-" },
  "O-":  { donateTo: "All Blood Groups (Universal Donor)", receiveFrom: "O-" }
};

function renderBloodCompatibilityPanel() {
  const container = document.getElementById("bloodCompatibilityPanel");
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `
      <div style="padding: 32px 16px; text-align: center; color: var(--text-muted);">
        <p>Please <a href="login.html" style="color: var(--primary); font-weight: 700;">log in</a> to see your blood compatibility.</p>
      </div>
    `;
    return;
  }

  const bloodGroup = user.blood || "O+";
  const compat = BLOOD_COMPATIBILITY[bloodGroup] || { donateTo: "Consult a doctor", receiveFrom: "Consult a doctor" };
  const isAvailable = user.donorAvailable !== false;

  container.innerHTML = `
    <h3 style="font-size: 15px; margin-bottom: 4px;">Blood Compatibility</h3>
    <p style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 10px;">Based on your registered blood group</p>

    <div style="font-size: 52px; font-weight: 900; color: var(--accent); line-height: 1; margin: 8px 0; letter-spacing: -1px;">
      ${bloodGroup}
    </div>
    
    <div style="background: var(--surface-alt); border-radius: 8px; padding: 10px 12px; margin-bottom: 16px; font-size: 12px; text-align: left; line-height: 1.7;">
      <div style="margin-bottom: 4px;">
        <span style="color: var(--text-muted);">Can donate red cells to:</span> 
        <b style="color: #059669; margin-left: 4px;">${compat.donateTo}</b>
      </div>
      <div>
        <span style="color: var(--text-muted);">Can safely receive from:</span> 
        <b style="color: var(--primary); margin-left: 4px;">${compat.receiveFrom}</b>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button class="btn btn-outline btn-block" onclick="openMyRequestsModal('All')">
        📋 Manage My Requests History
      </button>
      <a href="request-blood.html" class="btn btn-danger btn-block">
        ⊕ Post Urgent Blood Request
      </a>
      <a href="find-blood.html" class="btn btn-outline btn-block">
        ⌕ Find Compatible Donors
      </a>
      ${user.isDonor ? `
        <button class="btn btn-secondary btn-block" onclick="toggleDonorAvailability()">
          ${isAvailable ? '⏸ Set Donor On Break' : '✓ Go Available Now'}
        </button>
      ` : `
        <a href="become-donor.html" class="btn btn-primary btn-block">
          ❤️ Register as Blood Donor
        </a>
      `}
    </div>
  `;
}

function openMyRequestsModal(filterStatus = "All") {
  closeCustomModal("myRequestsModal");
  const user = getCurrentUser();
  const allReqs = getStoredRequests();
  const myReqs = user ? allReqs.filter(r => r.requesterId === user.id || r.studentId === user.id) : allReqs;

  const modalHtml = `
    <div class="custom-modal-backdrop" id="myRequestsModal">
      <div class="custom-modal-window" style="max-width: 650px;">
        <div class="custom-modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            My Blood Requests History
          </h3>
          <button class="modal-close-btn" onclick="closeCustomModal('myRequestsModal')">&times;</button>
        </div>

        <div class="custom-modal-body">
          <div class="requests-filter-tabs">
            <button class="tab-btn ${filterStatus === 'All' ? 'active' : ''}" onclick="filterMyRequestsModal('All')">All (${myReqs.length})</button>
            <button class="tab-btn ${filterStatus === 'Pending' ? 'active' : ''}" onclick="filterMyRequestsModal('Pending')">Pending (${myReqs.filter(r => r.status === 'Pending').length})</button>
            <button class="tab-btn ${filterStatus === 'Approved' ? 'active' : ''}" onclick="filterMyRequestsModal('Approved')">Approved (${myReqs.filter(r => r.status === 'Approved').length})</button>
            <button class="tab-btn ${filterStatus === 'Completed' ? 'active' : ''}" onclick="filterMyRequestsModal('Completed')">Completed (${myReqs.filter(r => r.status === 'Completed').length})</button>
          </div>

          <div id="myRequestsListContainer">
            <!-- Rendered by renderMyRequestsItems -->
          </div>
        </div>

        <div class="custom-modal-footer">
          <button class="btn btn-outline" onclick="closeCustomModal('myRequestsModal')">Close</button>
          <a href="request-blood.html" class="btn btn-primary">⊕ New Request</a>
        </div>
      </div>
    </div>
  `;

  const wrap = document.createElement("div");
  wrap.id = "myRequestsModalWrap";
  wrap.innerHTML = modalHtml;
  document.body.appendChild(wrap);

  renderMyRequestsItems(filterStatus);
}

function filterMyRequestsModal(status) {
  const tabs = document.querySelectorAll(".requests-filter-tabs .tab-btn");
  tabs.forEach(t => {
    if (t.textContent.includes(status)) t.classList.add("active");
    else t.classList.remove("active");
  });
  renderMyRequestsItems(status);
}

function renderMyRequestsItems(statusFilter = "All") {
  const container = document.getElementById("myRequestsListContainer");
  if (!container) return;

  const user = getCurrentUser();
  const allReqs = getStoredRequests();
  let myReqs = user ? allReqs.filter(r => r.requesterId === user.id || r.studentId === user.id) : allReqs;

  if (statusFilter !== "All") {
    myReqs = myReqs.filter(r => r.status === statusFilter);
  }

  if (myReqs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
        <p style="font-weight: 600;">No ${statusFilter === 'All' ? '' : statusFilter.toLowerCase()} requests found.</p>
        <p style="font-size: 12px; margin-top: 4px;">Submit a new blood request anytime you or fellow students need urgent assistance.</p>
      </div>
    `;
    return;
  }

  const getStatusClass = (status) => {
    switch(status) {
      case "Pending": return "status-pill-pending";
      case "Approved": return "status-pill-approved";
      case "Completed": return "status-pill-completed";
      case "Rejected": return "status-pill-cancelled";
      default: return "status-pill-approved";
    }
  };

  container.innerHTML = myReqs.map(r => `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 16px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px; font-weight: 800; color: var(--accent);">${r.blood}</span>
          <span style="font-size: 13px; font-weight: 600; color: var(--text);">${r.units}</span>
          <span class="donor-status-pill ${r.urgency === 'Emergency' ? 'status-urgent' : 'status-available'}">${r.urgency}</span>
        </div>
        <span class="badge-status ${getStatusClass(r.status)}">
          ● ${r.status || 'Pending'}
        </span>
      </div>

      <div style="font-size: 12.5px; color: var(--text); margin-bottom: 4px;">
        <b>Location:</b> ${r.location}
      </div>

      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px; line-height: 1.4;">
        ${r.reason || 'Medical requirement.'}
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 8px; flex-wrap: wrap; gap: 8px;">
        <span style="font-size: 11px; color: var(--text-light);">Submitted: ${r.date}</span>
        
        <div style="display: flex; gap: 6px;">
          ${(r.status === 'Approved' || r.status === 'Pending') ? `
            <button class="btn btn-outline btn-sm" onclick="updateUserRequestStatus('${r.id}', 'Completed')" style="color: #059669; border-color: #10B981; font-size: 11px; padding: 3px 8px;">
              ✓ Mark Fulfilled
            </button>
            <button class="btn btn-outline btn-sm" onclick="updateUserRequestStatus('${r.id}', 'Cancelled')" style="color: #DC2626; border-color: #FCA5A5; font-size: 11px; padding: 3px 8px;">
              ✕ Cancel
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function updateUserRequestStatus(reqId, newStatus) {
  const reqs = getStoredRequests();
  const target = reqs.find(r => r.id === reqId);
  if (target) {
    target.status = newStatus;
    saveRequests(reqs);
    logAuditEvent("REQUEST_STATUS_CHANGE", reqId, `Status updated to ${newStatus}`);
    showToast(`Request marked as ${newStatus}.`, "success");
    renderMyRequestsItems();
    updateDashboardStats();
  }
}

// Edit Profile Modal
function openEditProfileModal() {
  closeCustomModal("editProfileModal");
  const user = getCurrentUser() || getStoredUsers()[3];

  const modalHtml = `
    <div class="custom-modal-backdrop" id="editProfileModal">
      <div class="custom-modal-window">
        <div class="custom-modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Student Profile
          </h3>
          <button class="modal-close-btn" onclick="closeCustomModal('editProfileModal')">&times;</button>
        </div>
        
        <form onsubmit="saveProfileEdits(event)">
          <div class="custom-modal-body">
            <div class="form-group-full">
              <label for="editFullName">Full Name *</label>
              <input type="text" id="editFullName" class="form-input" value="${user.name}" required>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label for="editStudentId">Student ID (Read-only)</label>
                <input type="text" id="editStudentId" class="form-input" value="${user.id}" readonly style="background: var(--surface-alt); cursor: not-allowed;">
              </div>

              <div class="form-group">
                <label for="editBloodGroup">Blood Group *</label>
                <select id="editBloodGroup" class="form-select" required>
                  ${BLOOD_GROUPS.map(bg => `<option value="${bg}" ${user.blood === bg ? 'selected' : ''}>${bg}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label for="editDept">Department *</label>
                <select id="editDept" class="form-select" required>
                  ${DEPARTMENTS.map(d => `<option value="${d}" ${user.dept && user.dept.includes(d.substring(0,4)) ? 'selected' : ''}>${d}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="editPhone">Contact Phone Number *</label>
                <input type="tel" id="editPhone" class="form-input" value="${user.phone}" placeholder="017XXXXXXXX" required>
              </div>
            </div>

            <div class="form-group-full">
              <label for="editAddress">Dhaka Area / Preferred Campus *</label>
              <select id="editAddress" class="form-select" required>
                ${DHAKA_LOCATIONS.map(loc => `<option value="${loc}" ${user.address === loc ? 'selected' : ''}>${loc}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="custom-modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeCustomModal('editProfileModal')">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const wrap = document.createElement("div");
  wrap.id = "editProfileModalWrap";
  wrap.innerHTML = modalHtml;
  document.body.appendChild(wrap);
}

function saveProfileEdits(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("editFullName")?.value.trim();
  const blood = document.getElementById("editBloodGroup")?.value;
  const dept = document.getElementById("editDept")?.value;
  const phone = document.getElementById("editPhone")?.value.trim();
  const address = document.getElementById("editAddress")?.value;

  if (!name || !phone) {
    showToast("Name and Phone number are required.", "danger");
    return;
  }

  if (!isValidBDPhone(phone)) {
    showToast("Please enter a valid 11-digit Bangladeshi mobile number.", "danger");
    return;
  }

  const user = getCurrentUser();
  if (user) {
    user.name = name;
    user.blood = blood;
    user.dept = dept;
    user.phone = phone;
    user.address = address;
    user.initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    setCurrentUser(user);

    // Sync in users database
    const users = getStoredUsers();
    const uIdx = users.findIndex(u => u.id === user.id);
    if (uIdx !== -1) {
      users[uIdx] = { ...users[uIdx], ...user };
      saveUsers(users);
    }

    // Sync in donors directory if student is donor
    if (user.isDonor) {
      const donors = getStoredDonors();
      const dIdx = donors.findIndex(d => d.userId === user.id || d.phone === user.phone);
      if (dIdx !== -1) {
        donors[dIdx].name = name;
        donors[dIdx].blood = blood;
        donors[dIdx].phone = phone;
        donors[dIdx].dept = dept.includes("(") ? dept.split("(")[1].replace(")", "") : dept;
        donors[dIdx].campus = address;
        donors[dIdx].location = address;
        saveDonors(donors);
      }
    }
  }

  closeCustomModal("editProfileModal");
  showToast("Profile details updated successfully!", "success");
  renderDashboardProfile();
}

// Privacy Modal
function openPrivacyModal() {
  closeCustomModal("privacyModal");
  const user = getCurrentUser() || { privacy: { showPhone: true, showAddress: false, showInDonorList: true } };
  const privacy = user.privacy || { showPhone: true, showAddress: false, showInDonorList: true };

  const modalHtml = `
    <div class="custom-modal-backdrop" id="privacyModal">
      <div class="custom-modal-window">
        <div class="custom-modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Personal Privacy & Visibility Controls
          </h3>
          <button class="modal-close-btn" onclick="closeCustomModal('privacyModal')">&times;</button>
        </div>
        
        <form onsubmit="savePrivacySettings(event)">
          <div class="custom-modal-body">
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: #1E40AF; line-height: 1.4;">
              🛡️ <b>Privacy Guarantee:</b> WUB Blood protects your identity. Personal records are strictly stored within institutional boundaries.
            </div>

            <div class="privacy-item-card">
              <div class="privacy-item-info">
                <h4>Show Mobile Phone on Find Blood</h4>
                <p>When enabled, verified students can contact you directly for urgent blood requests via Call & WhatsApp.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" id="privacyShowPhone" ${privacy.showPhone ? 'checked' : ''}>
                <span class="slider-switch"></span>
              </label>
            </div>

            <div class="privacy-item-card">
              <div class="privacy-item-info">
                <h4>Show Detailed Dhaka Area</h4>
                <p>Allow your specific Dhaka location to be visible to searchers in Find Blood.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" id="privacyShowAddress" ${privacy.showAddress ? 'checked' : ''}>
                <span class="slider-switch"></span>
              </label>
            </div>

            <div class="privacy-item-card">
              <div class="privacy-item-info">
                <h4>List in Public Campus Donor Directory</h4>
                <p>If you are an active donor, your profile will be searchable by fellow WUB members.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" id="privacyShowInDonorList" ${privacy.showInDonorList ? 'checked' : ''}>
                <span class="slider-switch"></span>
              </label>
            </div>
          </div>

          <div class="custom-modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeCustomModal('privacyModal')">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Privacy Preferences</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const wrap = document.createElement("div");
  wrap.id = "privacyModalWrap";
  wrap.innerHTML = modalHtml;
  document.body.appendChild(wrap);
}

function savePrivacySettings(event) {
  if (event) event.preventDefault();

  const showPhone = document.getElementById("privacyShowPhone")?.checked || false;
  const showAddress = document.getElementById("privacyShowAddress")?.checked || false;
  const showInDonorList = document.getElementById("privacyShowInDonorList")?.checked || false;

  const user = getCurrentUser();
  if (user) {
    user.privacy = { showPhone, showAddress, showInDonorList };
    setCurrentUser(user);

    const users = getStoredUsers();
    const uIdx = users.findIndex(u => u.id === user.id);
    if (uIdx !== -1) {
      users[uIdx].privacy = user.privacy;
      saveUsers(users);
    }
  }

  closeCustomModal("privacyModal");
  showToast("Privacy settings updated securely.", "success");
}

function closeCustomModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const wrap = modal.closest("div[id$='Wrap']") || modal.closest("div[id$='Wrapper']");
    if (wrap) wrap.remove();
    else modal.remove();
  }
}

/**
 * Alias for backward-compatibility with dashboard.html overview card
 */
function toggleDonorAvailability() {
  toggleMyDonorAvailability();
}

/**
 * Report Modal — allows students to report fake requests, suspicious activity
 */
function openReportModal(reportType, targetId, targetLabel) {
  reportType = reportType || "General";
  targetId = targetId || "campus";
  targetLabel = targetLabel || "WUB Portal";
  closeCustomModal("reportModal");

  const modalHtml = `
    <div class="custom-modal-backdrop" id="reportModal">
      <div class="custom-modal-window" style="max-width: 480px;">
        <div class="custom-modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Report an Issue
          </h3>
          <button class="modal-close-btn" onclick="closeCustomModal('reportModal')">&times;</button>
        </div>
        <form onsubmit="submitReport(event)">
          <div class="custom-modal-body">
            <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 12px; margin-bottom: 14px; font-size: 12px; color: #92400E;">
              ⚠️ Please only report genuine incidents. Misuse of the reporting system may result in account review.
            </div>

            <div class="form-group-full" style="margin-bottom: 12px;">
              <label>Issue Type</label>
              <select class="form-select" id="reportIssueType">
                <option value="fake_request">Fake or fraudulent blood request</option>
                <option value="unreachable">Unreachable contact number</option>
                <option value="commercial">Commercial / paid blood selling attempt</option>
                <option value="harassment">Harassment or inappropriate contact</option>
                <option value="other">Other issue</option>
              </select>
            </div>

            <div class="form-group-full" style="margin-bottom: 12px;">
              <label>Additional Details</label>
              <textarea class="form-textarea" id="reportDetails" rows="3" placeholder="Briefly describe what happened. Include any relevant student IDs or phone numbers if known."></textarea>
            </div>

            <div style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">
              🛡️ Your report is confidential and will be reviewed by the WUB Health Office within 24 hours.
            </div>
          </div>
          <div class="custom-modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeCustomModal('reportModal')">Cancel</button>
            <button type="submit" class="btn btn-danger">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const wrap = document.createElement("div");
  wrap.id = "reportModalWrap";
  wrap.innerHTML = modalHtml;
  document.body.appendChild(wrap);
}

function submitReport(event) {
  if (event) event.preventDefault();
  const issueType = document.getElementById("reportIssueType")?.value || "other";
  const details = document.getElementById("reportDetails")?.value.trim() || "No additional details provided.";
  const user = getCurrentUser() || { name: "Anonymous Student", id: "Anonymous" };

  logAuditEvent("ABUSE_REPORT", "Report Filed", user.name + " reported [" + issueType + "]: " + details);
  createNotification("admin", "all", "New Campus Issue Report", user.name + " reported: [" + issueType + "]. Details: " + details.substring(0, 120), "urgent", "Report");

  closeCustomModal("reportModal");
  showToast("Report submitted to WUB Health Office. Thank you for keeping the campus safe.", "success");
}

// ==========================================================================
// 11. ADMIN CONSOLE, RBAC & AUDIT LOGS (Phases 9, 10, 11)
// Tabbed administration console:
// Tab 1: Live Overview & Stats
// Tab 2: Donor Verification Queue (Pending verification, Verify / Reject)
// Tab 3: Blood Request Management (Approve, Reject, Complete)
// Tab 4: Student / User Roles Management (Super Admin only: promote/demote)
// Tab 5: Real-time Audit Trail Logs
// ==========================================================================
function renderAdminConsole() {
  if (!protectAdminPage()) return;

  const user = getCurrentUser();
  const userRole = user ? user.role : "admin";
  const isSuperAdmin = userRole === "super_admin";
  const isModerator = userRole === "moderator";

  // Render Stats
  const donors = getStoredDonors();
  const requests = getStoredRequests();
  const users = getStoredUsers();
  const auditLogs = getStoredAuditLogs();

  const pendingDonors = donors.filter(d => d.verificationStatus === "pending");
  const pendingRequests = requests.filter(r => r.status === "Pending");
  const verifiedDonors = donors.filter(d => d.verificationStatus === "verified" || !d.verificationStatus);

  const statTotalDonors = document.getElementById("adminStatTotalDonors");
  if (statTotalDonors) statTotalDonors.textContent = donors.length;

  const statPendingVerif = document.getElementById("adminStatPendingVerif");
  if (statPendingVerif) statPendingVerif.textContent = pendingDonors.length;

  const statPendingReqs = document.getElementById("adminStatPendingReqs");
  if (statPendingReqs) statPendingReqs.textContent = pendingRequests.length;

  const statTotalUsers = document.getElementById("adminStatTotalUsers");
  if (statTotalUsers) statTotalUsers.textContent = users.length;

  // Render Sub-tables
  renderAdminDonorQueue();
  renderAdminRequestsTable();
  renderAdminUsersTable();
  renderAdminAuditLogsTable();
}

function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-tab-pane").forEach(pane => pane.classList.remove("active"));

  const targetBtn = document.getElementById(`adminTabBtn_${tabName}`);
  const targetPane = document.getElementById(`adminTabPane_${tabName}`);
  if (targetBtn) targetBtn.classList.add("active");
  if (targetPane) targetPane.classList.add("active");
}

function renderAdminDonorQueue() {
  const container = document.getElementById("adminDonorQueueTable");
  if (!container) return;

  const donors = getStoredDonors();
  const user = getCurrentUser();
  const canModerate = ["moderator", "admin", "super_admin"].includes(user?.role);

  if (donors.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No donors currently registered.</td></tr>`;
    return;
  }

  container.innerHTML = donors.map(d => {
    const isPending = d.verificationStatus === "pending";
    const statusBadge = isPending
      ? `<span class="badge-status badge-unverified-student">Pending Verification</span>`
      : `<span class="badge-status badge-donor-active">✓ Verified</span>`;

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--text);">${d.name}</div>
          <small style="color: var(--text-muted);">${d.userId || 'Student'}</small>
        </td>
        <td><b style="color: var(--accent); font-size: 13.5px;">${d.blood}</b></td>
        <td>${d.dept}</td>
        <td>${d.campus || d.location || 'Uttara'}</td>
        <td>${d.phone}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${isPending ? `
              <button class="btn btn-sm btn-primary" onclick="adminVerifyDonor('${d.id}')" title="Verify identity and allow in Find Blood">
                Verify
              </button>
              <button class="btn btn-sm btn-outline" onclick="adminRejectDonor('${d.id}')" style="color: #DC2626; border-color: #FCA5A5;" title="Reject registration">
                Reject
              </button>
            ` : `
              <button class="btn btn-sm btn-outline" onclick="adminToggleDonorAvailability('${d.id}')" title="Toggle active/break status">
                ${d.available ? 'Pause' : 'Activate'}
              </button>
              ${user?.role === "super_admin" ? `
                <button class="btn btn-sm btn-outline" onclick="adminDeleteDonor('${d.id}')" style="color: #DC2626; border-color: #FCA5A5;">
                  Delete
                </button>
              ` : ''}
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function adminVerifyDonor(donorId) {
  const donors = getStoredDonors();
  const donor = donors.find(d => d.id === donorId);
  if (!donor) return;

  donor.verificationStatus = "verified";
  donor.available = true;
  saveDonors(donors);

  // Sync user record
  const users = getStoredUsers();
  const user = users.find(u => u.id === donor.userId || u.phone === donor.phone);
  if (user) {
    user.verificationStatus = "verified";
    user.isDonor = true;
    user.donorAvailable = true;
    saveUsers(users);
  }

  logAuditEvent("VERIFY_DONOR", donor.name, `Verified ${donor.blood} donor (${donor.userId}) by ${getCurrentUser()?.name}`);
  createNotification("student", donor.userId, "Donor Verification Approved!", "Your WUB Blood donor registration has been verified! You are now active in Find Blood.", "match", "Verified");

  showToast(`${donor.name} has been verified and is now live in the Find Blood directory.`, "success");
  renderAdminConsole();
}

function adminRejectDonor(donorId) {
  const donors = getStoredDonors();
  const donor = donors.find(d => d.id === donorId);
  if (!donor) return;

  donor.verificationStatus = "rejected";
  donor.available = false;
  saveDonors(donors);

  logAuditEvent("REJECT_DONOR", donor.name, `Rejected donor registration by ${getCurrentUser()?.name}`);
  showToast(`Donor application for ${donor.name} rejected.`, "danger");
  renderAdminConsole();
}

function adminToggleDonorAvailability(donorId) {
  const donors = getStoredDonors();
  const donor = donors.find(d => d.id === donorId);
  if (!donor) return;

  donor.available = !donor.available;
  saveDonors(donors);

  logAuditEvent("ADMIN_AVAILABILITY_CHANGE", donor.name, `Availability toggled to [${donor.available ? 'Available' : 'Paused'}]`);
  showToast(`${donor.name} is now marked as ${donor.available ? 'Available' : 'On Break'}.`, "success");
  renderAdminConsole();
}

function adminDeleteDonor(donorId) {
  if (!hasRole("super_admin")) {
    showToast("Unauthorized: Only Super Administrators can delete donor records.", "danger");
    return;
  }

  if (!confirm("Are you sure you want to permanently delete this donor?")) return;

  let donors = getStoredDonors();
  const target = donors.find(d => d.id === donorId);
  donors = donors.filter(d => d.id !== donorId);
  saveDonors(donors);

  logAuditEvent("DELETE_DONOR", target?.name || donorId, `Permanently removed donor record.`);
  showToast("Donor removed from registry.", "success");
  renderAdminConsole();
}

function renderAdminRequestsTable() {
  const table = document.getElementById("adminRequestsTable");
  if (!table) return;

  const reqs = getStoredRequests();
  if (reqs.length === 0) {
    table.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No blood requests submitted.</td></tr>`;
    return;
  }

  const getStatusClass = (status) => {
    switch(status) {
      case "Pending": return "status-pill-pending";
      case "Approved": return "status-pill-approved";
      case "Completed": return "status-pill-completed";
      default: return "status-pill-cancelled";
    }
  };

  table.innerHTML = reqs.map((r) => `
    <tr>
      <td><b style="color: var(--accent); font-size: 14px;">${r.blood}</b></td>
      <td>
        <div style="font-weight: 600;">${r.studentName}</div>
        <small style="color: var(--text-muted);">${r.studentId} · 📞 ${r.contactPhone || 'N/A'}</small>
      </td>
      <td>${r.units}</td>
      <td>${r.location}</td>
      <td><span class="donor-status-pill ${r.urgency === 'Emergency' ? 'status-urgent' : 'status-available'}">${r.urgency}</span></td>
      <td><span class="badge-status ${getStatusClass(r.status)}">${r.status || 'Pending'}</span></td>
      <td>
        <div style="display: flex; gap: 4px;">
          ${r.status === 'Pending' ? `
            <button class="btn btn-sm btn-primary" onclick="adminApproveRequest('${r.id}')" title="Approve emergency broadcast">Approve</button>
            <button class="btn btn-sm btn-outline" onclick="adminRejectRequest('${r.id}')" style="color: #DC2626; border-color: #FCA5A5;" title="Reject request">Reject</button>
          ` : r.status === 'Approved' ? `
            <button class="btn btn-sm btn-outline" onclick="adminCompleteRequest('${r.id}')" style="color: #059669; border-color: #10B981;" title="Mark fulfilled">Complete</button>
          ` : `
            <span style="font-size: 11px; color: var(--text-muted);">Archived</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

function adminApproveRequest(reqId) {
  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = "Approved";
  req.reviewedBy = getCurrentUser()?.name || "Admin";
  saveRequests(reqs);

  logAuditEvent("APPROVE_REQUEST", reqId, `Approved ${req.blood} request by ${req.studentName}`);
  createNotification("student", req.requesterId, "Blood Request Approved & Broadcasted", `Your request for ${req.blood} has been approved by WUB Health Office. Donors can now respond.`, "match", "Approved");

  showToast(`Blood request for ${req.blood} approved! Campus donors are alerted.`, "success");
  renderAdminConsole();
}

function adminRejectRequest(reqId) {
  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = "Rejected";
  req.reviewedBy = getCurrentUser()?.name || "Admin";
  saveRequests(reqs);

  logAuditEvent("REJECT_REQUEST", reqId, `Rejected blood request by ${req.studentName}`);
  createNotification("student", req.requesterId, "Blood Request Update", `Your blood request for ${req.blood} could not be approved. Contact WUB Health Office for queries.`, "update", "Declined");

  showToast("Blood request marked as Rejected.", "danger");
  renderAdminConsole();
}

function adminCompleteRequest(reqId) {
  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = "Completed";
  saveRequests(reqs);

  logAuditEvent("COMPLETE_REQUEST", reqId, `Blood requirement successfully fulfilled.`);
  showToast("Request marked as Completed.", "success");
  renderAdminConsole();
}

function adminUpdateRequestStatus(reqId, newStatus) {
  if (newStatus === "Approved") return adminApproveRequest(reqId);
  if (newStatus === "Rejected") return adminRejectRequest(reqId);
  if (newStatus === "Completed") return adminCompleteRequest(reqId);
  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;
  req.status = newStatus;
  saveRequests(reqs);
  renderAdminConsole();
}

function renderAdminUsersTable() {
  const table = document.getElementById("adminUsersTable");
  if (!table) return;

  const users = getStoredUsers();
  const currentUser = getCurrentUser();
  const isSuperAdmin = currentUser?.role === "super_admin";

  table.innerHTML = users.map(u => {
    const roleColors = {
      super_admin: "#DC2626",
      admin: "#0E3A8A",
      moderator: "#D97706",
      student: "#059669"
    };

    return `
      <tr>
        <td>
          <div style="font-weight: 700;">${u.name}</div>
          <small style="color: var(--text-muted);">${u.email}</small>
        </td>
        <td><b>${u.id}</b></td>
        <td>${u.dept}</td>
        <td><b style="color: var(--accent);">${u.blood}</b></td>
        <td>
          <span class="badge-status" style="color: ${roleColors[u.role] || '#333'}; background: #F8FAFC; border: 1px solid ${roleColors[u.role] || '#ccc'}; font-weight: 700; text-transform: capitalize;">
            ${u.role.replace('_', ' ')}
          </span>
        </td>
        <td>
          ${isSuperAdmin && u.id !== currentUser.id ? `
            <select class="form-select" style="padding: 3px 8px; font-size: 11.5px; width: auto;" onchange="adminChangeUserRole('${u.id}', this.value)">
              <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
              <option value="moderator" ${u.role === 'moderator' ? 'selected' : ''}>Moderator</option>
              <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
              <option value="super_admin" ${u.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
            </select>
          ` : `
            <span style="font-size: 11px; color: var(--text-muted);">${u.id === currentUser?.id ? '(Your Account)' : 'Protected'}</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function adminChangeUserRole(userId, newRole) {
  if (!hasRole("super_admin")) {
    showToast("Security Alert: Only Super Administrators can alter account roles.", "danger");
    return;
  }

  const users = getStoredUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return;

  const oldRole = target.role;
  target.role = newRole;
  saveUsers(users);

  logAuditEvent("ROLE_CHANGE", target.name, `Role changed from [${oldRole}] to [${newRole}] by Super Admin`);
  showToast(`Updated role of ${target.name} to ${newRole}.`, "success");
  renderAdminConsole();
}

function renderAdminAuditLogsTable() {
  const table = document.getElementById("adminAuditLogsTable");
  if (!table) return;

  const logs = getStoredAuditLogs();
  if (logs.length === 0) {
    table.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">No audit log events recorded yet.</td></tr>`;
    return;
  }

  table.innerHTML = logs.map(l => `
    <tr>
      <td style="font-size: 11px; color: var(--text-muted); white-space: nowrap;">${l.timestamp}</td>
      <td>
        <div style="font-weight: 600;">${l.actorName}</div>
        <small style="color: var(--text-muted); font-size: 10.5px; text-transform: capitalize;">Role: ${l.actorRole}</small>
      </td>
      <td><span class="donor-status-pill status-urgent" style="font-size: 10px;">${l.action}</span></td>
      <td><b>${l.target}</b></td>
      <td style="font-size: 11.5px; color: var(--text);">${l.details}</td>
    </tr>
  `).join('');
}

// ==========================================================================
// 12. VALIDATION & UTILITIES (Phase 14)
// ==========================================================================
function isValidBDPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^01[3-9]\d{8}$/.test(cleaned);
}

function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === "success" ? "✓" : "!"}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function toggleSide() {
  const side = document.getElementById("side");
  const overlay = document.getElementById("sideOverlay");
  if (side) side.classList.toggle("open");
  if (overlay) overlay.classList.toggle("active");
}

function closeSide() {
  const side = document.getElementById("side");
  const overlay = document.getElementById("sideOverlay");
  if (side) side.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
}

// ==========================================================================
// 13. GLOBAL DOM INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Check auth session
  updateTopbarAuthUI();
  updateNotificationBadge();

  // Populate dynamic Dhaka locations into dropdowns if empty
  populateDhakaLocationDropdowns();

  // Route: Student Dashboard
  if (document.getElementById("studentProfileSection")) {
    if (protectStudentDashboard()) {
      renderDashboardProfile();
      updateDashboardStats();
    }
  }

  // Route: Find Blood Page
  if (document.getElementById("donorCardsContainer")) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam && document.getElementById("globalSearchInput")) {
      document.getElementById("globalSearchInput").value = searchParam;
    }
    filterDonors();
  }

  // Search input real-time bindings
  const searchInput = document.getElementById("globalSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (document.getElementById("donorCardsContainer")) {
        filterDonors();
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!document.getElementById("donorCardsContainer")) {
          const q = searchInput.value.trim();
          window.location.href = `find-blood.html?search=${encodeURIComponent(q)}`;
        }
      }
    });
  }

  // Route: Request Blood Page
  if (document.getElementById("recentRequestsTableBody")) {
    renderRequestsList();
  }

  // Route: Admin Console
  if (document.getElementById("adminRequestsTable") || document.getElementById("adminDonorQueueTable")) {
    renderAdminConsole();
  }

  // Close modals & menus on click outside
  window.addEventListener("click", function(e) {
    const profileMenu = document.getElementById("userDropdownMenu");
    const profileBtn = document.getElementById("userProfileBtn");
    if (profileMenu && !profileMenu.contains(e.target) && (!profileBtn || !profileBtn.contains(e.target))) {
      profileMenu.classList.remove("show");
    }

    const notifPanel = document.getElementById("notificationsPanel");
    const notifBtn = document.querySelector(".top-action-btn[onclick*='toggleNotifications']");
    if (notifPanel && !notifPanel.contains(e.target) && (!notifBtn || !notifBtn.contains(e.target))) {
      notifPanel.classList.remove("show");
    }
  });

  // Mobile nav drawer listener
  document.querySelectorAll(".sidebar .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) closeSide();
    });
  });
});

function populateDhakaLocationDropdowns() {
  const locationSelects = [
    document.getElementById("locationFilter"),
    document.getElementById("donorCampus"),
    document.getElementById("requestLocation")
  ];

  locationSelects.forEach(select => {
    if (!select) return;
    // If the select has 4 or fewer options (e.g. just block A/B/C), enhance it with Dhaka locations
    if (select.options.length <= 5) {
      const currentVal = select.value;
      const isFilter = select.id === "locationFilter";
      select.innerHTML = `<option value="">${isFilter ? 'All Dhaka Locations' : 'Select Dhaka Area / Campus'}</option>` + 
        DHAKA_LOCATIONS.map(loc => `<option value="${loc}" ${currentVal === loc ? 'selected' : ''}>${loc}</option>`).join('');
    }
  });
}
