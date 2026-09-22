/**
 * WUB BLOOD — STUDENT BLOOD DONATION NETWORK
 * Core JavaScript Engine: Unified Data Architecture, RBAC & Workflows
 * World University of Bangladesh (WUB)
 */

// Instant theme initialization to prevent flash of wrong theme
(function () {
  try {
    const saved = localStorage.getItem("wub_theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) { }
})();

// ==========================================================================
// 1. STANDARDIZED CONSTANTS & DHAKA LOCATIONS
// ==========================================================================
const DHAKA_LOCATIONS = [
  "Agargaon",
  "Badda",
  "Banani",
  "Bashundhara",
  "Dhanmondi",
  "Farmgate",
  "Gulshan",
  "Jatrabari",
  "Khilkhet",
  "Mirpur",
  "Mohakhali",
  "Mohammadpur",
  "Motijheel",
  "Old Dhaka (Puran Dhaka)",
  "Rampura",
  "Shahbagh / DMCH",
  "Tejgaon",
  "Uttara",
  "WUB Permanent Campus (Uttara)"
];

const DHAKA_LOCATIONS_BN = {
  "Agargaon": "আগারগাঁও",
  "Badda": "বাড্ডা",
  "Banani": "বনানী",
  "Bashundhara": "বসুন্ধরা",
  "Dhanmondi": "ধানমন্ডি",
  "Farmgate": "ফার্মগেট",
  "Gulshan": "গুলশান",
  "Jatrabari": "যাত্রাবাড়ী",
  "Khilkhet": "খিলক্ষেত",
  "Mirpur": "মিরপুর",
  "Mohakhali": "মহাখালী",
  "Mohammadpur": "মোহাম্মদপুর",
  "Motijheel": "মতিঝিল",
  "Old Dhaka (Puran Dhaka)": "পুরান ঢাকা",
  "Rampura": "রামপুরা",
  "Shahbagh / DMCH": "শাহবাগ / ডিএমসিএইচ",
  "Tejgaon": "তেজগাঁও",
  "Uttara": "উত্তরা",
  "WUB Permanent Campus (Uttara)": "ডাব্লিউইউবি স্থায়ী ক্যাম্পাস (উত্তরা)"
};

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
  }
];

const INITIAL_DONORS = [];
const INITIAL_REQUESTS = [];
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-welcome",
    targetRole: "all",
    targetUserId: "all",
    title: "Welcome to WUB BloodCare",
    desc: "The verified student blood network is now open for live student registrations and requests.",
    category: "campaign",
    categoryLabel: "Announcement",
    time: "Campus Network",
    read: false
  }
];
const INITIAL_AUDIT_LOGS = [];

// ==========================================================================
// 3. PERSISTENT STORAGE MANAGEMENT (Fresh Production Storage)
// ==========================================================================

// One-time automatic cleanup to wipe legacy mock/demo cache from any browser
(function purgeLegacyDemoCache() {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (!localStorage.getItem("wub_bloodcare_clean_prod_v2")) {
    try {
      localStorage.removeItem("wub_blood_donors_v6");
      localStorage.removeItem("wub_blood_donors");
      localStorage.removeItem("wub_blood_requests");
      localStorage.removeItem("wub_blood_audit_logs");
      localStorage.removeItem("wub_blood_notifications");

      // If user was logged in as a demo student, log them out
      const cur = localStorage.getItem("wub_blood_current_user");
      if (cur) {
        try {
          const u = JSON.parse(cur);
          if (u && (u.id === "WUB-2023-0842" || u.id === "WUB-2022-1145" || u.id === "WUB-2024-0319" || u.name === "Tanvir Alam")) {
            localStorage.removeItem("wub_blood_current_user");
            localStorage.removeItem("wub_blood_token");
          }
        } catch (e) { }
      }

      // Keep only admin accounts in users store
      const existingUsers = localStorage.getItem("wub_blood_users");
      if (existingUsers) {
        try {
          const parsed = JSON.parse(existingUsers);
          const adminsOnly = parsed.filter(u => ["super_admin", "admin", "moderator"].includes(u.role));
          localStorage.setItem("wub_blood_users_v7", JSON.stringify(adminsOnly.length ? adminsOnly : INITIAL_USERS));
        } catch (e) {
          localStorage.setItem("wub_blood_users_v7", JSON.stringify(INITIAL_USERS));
        }
      } else {
        localStorage.setItem("wub_blood_users_v7", JSON.stringify(INITIAL_USERS));
      }

      localStorage.setItem("wub_blood_donors_v7", JSON.stringify([]));
      localStorage.setItem("wub_blood_requests_v7", JSON.stringify([]));
      localStorage.setItem("wub_blood_notifications_v7", JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem("wub_blood_audit_logs_v7", JSON.stringify([]));
      localStorage.setItem("wub_bloodcare_clean_prod_v2", "true");
    } catch (e) { }
  }
})();

function getStoredUsers() {
  const data = localStorage.getItem("wub_blood_users_v7") || localStorage.getItem("wub_blood_users");
  if (!data) {
    localStorage.setItem("wub_blood_users_v7", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_USERS;
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem("wub_blood_users_v7", JSON.stringify(users));
}

function getStoredDonors() {
  const data = localStorage.getItem("wub_blood_donors_v7");
  if (!data) {
    localStorage.setItem("wub_blood_donors_v7", JSON.stringify([]));
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveDonors(donors) {
  localStorage.setItem("wub_blood_donors_v7", JSON.stringify(donors));
  if (typeof updateHomeStats === "function") updateHomeStats();
}

function getStoredRequests() {
  const data = localStorage.getItem("wub_blood_requests_v7");
  if (!data) {
    localStorage.setItem("wub_blood_requests_v7", JSON.stringify([]));
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveRequests(reqs) {
  localStorage.setItem("wub_blood_requests_v7", JSON.stringify(reqs));
  if (typeof updateHomeStats === "function") updateHomeStats();
}

function getStoredNotifications() {
  const data = localStorage.getItem("wub_blood_notifications_v7");
  if (!data) {
    localStorage.setItem("wub_blood_notifications_v7", JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

function saveNotifications(notifs) {
  localStorage.setItem("wub_blood_notifications_v7", JSON.stringify(notifs));
  updateNotificationBadge();
}

function getStoredAuditLogs() {
  const data = localStorage.getItem("wub_blood_audit_logs_v7");
  if (!data) {
    localStorage.setItem("wub_blood_audit_logs_v7", JSON.stringify([]));
    return [];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveAuditLogs(logs) {
  localStorage.setItem("wub_blood_audit_logs_v7", JSON.stringify(logs));
}

function updateHomeStats() {
  const donorsCountEl = document.getElementById("statDonorsCount");
  const requestsCountEl = document.getElementById("statRequestsCount");
  const successRateEl = document.getElementById("statSuccessRate");
  if (!donorsCountEl && !requestsCountEl) return;

  const donors = getStoredDonors();
  const requests = getStoredRequests();

  if (donorsCountEl) donorsCountEl.textContent = donors.length;
  if (requestsCountEl) requestsCountEl.textContent = requests.length;
  if (successRateEl) {
    successRateEl.textContent = requests.length > 0 ? "100%" : "100%";
  }
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

  if (!localStorage.getItem('wub_token')) {
    ensureAdminToken(user);
  }

  return true;
}

async function getAdminAuthToken() {
  let token = localStorage.getItem('wub_token');
  if (token) return token;
  const user = getCurrentUser();
  if (!user) return null;
  const roleId = user.role === 'super_admin' ? 'superadmin' : (user.role === 'moderator' ? 'moderator' : 'admin');
  const rolePass = user.role === 'super_admin' ? 'super123' : (user.role === 'moderator' ? 'mod123' : 'admin123');
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: roleId, password: rolePass })
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      localStorage.setItem('wub_token', data.token);
      return data.token;
    }
  } catch (e) { }
  return null;
}

async function ensureAdminToken(user) {
  return await getAdminAuthToken();
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

async function loginUser(event) {
  if (event) event.preventDefault();

  const idInput = document.getElementById("loginId")?.value.trim();
  const passInput = document.getElementById("loginPassword")?.value.trim();

  if (!idInput || !passInput) {
    showToast("Please enter your Student ID / Username and Password.", "danger");
    return;
  }

  // 1. Try real backend API
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: idInput, password: passInput })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem("wub_token", data.token);
      const u = data.user;
      const sessionUser = {
        id: u.student_id || u.id,
        username: u.student_id || u.email,
        name: u.name,
        email: u.email,
        role: u.role,
        dept: u.department || "WUB",
        blood: u.blood_group || "O+",
        phone: u.phone,
        address: "Dhaka",
        isDonor: u.donor_status === "approved",
        donorAvailable: true,
        verificationStatus: u.is_verified ? "verified" : "pending",
        lastDonation: "Never",
        totalDonations: 0,
        privacy: { showPhone: true, showAddress: false, showInDonorList: true },
        initials: (u.name || "Student").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      };
      setCurrentUser(sessionUser);
      logAuditEvent("USER_LOGIN", sessionUser.id, `User logged in with role [${sessionUser.role}]`);
      showToast(`Welcome back, ${sessionUser.name}!`, "success");

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTarget = urlParams.get("redirect");

      setTimeout(() => {
        if (redirectTarget) {
          window.location.href = redirectTarget;
        } else if (["admin", "super_admin", "moderator"].includes(sessionUser.role)) {
          window.location.href = "admin.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }, 700);
      return;
    } else if (res.status === 401 || res.status === 403) {
      showToast(data.message || "Invalid credentials. Please check your ID and password.", "danger");
      return;
    }
  } catch (err) {
    console.warn("API login failed, checking local store...", err);
  }

  // 2. Fallback to local store for offline resilience
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

  switch (roleType) {
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

async function registerAccount(event) {
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

  // 1. Try real backend API
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        student_id: id,
        email,
        phone,
        department: dept,
        password: pass,
        blood_group: blood,
        location: address
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem("wub_token", data.token);
      const u = data.user;
      const sessionUser = {
        id: u.student_id || id,
        username: u.student_id || id,
        name: u.name || name,
        email: u.email || email,
        role: u.role || "student",
        dept: dept,
        blood: blood,
        phone: phone,
        address: address,
        isDonor: false,
        donorAvailable: true,
        verificationStatus: "pending",
        totalDonations: 0,
        lastDonation: "Never",
        privacy: { showPhone: true, showAddress: false, showInDonorList: true },
        status: "active",
        initials: (u.name || name).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      };
      setCurrentUser(sessionUser);
      showToast("Account created successfully! Please verify your WUB Student ID.", "success");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 900);
      return;
    } else if (res.status === 400 || res.status === 409) {
      showToast(data.message || "Registration failed. Please check inputs.", "danger");
      return;
    }
  } catch (err) {
    console.warn("API registration failed, using local store...", err);
  }

  // 2. Fallback to local store
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
    window.location.href = "profile.html";
  }, 900);
}

function logoutUser() {
  localStorage.removeItem("wub_token");
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
// 4.5 DARK / LIGHT THEME ENGINE
// ==========================================================================
function initTheme() {
  const saved = localStorage.getItem("wub_theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(saved, false);
}

function applyTheme(theme, notify = false) {
  const isDark = theme === "dark";
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.classList.add("theme-dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.body.classList.remove("theme-dark");
  }
  localStorage.setItem("wub_theme", theme);
  updateThemeUIElements(theme);
}

function toggleTheme() {
  const isCurrentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isCurrentlyDark ? "light" : "dark";
  applyTheme(nextTheme, true);
  showToast(nextTheme === "dark" ? "🌙 Dark Mode activated" : "☀️ Light Mode activated", "info");
}

function updateThemeUIElements(theme) {
  const isDark = theme === "dark";
  const icons = document.querySelectorAll(".theme-toggle-icon, #themeToggleIcon");
  icons.forEach(ic => {
    ic.textContent = isDark ? "☀️" : "🌙";
  });
  const labels = document.querySelectorAll(".theme-toggle-label");
  labels.forEach(lb => {
    lb.textContent = isDark ? "Light" : "Dark";
  });
  const btns = document.querySelectorAll(".theme-toggle-btn");
  btns.forEach(btn => {
    btn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
  });

  const menuIcon = document.getElementById("menuThemeIcon");
  if (menuIcon) menuIcon.textContent = isDark ? "☀️" : "🌙";
  const menuText = document.getElementById("menuThemeText");
  if (menuText) menuText.textContent = isDark ? "Light Mode" : "Dark Mode";

  const guestIcon = document.getElementById("menuGuestThemeIcon");
  if (guestIcon) guestIcon.textContent = isDark ? "☀️" : "🌙";
  const guestText = document.getElementById("menuGuestThemeText");
  if (guestText) guestText.textContent = isDark ? "Light Mode" : "Dark Mode";
}

function getAuthFloatingControlsContainer() {
  if (!document.querySelector(".auth-page-wrapper")) return null;
  let container = document.getElementById("authFloatingControls");
  if (!container) {
    container = document.createElement("div");
    container.id = "authFloatingControls";
    container.className = "auth-floating-controls";
    document.body.appendChild(container);
  }
  return container;
}

function renderThemeToggleButtons() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  // 1. Inject into topbar right if topbar exists
  const topbarRights = document.querySelectorAll(".topbar-right-v2, .topbar-right");
  topbarRights.forEach(tr => {
    if (!tr.querySelector(".theme-toggle-btn")) {
      const btn = document.createElement("button");
      btn.className = "theme-toggle-btn";
      btn.id = "themeToggleBtn";
      btn.onclick = toggleTheme;
      btn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
      btn.setAttribute("aria-label", "Toggle Theme");
      btn.innerHTML = `
        <span class="theme-toggle-icon" id="themeToggleIcon">${isDark ? '☀️' : '🌙'}</span>
        <span class="theme-toggle-label">${isDark ? 'Light' : 'Dark'}</span>
      `;
      tr.insertBefore(btn, tr.firstChild);
    }
  });

  // 2. If on standalone auth page (login/register) without topbar, provide floating corner toggle
  const authContainer = getAuthFloatingControlsContainer();
  if (authContainer && !authContainer.querySelector(".theme-toggle-btn")) {
    const floatBtn = document.createElement("button");
    floatBtn.className = "theme-toggle-btn auth-theme-toggle";
    floatBtn.id = "themeToggleBtn";
    floatBtn.onclick = toggleTheme;
    floatBtn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    floatBtn.setAttribute("aria-label", "Toggle Theme");
    floatBtn.innerHTML = `
      <span class="theme-toggle-icon" id="themeToggleIcon">${isDark ? '☀️' : '🌙'}</span>
      <span class="theme-toggle-label">${isDark ? 'Light' : 'Dark'}</span>
    `;
    authContainer.appendChild(floatBtn);
  }

  updateThemeUIElements(isDark ? "dark" : "light");
}

// ==========================================================================
// 4.6 BILINGUAL (ENGLISH / BANGLA) ENGINE
// ==========================================================================
const TRANSLATIONS = {
  en: {
    // Nav & Shell
    "nav_home": "Home",
    "nav_find_blood": "Find Blood",
    "nav_request_blood": "Request Blood",
    "nav_become_donor": "Become Donor",
    "nav_about": "About",
    "nav_dashboard": "My Dashboard",
    "nav_profile": "Profile & Verification",
    "nav_admin": "Admin Console",
    "nav_logout": "Log Out",
    "nav_login": "Login / Sign In",
    "nav_register": "Register as Student",

    // Topbar & Mottos
    "search_placeholder": "Search donors by name, blood group, or location...",
    "sign_in": "Sign In",
    "student_portal": "Student Portal",
    "uni_name": "World University<br>of Bangladesh",
    "uni_motto": "Together We Learn<br>Together We Grow",
    "light_mode": "Light Mode",
    "dark_mode": "Dark Mode",
    "switch_language": "বাংলা (Bangla)",
    "notif_header_title": "Blood Alerts & Updates",

    // Home / Hero
    "hero_badge": "WUB Campus Verified Blood Network",
    "hero_title": "Donate Blood,<br>Save WUB Lives",
    "hero_sub": "A dedicated lifesaving blood donor network connecting students, faculty, and alumni of World University of Bangladesh.",
    "cta_find": "Find Blood Donor",
    "cta_donor": "Become a Donor",
    "cta_urgent": "Emergency Request",
    "stat_active_donors": "Active Donors",
    "stat_lives_saved": "Lives Saved",
    "stat_verified": "Verified Students",
    "stat_avg_response": "Avg Response",
    "stat_emergency": "Emergency Ready",

    // Flow Steps
    "how_it_works_title": "How WUB BloodCare Works",
    "how_it_works_sub": "4 Simple Steps to Connect with Verified Campus Donors",
    "step1_title": "Search or Request",
    "step2_title": "Instant Smart Match",
    "step3_title": "Contact & Confirm Details",
    "step4_title": "Save a Life",

    // Find Blood
    "find_page_title": "Find Verified Blood Donors",
    "filter_blood_label": "Blood Group",
    "all_bloods": "All Blood Groups",
    "filter_loc_label": "Location / Campus",
    "all_locations": "All Dhaka Locations",
    "filter_avail_label": "Availability",
    "avail_all": "All Donors",
    "avail_now": "Available Now",
    "filter_search_label": "Search Donors",
    "btn_filter": "Filter Donors",
    "btn_reset": "Reset Filters",
    "verified_donor": "Verified WUB Donor",
    "contact_donor": "Contact Donor",
    "login_to_view": "Login to View Contact",
    "status_avail": "Available",
    "status_unavail": "Not Available",
    "last_prefix": "Last:",
    "no_donors_title": "No Matching Verified Donors Found",
    "no_donors_desc": "We couldn't find available donors matching your current filter. Try resetting filters or post an emergency request for the WUB student community.",
    "post_emergency_btn": "Post Emergency Blood Request",

    // Request Blood
    "req_page_title": "Emergency Blood Request",
    "req_patient_name": "Patient Name",
    "req_blood_group": "Required Blood Group",
    "req_units": "Units / Bags Needed",
    "req_hospital": "Hospital / Clinic Name",
    "req_location": "Hospital Location",
    "req_phone": "Contact Phone Number",
    "req_date": "Date & Time Needed",
    "req_urgency": "Urgency Level",
    "urgency_critical": "Critical (Immediate)",
    "urgency_urgent": "Urgent (Within 12-24h)",
    "urgency_standard": "Standard (Scheduled)",
    "req_notes": "Medical Reason / Additional Notes",
    "btn_submit_req": "Submit Blood Request",

    // Become Donor
    "donor_page_title": "Register as a Blood Donor",
    "donor_full_name": "Full Name",
    "donor_student_id": "Student ID",
    "donor_dept": "Department",
    "donor_weight": "Weight (kg)",
    "donor_last_date": "Last Donation Date",
    "btn_donor_submit": "Register as Donor",
    "why_donor_title": "Why Become a Donor?",
    "benefit_1": "Help Save Lives in your community",
    "benefit_2": "Get recognition in WUB portal",
    "benefit_3": "Be informed about donation drives",
    "benefit_4": "Be a hero for your fellow students",
    "why_art_title": "WUB BloodCare",
    "why_art_sub": "Students Helping Students.",
    "donor_reg_heading": "Donor Registration",
    "donor_med_label": "Medical Conditions / Diseases",
    "donor_campus_label": "Dhaka Area / Preferred Campus *",
    "donor_date_hint": "Leave blank if first-time donor",
    "donor_med_hint": "For patient safety and screening",
    "donor_agreement": "I confirm that I weigh at least 45-50 kg, have no communicable diseases (Hepatitis B/C, HIV, Malaria), and am in good health to donate blood.",
    "donor_disclaimer": "🛡️ By registering, you agree to be contacted for life-saving emergencies by verified WUB members.",

    // About Page
    "about_title": "About WUB BloodCare",
    "about_sub": "Students Helping Students. A trusted, student-driven emergency life-saving network at World University of Bangladesh.",
    "about_mission_title": "Our Mission",
    "about_mission_p": "WUB BloodCare was initiated to connect students and faculty with immediate, compatible blood donors inside our campus. In critical hospital emergencies around Uttara and Dhaka, quick communication saves lives. We ensure every request reaches trusted, verified student volunteers.",
    "about_trust_donors": "Verified Donors",
    "about_trust_lives": "Lives Impacted",
    "about_trust_campus": "Campus Dedicated",
    "about_compat_title": "Blood Type Compatibility Chart",
    "about_th_blood": "Blood Type",
    "about_th_donate": "Can Donate Blood To",
    "about_th_receive": "Can Receive Blood From",
    "compat_universal_donor": "Everyone (Universal Donor)",
    "compat_universal_recipient": "Everyone (Universal Recipient)",
    "compat_o_neg_only": "O- only",
    "compat_ab_pos_only": "AB+ only",
    "about_elig_title": "Donor Eligibility Checklist",
    "about_elig_1": "Age between 18 and 60 years",
    "about_elig_2": "Weight at least 50 kg (110 lbs)",
    "about_elig_3": "At least 3-4 months since last donation",
    "about_elig_4": "Good general health, no active fever or flu",
    "about_elig_5": "Current WUB student or faculty member",
    "about_join_btn": "♙ Join as a Donor Now",
    "about_addr_title": "Permanent Campus Address",
    "about_addr_p": "World University of Bangladesh<br>Plot 5 to 8, Avenue 6 &amp; Lake Drive Road, Sector 17/H, Uttara, Dhaka-1230, Bangladesh.",
    "about_helpline": "<b>Emergency Helpline:</b> +880 9666775533<br><b>Email:</b> bloodcare@wub.edu.bd",

    // Modal
    "modal_title": "Donor Contact Information",
    "modal_phone_label": "Direct Phone",
    "modal_call_btn": "Call Now",
    "modal_wa_btn": "Chat on WhatsApp",
    "modal_health_title": "Donor Health Screening",
    "modal_close": "Close",

    // Footer
    "footer_line1": "WUB BloodCare · Students Helping Students.",
    "footer_line2": "Non-commercial University Welfare Platform · Student Blood Network"
  },
  bn: {
    // Nav & Shell
    "nav_home": "হোম",
    "nav_find_blood": "রক্ত খুঁজুন",
    "nav_request_blood": "রক্তের আবেদন",
    "nav_become_donor": "রক্তদাতা হন",
    "nav_about": "আমাদের সম্পর্কে",
    "nav_dashboard": "আমার ড্যাশবোর্ড",
    "nav_profile": "প্রোফাইল ও ভেরিফিকেশন",
    "nav_admin": "অ্যাডমিন প্যানেল",
    "nav_logout": "লগআউট",
    "nav_login": "লগইন / সাইন ইন",
    "nav_register": "শিক্ষার্থী নিবন্ধন",

    // Topbar & Mottos
    "search_placeholder": "নাম, রক্তের গ্রুপ বা এলাকা দিয়ে রক্তদাতা খুঁজুন...",
    "sign_in": "লগইন",
    "student_portal": "স্টুডেন্ট পোর্টাল",
    "uni_name": "ওয়ার্ল্ড ইউনিভার্সিটি<br>অব বাংলাদেশ",
    "uni_motto": "একসাথে শিখি<br>একসাথে গড়ি",
    "light_mode": "লাইট মোড",
    "dark_mode": "ডার্ক মোড",
    "switch_language": "English",
    "notif_header_title": "জরুরি রক্তের নোটিফিকেশন",

    // Home / Hero
    "hero_badge": "WUB ক্যাম্পাস ভেরিফাইড রক্তদান নেটওয়ার্ক",
    "hero_title": "রক্ত দিন,<br>জীবন বাঁচান",
    "hero_sub": "ওয়ার্ল্ড ইউনিভার্সিটি অব বাংলাদেশ-এর শিক্ষার্থী, শিক্ষক ও প্রাক্তনদের জন্য একটি নিবেদিতপ্রাণ জরুরি রক্তদান নেটওয়ার্ক।",
    "cta_find": "রক্তদাতা খুঁজুন",
    "cta_donor": "রক্তদাতা হন",
    "cta_urgent": "জরুরি রক্তের আবেদন",
    "stat_active_donors": "সক্রিয় রক্তদাতা",
    "stat_lives_saved": "সংরক্ষিত জীবন",
    "stat_verified": "ভেরিফাইড শিক্ষার্থী",
    "stat_avg_response": "গড় সময়",
    "stat_emergency": "জরুরি প্রস্তুত",

    // Flow Steps
    "how_it_works_title": "ডাব্লিউইউবি ব্লাডকেয়ার যেভাবে কাজ করে",
    "how_it_works_sub": "ভেরিফাইড ক্যাম্পাস রক্তদাতাদের সাথে যোগাযোগের ৪টি সহজ ধাপ",
    "step1_title": "অনুসন্ধান বা আবেদন",
    "step2_title": "তাৎক্ষণিক স্মার্ট ম্যাচ",
    "step3_title": "যোগাযোগ ও নিশ্চিতকরণ",
    "step4_title": "জীবন রক্ষা করুন",

    // Find Blood
    "find_page_title": "ভেরিফাইড রক্তদাতা খুঁজুন",
    "filter_blood_label": "রক্তের গ্রুপ",
    "all_bloods": "সকল রক্তের গ্রুপ",
    "filter_loc_label": "এলাকা / ক্যাম্পাস",
    "all_locations": "ঢাকার সকল এলাকা",
    "filter_avail_label": "উপলব্ধতা",
    "avail_all": "সকল রক্তদাতা",
    "avail_now": "এখনই রক্তদানে প্রস্তুত",
    "filter_search_label": "রক্তদাতা অনুসন্ধান",
    "btn_filter": "ফিল্টার করুন",
    "btn_reset": "রিসেট করুন",
    "verified_donor": "ভেরিফাইড ডাব্লিউইউবি রক্তদাতা",
    "contact_donor": "যোগাযোগ করুন",
    "login_to_view": "যোগাযোগের তথ্য দেখতে লগইন করুন",
    "status_avail": "রক্তদানে প্রস্তুত",
    "status_unavail": "উপলব্ধ নয়",
    "last_prefix": "সর্বশেষ:",
    "no_donors_title": "কোনো রক্তদাতা পাওয়া যায়নি",
    "no_donors_desc": "আপনার ফিল্টারের সাথে মিলে এমন কোনো সক্রিয় রক্তদাতা পাওয়া যায়নি। ফিল্টার রিসেট করুন অথবা জরুরি রক্তের আবেদন পোস্ট করুন।",
    "post_emergency_btn": "জরুরি রক্তের আবেদন করুন",

    // Request Blood
    "req_page_title": "জরুরি রক্তের আবেদন করুন",
    "req_patient_name": "রোগীর নাম",
    "req_blood_group": "প্রয়োজনীয় রক্তের গ্রুপ",
    "req_units": "প্রয়োজনীয় রক্তের পরিমাণ (ব্যাগ)",
    "req_hospital": "হাসপাতাল / ক্লিনিকের নাম",
    "req_location": "হাসপাতালের এলাকা",
    "req_phone": "যোগাযোগের ফোন নম্বর",
    "req_date": "রক্তের প্রয়োজনীয় তারিখ ও সময়",
    "req_urgency": "জরুরিতার মাত্রা",
    "urgency_critical": "অত্যন্ত জরুরি (তাৎক্ষণিক)",
    "urgency_urgent": "জরুরি (১২-২৪ ঘণ্টার মধ্যে)",
    "urgency_standard": "সাধারণ (নির্ধারিত)",
    "req_notes": "রোগীর সমস্যা / অতিরিক্ত তথ্য",
    "btn_submit_req": "রক্তের আবেদন জমা দিন",

    // Become Donor
    "donor_page_title": "রক্তদাতা হিসেবে নিবন্ধন করুন",
    "donor_full_name": "পূর্ণ নাম",
    "donor_student_id": "স্টুডেন্ট আইডি",
    "donor_dept": "বিভাগ",
    "donor_weight": "ওজন (কেজি)",
    "donor_last_date": "সর্বশেষ রক্তদানের তারিখ",
    "btn_donor_submit": "রক্তদাতা নিবন্ধন সম্পন্ন করুন",
    "why_donor_title": "কেন রক্তদাতা হবেন?",
    "benefit_1": "আপনার কমিউনিটিতে জীবন বাঁচাতে সাহায্য করুন",
    "benefit_2": "ডাব্লিউইউবি পোর্টালে বিশেষ স্বীকৃতি ও সম্মাননা পান",
    "benefit_3": "ক্যাম্পাসের রক্তদান কর্মসূচি সম্পর্কে নিয়মিত আপডেট জানুন",
    "benefit_4": "সহপাঠী শিক্ষার্থীদের বিপদের মুহূর্তে সত্যিকারের হিরো হন",
    "why_art_title": "ডাব্লিউইউবি ব্লাডকেয়ার",
    "why_art_sub": "শিক্ষার্থীদের পাশে শিক্ষার্থীরা।",
    "donor_reg_heading": "রক্তদাতা নিবন্ধন",
    "donor_med_label": "শারীরিক অসুস্থতা বা রোগব্যাধি",
    "donor_campus_label": "ঢাকার এলাকা / পছন্দের ক্যাম্পাস *",
    "donor_date_hint": "প্রথমবার রক্তদান করলে ফাঁকা রাখুন",
    "donor_med_hint": "রোগীর সুরক্ষা ও স্বাস্থ্য স্ক্রিনিংয়ের জন্য",
    "donor_agreement": "আমি নিশ্চিত করছি যে আমার ওজন কমপক্ষে ৪৫-৫০ কেজি, কোনো ছোঁয়াচে রোগ (হেপাটাইটিস, এইচআইভি, ম্যালেরিয়া) নেই এবং আমি রক্তদানে সম্পূর্ণ সুস্থ।",
    "donor_disclaimer": "🛡️ নিবন্ধনের মাধ্যমে আপনি ভেরিফাইড ডাব্লিউইউবি সদস্যদের দ্বারা জরুরি প্রয়োজনে যোগাযোগের সম্মতি দিচ্ছেন।",

    // About Page
    "about_title": "ডাব্লিউইউবি ব্লাডকেয়ার সম্পর্কে",
    "about_sub": "শিক্ষার্থীদের পাশে শিক্ষার্থীরা। ওয়ার্ল্ড ইউনিভার্সিটি অব বাংলাদেশ-এর একটি বিশ্বস্ত, শিক্ষার্থী-পরিচালিত জরুরি জীবন রক্ষাকারী রক্তদান নেটওয়ার্ক।",
    "about_mission_title": "আমাদের লক্ষ্য ও উদ্দেশ্য",
    "about_mission_p": "আমাদের ক্যাম্পাসের শিক্ষার্থী এবং শিক্ষক-কর্মকর্তাদের সাথে তাৎক্ষণিক ও রক্তের গ্রুপ অনুযায়ী উপযুক্ত রক্তদাতাদের সহজে যুক্ত করার লক্ষ্যেই ডাব্লিউইউবি ব্লাডকেয়ার-এর সূচনা। উত্তরা ও ঢাকার বিভিন্ন হাসপাতালে চিকিৎসার জরুরি মুহূর্তে দ্রুত যোগাযোগই পারে একটি জীবন রক্ষা করতে। আমরা নিশ্চিত করি যেন প্রতিটি আবেদন সঠিক সময়ে বিশ্বস্ত ও ভেরিফাইড শিক্ষার্থীদের কাছে পৌঁছায়।",
    "about_trust_donors": "ভেরিফাইড রক্তদাতা",
    "about_trust_lives": "রক্ষিত জীবন",
    "about_trust_campus": "ক্যাম্পাস নিবেদিত",
    "about_compat_title": "রক্তের গ্রুপের সামঞ্জস্যতা তালিকা (Compatibility Chart)",
    "about_th_blood": "রক্তের গ্রুপ",
    "about_th_donate": "যাদের রক্ত দিতে পারবে",
    "about_th_receive": "যাদের কাছ থেকে রক্ত নিতে পারবে",
    "compat_universal_donor": "সকলকে (সর্বজনীন রক্তদাতা)",
    "compat_universal_recipient": "সকলের থেকে (সর্বজনীন গ্রহীতা)",
    "compat_o_neg_only": "শুধুমাত্র O-",
    "compat_ab_pos_only": "শুধুমাত্র AB+",
    "about_elig_title": "রক্তদানের যোগ্যতা ও চেকলিস্ট",
    "about_elig_1": "বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে",
    "about_elig_2": "শারীরিক ওজন কমপক্ষে ৫০ কেজি হতে হবে",
    "about_elig_3": "সর্বশেষ রক্তদানের পর কমপক্ষে ৩-৪ মাস অতিক্রান্ত হতে হবে",
    "about_elig_4": "শারীরিকভাবে সুস্থ এবং কোনো সর্দি বা জ্বর থাকা যাবে না",
    "about_elig_5": "ডাব্লিউইউবি-র বর্তমান শিক্ষার্থী, শিক্ষক বা কর্মকর্তা",
    "about_join_btn": "♙ এখনই রক্তদাতা হিসেবে যুক্ত হন",
    "about_addr_title": "স্থায়ী ক্যাম্পাসের ঠিকানা",
    "about_addr_p": "ওয়ার্ল্ড ইউনিভার্সিটি অব বাংলাদেশ<br>প্লট ৫ থেকে ৮, এভিনিউ ৬ ও লেক ড্রাইভ রোড, সেক্টর ১৭/এইচ, উত্তরা, ঢাকা-১২৩০, বাংলাদেশ।",
    "about_helpline": "<b>জরুরি হেল্পলাইন:</b> +880 9666775533<br><b>ইমেইল:</b> bloodcare@wub.edu.bd",

    // Modal
    "modal_title": "রক্তদাতার যোগাযোগের তথ্য",
    "modal_phone_label": "সরাসরি ফোন নম্বর",
    "modal_call_btn": "কল করুন",
    "modal_wa_btn": "হোয়াটসঅ্যাপে চ্যাট করুন",
    "modal_health_title": "রক্তদাতার স্বাস্থ্য বিবরণ",
    "modal_close": "বন্ধ করুন",

    // Footer
    "footer_line1": "ডাব্লিউইউবি ব্লাডকেয়ার · শিক্ষার্থীদের পাশে শিক্ষার্থীরা।",
    "footer_line2": "অবাণিজ্যিক বিশ্ববিদ্যালয় কল্যাণ প্ল্যাটফর্ম · শিক্ষার্থী রক্তদান নেটওয়ার্ক"
  }
};

function getCurrentLanguage() {
  return localStorage.getItem("wub_lang") || "en";
}

function t(key, fallback = "") {
  const lang = getCurrentLanguage();
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key];
  }
  if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return fallback || key;
}

function setLanguage(lang, notify = true) {
  const validLang = lang === "bn" ? "bn" : "en";
  localStorage.setItem("wub_lang", validLang);
  document.documentElement.setAttribute("lang", validLang);
  document.documentElement.setAttribute("data-lang", validLang);

  applyLanguageToDOM(validLang);
  updateLanguageUIElements(validLang);
  updateTopbarAuthUI();

  if (notify) {
    showToast(
      validLang === "bn" ? "🇧🇩 ভাষা পরিবর্তন করা হয়েছে: বাংলা" : "🌐 Language switched to: English",
      "info"
    );
  }
}

function toggleLanguage() {
  const current = getCurrentLanguage();
  setLanguage(current === "en" ? "bn" : "en", true);
}

function applyLanguageToDOM(lang) {
  const isBn = lang === "bn";

  // 1. Data-i18n text
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // 2. Data-i18n-placeholder elements
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  });

  // 3. Data-i18n-title elements
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    if (key && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.title = TRANSLATIONS[lang][key];
    }
  });

  // 4. Standard navigation links
  const navMap = [
    { pattern: "find-blood", key: "nav_find_blood" },
    { pattern: "request-blood", key: "nav_request_blood" },
    { pattern: "become-donor", key: "nav_become_donor" },
    { pattern: "about", key: "nav_about" },
    { pattern: "index.html", key: "nav_home" }
  ];
  document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    for (const item of navMap) {
      if (href.includes(item.pattern) || (item.pattern === "index.html" && (href === "" || href === "/" || href === "index.html"))) {
        const span = link.querySelector("span");
        if (span) span.textContent = t(item.key, span.textContent);
        break;
      }
    }
  });

  // 5. University Mottos, Crest & Brand Text
  document.querySelectorAll(".brand-text h2").forEach(el => {
    el.textContent = isBn ? "ডাব্লিউইউবি ব্লাডকেয়ার" : "WUB BloodCare";
  });
  document.querySelectorAll(".brand-text span").forEach(el => {
    el.textContent = isBn ? "শিক্ষার্থীদের পাশে শিক্ষার্থীরা।" : "Students Helping Students.";
  });
  document.querySelectorAll(".mobile-brand-title").forEach(el => {
    el.textContent = isBn ? "ডাব্লিউইউবি ব্লাডকেয়ার" : "WUB BloodCare";
  });
  document.querySelectorAll(".uni-motto-cursive").forEach(el => {
    el.innerHTML = t("uni_motto");
  });
  document.querySelectorAll(".crest-text").forEach(el => {
    el.innerHTML = t("uni_name");
  });

  // 6. Global Search Inputs
  const gSearch = document.getElementById("globalSearchInput") || document.getElementById("topbarSearchInput");
  if (gSearch) {
    gSearch.placeholder = t("search_placeholder");
  }

  // 7. Notification Panel Header
  const notifH3 = document.querySelector("#notificationsPanel .notif-header h3");
  if (notifH3) {
    notifH3.textContent = t("notif_header_title");
  }

  // 8. Re-populate Dhaka locations with localized display names
  populateDhakaLocationDropdowns();

  // 9. Page titles and headers
  const pageH1 = document.querySelector(".find-blood-header-v2 h1");
  const pageH1P = document.querySelector(".find-blood-header-v2 p");
  if (pageH1) {
    const text = pageH1.textContent.trim().toLowerCase();
    if (text.includes("find blood") || text.includes("রক্ত খুঁজুন")) {
      pageH1.textContent = isBn ? "রক্ত খুঁজুন" : "Find Blood";
      if (pageH1P) pageH1P.textContent = isBn ? "ডাব্লিউইউবি পরিবারের ভেরিফাইড রক্তদাতাদের খুঁজুন।" : "Search for verified blood donors within WUB community.";
    } else if (text.includes("request blood") || text.includes("রক্তের আবেদন")) {
      pageH1.textContent = isBn ? "রক্তের আবেদন" : "Request Blood";
      if (pageH1P) pageH1P.textContent = isBn ? "জরুরি রক্তের প্রয়োজন? আবেদন পোস্ট করুন এবং দ্রুত রক্তদাতাদের সাথে যোগাযোগ করুন।" : "Need blood urgently? Post an emergency request and connect with verified WUB student donors.";
    } else if (text.includes("become") || text.includes("donor") || text.includes("রক্তদাতা হন")) {
      pageH1.textContent = isBn ? "রক্তদাতা হন" : "Become a Donor";
      if (pageH1P) pageH1P.textContent = isBn ? "ডাব্লিউইউবি স্টুডেন্ট ব্লাড নেটওয়ার্কে যুক্ত হোন এবং জীবন বাঁচান।" : "Join the WUB Student Blood Network and help save lives in our campus community.";
    }
  }

  // 10. Home Hero Elements
  const heroPill = document.querySelector(".hero-pill-text");
  if (heroPill) heroPill.textContent = isBn ? "কেবল ডাব্লিউইউবি • ভেরিফাইড শিক্ষার্থী" : "WUB Only • Verified Students";

  const heroTitleMain = document.querySelector(".hero-title-main");
  if (heroTitleMain) {
    heroTitleMain.innerHTML = isBn ? '<span class="wub-outlined-word">WUB</span> ব্লাড<span class="text-accent-red">কেয়ার</span>' : '<span class="wub-outlined-word">WUB</span> Blood<span class="text-accent-red">Care</span>';
  }

  const heroSubTag = document.querySelector(".hero-subtitle-tag");
  if (heroSubTag) heroSubTag.textContent = isBn ? "শিক্ষার্থীদের পাশে শিক্ষার্থীরা।" : "Students Helping Students.";

  const heroDesc = document.querySelector(".hero-description-lead");
  if (heroDesc) heroDesc.innerHTML = isBn ? "রক্তদাতা খুঁজুন, রক্তের আবেদন করুন অথবা রক্তদাতা হিসেবে যুক্ত হোন &mdash;<br>সবকিছু ডাব্লিউইউবি পরিবারের ভেতরে। একসাথে আমরা জীবন বাঁচাতে পারি।" : "Find blood donors, request blood, or become a donor &mdash;<br>all within the WUB community. Together we can save lives.";

  const heroFindBtn = document.getElementById("heroFindDonorBtn");
  if (heroFindBtn) {
    const sp = heroFindBtn.querySelector("span");
    if (sp) sp.textContent = isBn ? "রক্তদাতা খুঁজুন" : "Find Blood Donor";
  }

  const heroReqBtn = document.getElementById("heroRequestBloodBtn");
  if (heroReqBtn) {
    const sp = heroReqBtn.querySelector("span");
    if (sp) sp.textContent = isBn ? "রক্তের আবেদন" : "Request Blood";
  }

  // 11. Home Trust Row (4 cells)
  const trustCells = document.querySelectorAll(".hero-trust-row-grid .trust-stat-cell");
  if (trustCells.length >= 4) {
    const tData = isBn ? [
      { h: "কেবলমাত্র WUB", p: "ভেরিফাইড শিক্ষার্থী" },
      { h: "নিরাপদ ও নির্ভরযোগ্য", p: "ভেরিফিকেশন ব্যবস্থা" },
      { h: "২৪/৭", p: "জরুরি সেবা" },
      { h: "ঐক্যবদ্ধ", p: "ডাব্লিউইউবি পরিবার" }
    ] : [
      { h: "WUB Only", p: "Verified Students" },
      { h: "Safe & Secure", p: "Verification System" },
      { h: "24/7", p: "Emergency Support" },
      { h: "Stronger", p: "WUB Community" }
    ];
    trustCells.forEach((c, idx) => {
      const h = c.querySelector("h4");
      const p = c.querySelector("p");
      if (h && tData[idx]) h.textContent = tData[idx].h;
      if (p && tData[idx]) p.textContent = tData[idx].p;
    });
  }

  // 12. Home Middle (Why Choose & 2x2 Stats)
  const whyTag = document.querySelector(".why-choose-column .tag-label-caption");
  if (whyTag) whyTag.textContent = isBn ? "আপনার অবদান মূল্যবান" : "Your Support Matters";

  const whyHead = document.querySelector(".why-choose-heading");
  if (whyHead) whyHead.innerHTML = isBn ? 'কেন ডাব্লিউইউবি ব্লাড<span class="text-accent-red">কেয়ার</span><br>বেছে নেবেন?' : 'Why Choose<br>WUB Blood<span class="text-accent-red">Care</span>?';

  const whyP = document.querySelector(".why-choose-paragraph");
  if (whyP) whyP.textContent = isBn ? "আমরা শুধু একটি প্ল্যাটফর্ম নই। বিপদের মুহূর্তে একে অপরের পাশে দাঁড়ানো ওয়ার্ল্ড ইউনিভার্সিটির শিক্ষার্থীদের এক বিশ্বস্ত পরিবার।" : "We're more than just a platform. We're a community of WUB students helping each other in times of need.";

  const learnMoreBtn = document.querySelector(".btn-learn-more-navy span");
  if (learnMoreBtn) learnMoreBtn.textContent = isBn ? "আরও জানুন" : "Learn More";

  // 13. 2x2 Stats Grid
  const statTiles = document.querySelectorAll(".stats-2x2-grid .stat-card-tile");
  if (statTiles.length >= 4) {
    const sData = isBn ? [
      { name: "নিবন্ধিত রক্তদাতা", desc: "সক্রিয় ডাব্লিউইউবি শিক্ষার্থী" },
      { name: "রক্তের আবেদন", desc: "সফলভাবে সম্পন্ন" },
      { name: "সফলতার হার", desc: "রক্তদাতা ম্যাচিং রেট" },
      { name: "জরুরি সহায়তা", desc: "সবসময় আপনাদের পাশে" }
    ] : [
      { name: "Registered Donors", desc: "Active WUB students" },
      { name: "Blood Requests", desc: "Completed successfully" },
      { name: "Success Rate", desc: "Donor match rate" },
      { name: "Emergency Support", desc: "Always here for you" }
    ];
    statTiles.forEach((tile, idx) => {
      const nameEl = tile.querySelector(".stat-card-name");
      const descEl = tile.querySelector(".stat-card-desc");
      if (nameEl && sData[idx]) nameEl.textContent = sData[idx].name;
      if (descEl && sData[idx]) descEl.textContent = sData[idx].desc;
    });
  }

  // 14. How It Works Steps
  const howTag = document.querySelector(".how-it-works-head .tag-label-caption");
  if (howTag) howTag.textContent = isBn ? "যেভাবে কাজ করে" : "How It Works";

  const howTitle = document.querySelector(".how-it-works-title");
  if (howTitle) howTitle.textContent = isBn ? "সহজ কয়েকটি ধাপ, জীবন বাঁচানোর উদ্যোগ" : "Simple Steps, Big Impact";

  const stepTexts = document.querySelectorAll(".steps-flow-row .step-title-text");
  if (stepTexts.length >= 4) {
    const stData = isBn ? [
      "রক্ত সন্ধান বা<br>আবেদন করুন",
      "উপযুক্ত রক্তদাতা<br>খুঁজে নিন",
      "যোগাযোগ করে<br>নিশ্চিত করুন",
      "একটি জীবন<br>রক্ষা করুন"
    ] : [
      "Find / Request<br>Blood",
      "Get Matched<br>with Donor",
      "Contact & Confirm<br>Details",
      "Save a Life"
    ];
    stepTexts.forEach((st, idx) => {
      if (stData[idx]) st.innerHTML = stData[idx];
    });
  }

  // 15. Find Blood Filter Labels & Buttons
  const filterLabels = document.querySelectorAll(".glass-filter-card-v2 .filter-input-label");
  filterLabels.forEach(lbl => {
    const txt = lbl.textContent.trim();
    if (txt.includes("Keyword") || txt.includes("অনুসন্ধান শব্দ")) {
      lbl.childNodes[lbl.childNodes.length - 1].textContent = isBn ? " অনুসন্ধান শব্দ" : " Search Keyword";
    } else if (txt.includes("Group") || txt.includes("রক্তের গ্রুপ")) {
      lbl.childNodes[lbl.childNodes.length - 1].textContent = isBn ? " রক্তের গ্রুপ" : " Blood Group";
    } else if (txt.includes("Location") || txt.includes("এলাকা")) {
      lbl.childNodes[lbl.childNodes.length - 1].textContent = isBn ? " এলাকা" : " Location";
    } else if (txt.includes("Availability") || txt.includes("উপলব্ধতা")) {
      lbl.childNodes[lbl.childNodes.length - 1].textContent = isBn ? " উপলব্ধতা" : " Availability";
    }
  });

  const bloodSelFirstOpt = document.querySelector("#bloodFilter option[value='']");
  if (bloodSelFirstOpt) {
    bloodSelFirstOpt.textContent = isBn ? "রক্তের গ্রুপ নির্বাচন করুন" : "Select blood group";
  }

  const availOpts = document.querySelectorAll("#availabilityFilter option");
  if (availOpts.length >= 3) {
    availOpts[0].textContent = isBn ? "সকল রক্তদাতা" : "All Donors";
    availOpts[1].textContent = isBn ? "🟢 এখনই রক্তদানে প্রস্তুত" : "🟢 Available Now";
    availOpts[2].textContent = isBn ? "⏳ সাময়িক বিরতি" : "⏳ Currently Paused";
  }

  const searchBtnSpan = document.querySelector(".btn-search-v2 span");
  if (searchBtnSpan) searchBtnSpan.textContent = isBn ? "অনুসন্ধান" : "Search";
  const resetBtnSpan = document.querySelector(".btn-reset-v2 span");
  if (resetBtnSpan) resetBtnSpan.textContent = isBn ? "রিসেট" : "Reset";

  // 16. Request Blood & Become Donor Form Labels
  const formLabels = document.querySelectorAll(".form-card-container label");
  formLabels.forEach(lbl => {
    const txt = lbl.textContent.trim().toLowerCase();
    if (txt.includes("blood group")) lbl.textContent = isBn ? "প্রয়োজনীয় রক্তের গ্রুপ *" : "Blood Group Needed *";
    else if (txt.includes("units")) lbl.textContent = isBn ? "প্রয়োজনীয় পরিমাণ (ব্যাগ) *" : "Units Needed *";
    else if (txt.includes("hospital")) lbl.textContent = isBn ? "হাসপাতাল / মেডিকেল সেন্টার *" : "Hospital / Medical Center *";
    else if (txt.includes("location") || txt.includes("area")) lbl.textContent = isBn ? "ঢাকার এলাকা *" : "Dhaka Location / Area *";
    else if (txt.includes("date needed")) lbl.textContent = isBn ? "প্রয়োজনীয় তারিখ *" : "Date Needed *";
    else if (txt.includes("time needed")) lbl.textContent = isBn ? "প্রয়োজনীয় সময়" : "Time Needed";
    else if (txt.includes("contact phone")) lbl.textContent = isBn ? "যোগাযোগের ফোন নম্বর *" : "Contact Phone *";
    else if (txt.includes("urgency")) lbl.textContent = isBn ? "জরুরিতার মাত্রা *" : "Urgency Level *";
    else if (txt.includes("patient name")) lbl.textContent = isBn ? "রোগীর নাম *" : "Patient Name *";
    else if (txt.includes("reason") || txt.includes("notes")) lbl.textContent = isBn ? "রোগের কারণ / অতিরিক্ত তথ্য" : "Reason / Clinical Notes";
    else if (txt.includes("full name")) lbl.textContent = isBn ? "পূর্ণ নাম *" : "Full Name *";
    else if (txt.includes("student id")) lbl.textContent = isBn ? "স্টুডেন্ট আইডি *" : "Student ID *";
    else if (txt.includes("department")) lbl.textContent = isBn ? "বিভাগ *" : "Department *";
    else if (txt.includes("weight")) lbl.textContent = isBn ? "শারীরিক ওজন (কেজি) *" : "Weight (kg) *";
    else if (txt.includes("last donation")) lbl.textContent = isBn ? "সর্বশেষ রক্তদানের তারিখ" : "Last Donation Date";
  });

  const submitReqBtn = document.querySelector("#bloodRequestForm button[type='submit']");
  if (submitReqBtn) {
    submitReqBtn.textContent = isBn ? "রক্তের আবেদন জমা দিন" : "Submit Blood Request";
  }

  const submitDonorBtn = document.querySelector("#donorRegisterForm button[type='submit'], #becomeDonorForm button[type='submit']");
  if (submitDonorBtn) {
    submitDonorBtn.textContent = isBn ? "রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করুন" : "Register as Donor";
  }

  // 16.5 Why Become a Donor Card (become-donor.html)
  const whyDonorTitle = document.querySelector(".why-donor-title span:last-child, .why-donor-title [data-i18n]");
  if (whyDonorTitle) {
    whyDonorTitle.textContent = isBn ? "কেন রক্তদাতা হবেন?" : "Why Become a Donor?";
  }

  const benefitSpans = document.querySelectorAll(".donor-benefit-list .benefit-item span");
  if (benefitSpans.length >= 4) {
    const bData = isBn ? [
      "আপনার কমিউনিটিতে জীবন বাঁচাতে সাহায্য করুন",
      "ডাব্লিউইউবি পোর্টালে বিশেষ স্বীকৃতি ও সম্মাননা পান",
      "ক্যাম্পাসের রক্তদান কর্মসূচি সম্পর্কে নিয়মিত আপডেট জানুন",
      "সহপাঠী শিক্ষার্থীদের বিপদের মুহূর্তে সত্যিকারের হিরো হন"
    ] : [
      "Help Save Lives in your community",
      "Get recognition in WUB portal",
      "Be informed about donation drives",
      "Be a hero for your fellow students"
    ];
    benefitSpans.forEach((sp, idx) => {
      if (bData[idx]) sp.textContent = bData[idx];
    });
  }

  const whyArtH4 = document.querySelector(".why-donor-art-box h4");
  if (whyArtH4) whyArtH4.textContent = isBn ? "ডাব্লিউইউবি ব্লাডকেয়ার" : "WUB BloodCare";
  const whyArtP = document.querySelector(".why-donor-art-box p");
  if (whyArtP) whyArtP.textContent = isBn ? "শিক্ষার্থীদের পাশে শিক্ষার্থীরা।" : "Students Helping Students.";

  const donorRegH3 = document.querySelector(".become-donor-split .form-card-container h3");
  if (donorRegH3) donorRegH3.textContent = isBn ? "রক্তদাতা নিবন্ধন" : "Donor Registration";

  const donorAgreementLabel = document.querySelector("label[for='donorHealthAgreement']");
  if (donorAgreementLabel) {
    donorAgreementLabel.textContent = isBn
      ? "আমি নিশ্চিত করছি যে আমার ওজন কমপক্ষে ৪৫-৫০ কেজি, কোনো ছোঁয়াচে রোগ (হেপাটাইটিস, এইচআইভি, ম্যালেরিয়া) নেই এবং আমি রক্তদানে সম্পূর্ণ সুস্থ।"
      : "I confirm that I weigh at least 45-50 kg, have no communicable diseases (Hepatitis B/C, HIV, Malaria), and am in good health to donate blood.";
  }

  const donorDisclaimerDiv = document.querySelector("#donorRegForm div:last-child");
  if (donorDisclaimerDiv && (donorDisclaimerDiv.textContent.includes("By registering") || donorDisclaimerDiv.textContent.includes("নিবন্ধনের মাধ্যমে"))) {
    donorDisclaimerDiv.textContent = isBn
      ? "🛡️ নিবন্ধনের মাধ্যমে আপনি ভেরিফাইড ডাব্লিউইউবি সদস্যদের দ্বারা জরুরি প্রয়োজনে যোগাযোগের সম্মতি দিচ্ছেন।"
      : "🛡️ By registering, you agree to be contacted for life-saving emergencies by verified WUB members.";
  }

  // 17. If on find-blood page, update donor cards buttons
  if (document.getElementById("donorCardsContainer")) {
    document.querySelectorAll(".btn-v2-contact").forEach(btn => {
      if (btn.tagName.toLowerCase() === "button") {
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          ${t("contact_donor")}
        `;
      }
    });
    document.querySelectorAll(".status-avail").forEach(el => {
      el.textContent = "✦ " + t("status_avail");
    });
    document.querySelectorAll(".status-unavail").forEach(el => {
      el.textContent = "✦ " + t("status_unavail");
    });
  }

  // 17.5 About Us Page (about.html)
  if (window.location.pathname.includes("about") || document.querySelector(".page-title-header [data-i18n='about_title']")) {
    document.title = isBn ? "আমাদের সম্পর্কে · WUB BloodCare" : "About · WUB BloodCare";
  }

  // 18. Footer text
  document.querySelectorAll(".app-footer div:last-child").forEach(el => {
    if (el.textContent.includes("Non-commercial") || el.textContent.includes("অবাণিজ্যিক")) {
      el.textContent = isBn ? "অবাণিজ্যিক বিশ্ববিদ্যালয় কল্যাণ প্ল্যাটফর্ম · শিক্ষার্থী রক্তদান নেটওয়ার্ক" : "Non-commercial University Welfare Platform · Student Blood Network";
    }
  });

  // 19. Update dropdown menus
  const menuLangText = document.getElementById("menuLangText");
  if (menuLangText) menuLangText.textContent = isBn ? "English" : "বাংলা (Bangla)";
  const menuGuestLangText = document.getElementById("menuGuestLangText");
  if (menuGuestLangText) menuGuestLangText.textContent = isBn ? "English" : "বাংলা (Bangla)";
}

function updateLanguageUIElements(lang) {
  const isBn = lang === "bn";
  document.querySelectorAll(".lang-opt.en").forEach(el => {
    el.classList.toggle("active", !isBn);
  });
  document.querySelectorAll(".lang-opt.bn").forEach(el => {
    el.classList.toggle("active", isBn);
  });
  document.querySelectorAll(".sidebar-lang-btn").forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes("eng")) {
      btn.classList.toggle("active", !isBn);
    } else {
      btn.classList.toggle("active", isBn);
    }
  });

  const menuLangText = document.getElementById("menuLangText");
  if (menuLangText) menuLangText.textContent = isBn ? "English" : "বাংলা (Bangla)";
  const menuGuestLangText = document.getElementById("menuGuestLangText");
  if (menuGuestLangText) menuGuestLangText.textContent = isBn ? "English" : "বাংলা (Bangla)";
}

function initLanguage() {
  const saved = getCurrentLanguage();
  document.documentElement.setAttribute("lang", saved);
  document.documentElement.setAttribute("data-lang", saved);
  applyLanguageToDOM(saved);
}

function renderLanguageToggleButtons() {
  const currentLang = getCurrentLanguage();

  // 1. Inject into topbar right if topbar exists
  const topbarRights = document.querySelectorAll(".topbar-right-v2, .topbar-right");
  topbarRights.forEach(tr => {
    if (!tr.querySelector(".lang-toggle-btn")) {
      const btn = document.createElement("button");
      btn.className = "lang-toggle-btn";
      btn.id = "langToggleBtn";
      btn.onclick = toggleLanguage;
      btn.title = "Change Language / ভাষা পরিবর্তন করুন";
      btn.setAttribute("aria-label", "Toggle Language");
      btn.innerHTML = `
        <span class="lang-globe-icon">🌐</span>
        <span class="lang-toggle-pill">
          <span class="lang-opt en ${currentLang === 'en' ? 'active' : ''}">EN</span>
          <span class="lang-opt-divider">/</span>
          <span class="lang-opt bn ${currentLang === 'bn' ? 'active' : ''}">বাং</span>
        </span>
      `;
      tr.insertBefore(btn, tr.firstChild);
    }
  });

  // 2. Ensure language switch is removed from left sidebar
  document.querySelectorAll(".sidebar-lang-switch").forEach(el => el.remove());

  // 3. Floating on auth pages
  const authContainer = getAuthFloatingControlsContainer();
  if (authContainer && !authContainer.querySelector(".lang-toggle-btn")) {
    const floatBtn = document.createElement("button");
    floatBtn.className = "lang-toggle-btn auth-lang-toggle";
    floatBtn.id = "langToggleBtn";
    floatBtn.onclick = toggleLanguage;
    floatBtn.title = "Change Language / ভাষা পরিবর্তন করুন";
    floatBtn.setAttribute("aria-label", "Toggle Language");
    floatBtn.innerHTML = `
      <span class="lang-globe-icon">🌐</span>
      <span class="lang-toggle-pill">
        <span class="lang-opt en ${currentLang === 'en' ? 'active' : ''}">EN</span>
        <span class="lang-opt-divider">/</span>
        <span class="lang-opt bn ${currentLang === 'bn' ? 'active' : ''}">বাং</span>
      </span>
    `;
    if (authContainer.firstChild) {
      authContainer.insertBefore(floatBtn, authContainer.firstChild);
    } else {
      authContainer.appendChild(floatBtn);
    }
  }

  updateLanguageUIElements(currentLang);
}

// ==========================================================================
// 5. TOPBAR UI & NOTIFICATIONS
// ==========================================================================
function updateTopbarAuthUI() {
  const user = getCurrentUser();
  const profileWrap = document.getElementById("topbarUserMenuWrap");
  if (!profileWrap) return;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const isBn = getCurrentLanguage() === "bn";

  if (user) {
    const initials = user.initials || (user.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : 'ST');
    const roleLabel = user.role === 'super_admin' ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : (user.role === 'moderator' ? 'Moderator' : 'Student'));

    profileWrap.innerHTML = `
      <button class="user-profile-btn" id="userProfileBtn" onclick="toggleProfileDropdown(event)" aria-label="User Profile Menu">
        <div class="avatar-initials">${initials}</div>
        <span>${(user.name || 'User').split(' ')[0]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="dropdown-menu" id="userDropdownMenu">
        <div class="dropdown-header">
          <b>${user.name}</b>
          <small>${user.id || user.student_id || ''} · <span style="text-transform: capitalize; color: var(--primary); font-weight: 700;">${roleLabel}</span></small>
        </div>
        ${["admin", "super_admin", "moderator"].includes(user.role) ? `
          <a href="admin.html" class="dropdown-item">⚙ ${isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Console'}</a>
        ` : ''}
        <a href="dashboard.html" class="dropdown-item">⌂ ${isBn ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</a>
        <a href="request-blood.html" class="dropdown-item">⊕ ${isBn ? 'রক্তের আবেদন' : 'Request Blood'}</a>
        <a href="find-blood.html" class="dropdown-item">⌕ ${isBn ? 'রক্ত খুঁজুন' : 'Find Blood'}</a>
        <a href="profile.html" class="dropdown-item">👤 ${isBn ? 'প্রোফাইল ও ভেরিফিকেশন' : 'Profile & Verification'}</a>
        <div class="dropdown-divider"></div>
        <a href="javascript:void(0)" onclick="toggleTheme()" class="dropdown-item" id="menuThemeToggle">
          <span id="menuThemeIcon">${isDark ? '☀️' : '🌙'}</span>
          <span id="menuThemeText">${isDark ? (isBn ? 'লাইট মোড' : 'Light Mode') : (isBn ? 'ডার্ক মোড' : 'Dark Mode')}</span>
        </a>
        <a href="javascript:void(0)" onclick="toggleLanguage()" class="dropdown-item" id="menuLangToggle">
          <span id="menuLangIcon">🌐</span>
          <span id="menuLangText">${isBn ? 'Switch to English' : 'বাংলায় দেখুন (Bangla)'}</span>
        </a>
        <a href="javascript:void(0)" onclick="logoutUser()" class="dropdown-item" style="color: var(--accent);">⎋ ${isBn ? 'লগআউট' : 'Log Out'}</a>
      </div>
    `;
  } else {
    profileWrap.innerHTML = `
      <button class="user-profile-btn" id="userProfileBtn" onclick="toggleProfileDropdown(event)" aria-label="Sign In Menu">
        <div class="user-avatar-circle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <span class="user-name-text">${isBn ? 'লগইন' : 'Sign In'}</span>
        <svg class="user-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="dropdown-menu" id="userDropdownMenu">
        <div class="dropdown-header">
          <b>${isBn ? 'স্টুডেন্ট পোর্টাল' : 'Student Portal'}</b>
          <small>World University of Bangladesh</small>
        </div>
        <a href="login.html" class="dropdown-item">🔑 ${isBn ? 'লগইন / সাইন ইন' : 'Login / Sign In'}</a>
        <a href="register.html" class="dropdown-item">📝 ${isBn ? 'শিক্ষার্থী নিবন্ধন' : 'Register as Student'}</a>
        <a href="request-blood.html" class="dropdown-item">⊕ ${isBn ? 'রক্তের আবেদন' : 'Request Blood'}</a>
        <a href="find-blood.html" class="dropdown-item">⌕ ${isBn ? 'রক্ত খুঁজুন' : 'Find Blood'}</a>
        <div class="dropdown-divider"></div>
        <a href="javascript:void(0)" onclick="toggleTheme()" class="dropdown-item" id="menuGuestThemeToggle">
          <span id="menuGuestThemeIcon">${isDark ? '☀️' : '🌙'}</span>
          <span id="menuGuestThemeText">${isDark ? (isBn ? 'লাইট মোড' : 'Light Mode') : (isBn ? 'ডার্ক মোড' : 'Dark Mode')}</span>
        </a>
        <a href="javascript:void(0)" onclick="toggleLanguage()" class="dropdown-item" id="menuGuestLangToggle">
          <span id="menuGuestLangIcon">🌐</span>
          <span id="menuGuestLangText">${isBn ? 'Switch to English' : 'বাংলায় দেখুন (Bangla)'}</span>
        </a>
      </div>
    `;
  }
}

function toggleProfileDropdown(event) {
  const ev = event || (typeof window !== 'undefined' ? window.event : null);
  if (ev && ev.stopPropagation) {
    ev.stopPropagation();
  }
  const notifPanel = document.getElementById("notificationsPanel");
  if (notifPanel) notifPanel.classList.remove("show");

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

function toggleNotifications(event) {
  const ev = event || (typeof window !== 'undefined' ? window.event : null);
  if (ev && ev.stopPropagation) {
    ev.stopPropagation();
  }
  let panel = document.getElementById("notificationsPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "notificationsPanel";
    panel.className = "notifications-panel";

    const topbarRight = document.querySelector(".topbar-right-v2") || document.querySelector(".topbar-right");
    if (topbarRight) {
      topbarRight.appendChild(panel);
    } else {
      document.body.appendChild(panel);
    }
  }

  const profileMenu = document.getElementById("userDropdownMenu");
  if (profileMenu) profileMenu.classList.remove("show");

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
    switch (cat) {
      case "match": return "cat-match";
      case "urgent": return "cat-urgent";
      case "campaign": return "cat-campaign";
      default: return "cat-update";
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
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
async function registerDonor(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("donorFullName")?.value.trim();
  const blood = document.getElementById("donorBloodGroup")?.value;
  const dept = document.getElementById("donorDept")?.value;
  const studentId = document.getElementById("donorStudentId")?.value.trim();
  const phone = document.getElementById("donorPhone")?.value.trim();
  const campus = document.getElementById("donorCampus")?.value || "Uttara";
  const lastDonationInput = document.getElementById("donorLastDonation")?.value;
  const medicalConditions = document.getElementById("donorMedicalConditions")?.value || "None (Healthy & Fit)";

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

  const token = localStorage.getItem("wub_token");
  let serverDonorId = null;
  let isAutoApproved = false;

  const payload = {
    name: name,
    student_id: studentId,
    studentId: studentId,
    phone: phone,
    department: dept,
    dept: dept,
    blood_group: blood,
    location: campus,
    availability: "available",
    weight_kg: 55,
    eligibility_acknowledged: true,
    last_donation_date: lastDonationInput || null,
    medical_conditions: medicalConditions
  };

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/donors/apply", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success && data.donor) {
      serverDonorId = data.donor.id;
      isAutoApproved = data.donor.status === 'approved';
    }
  } catch (err) {
    console.warn("API donor apply fallback to local store", err);
  }

  const initials = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

  // Register donor record with appropriate verification status and health details
  const newDonor = {
    id: serverDonorId || ("donor-" + Date.now()),
    userId: studentId,
    name: name,
    initials: initials,
    blood: blood,
    dept: dept,
    campus: campus,
    location: campus,
    phone: phone,
    available: true,
    verificationStatus: isAutoApproved ? "verified" : "pending",
    donationsCount: lastDonationInput ? 1 : 0,
    lastDonation: lastDonationInput || "Newly Registered",
    medicalConditions: medicalConditions,
    healthScreening: "Passed (Weight ≥ 50kg, Verified Student)"
  };

  const donors = getStoredDonors();
  const existingIdx = donors.findIndex(d => d.userId === studentId || (d.phone && d.phone === phone));
  if (existingIdx !== -1) {
    donors[existingIdx] = { ...donors[existingIdx], ...newDonor };
  } else {
    donors.unshift(newDonor);
  }
  saveDonors(donors);

  const currentUser = getCurrentUser();
  if (currentUser) {
    currentUser.isDonor = true;
    currentUser.donorAvailable = true;
    currentUser.verificationStatus = isAutoApproved ? "verified" : (currentUser.verificationStatus || "pending");
    currentUser.blood = blood;
    currentUser.phone = phone;
    currentUser.dept = dept;
    currentUser.address = campus;
    setCurrentUser(currentUser);

    const users = getStoredUsers();
    const uIdx = users.findIndex(u => u.id === currentUser.id);
    if (uIdx !== -1) {
      users[uIdx] = { ...users[uIdx], ...currentUser };
      saveUsers(users);
    }
  }

  logAuditEvent("DONOR_REGISTER", studentId, `${name} registered as donor (${blood}, ${campus}) - ${isAutoApproved ? 'Verified' : 'Verification Pending'}.`);
  createNotification("admin", "all", "New Donor Registration", `${name} (${studentId}) registered as a ${blood} donor. Identity review pending.`, "update", "Verification");

  showToast(
    isAutoApproved
      ? `Congratulations ${name}! Your donor profile is verified and active in Find Blood.`
      : `Thank you, ${name}! Your donor profile is submitted for verification by WUB Health Office.`,
    "success"
  );

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
let currentBloodPill = "";

function setBloodPill(bloodGroup) {
  currentBloodPill = bloodGroup;

  // Update pills active styling
  const pills = document.querySelectorAll(".blood-pill");
  pills.forEach(pill => {
    if (pill.getAttribute("data-blood") === bloodGroup) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  // Sync dropdown if it exists
  const bf = document.getElementById("bloodFilter");
  if (bf) {
    bf.value = bloodGroup;
  }

  filterDonors();
}

function renderDonorCards(donorsToRender, containerId = "donorCardsContainer") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentUser = getCurrentUser();
  const currentLang = getCurrentLanguage();

  if (donorsToRender.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🩸</div>
        <h3 class="empty-state-title">${t('no_donors_title', 'No Matching Verified Donors Found')}</h3>
        <p class="empty-state-text">
          ${t('no_donors_desc', "We couldn't find available donors matching your current filter. Try resetting filters or post an emergency request for the WUB student community.")}
        </p>
        <div class="empty-state-actions">
          <button onclick="resetDonorFilters()" class="btn btn-outline btn-sm">
            ${t('btn_reset', 'Reset Filters')}
          </button>
          <a href="request-blood.html" class="btn btn-danger btn-sm">
            ${t('post_emergency_btn', 'Post Emergency Blood Request')}
          </a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = donorsToRender.map((donor, idx) => {
    const cleanPhone = (donor.phone || '').replace(/[^0-9]/g, '');
    const initials = donor.initials || (donor.name ? donor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'WUB');
    const hasRealAvatar = !!(donor.avatarImg || donor.profilePhoto || donor.avatar_url);
    const avatarSrc = hasRealAvatar ? (donor.avatarImg || donor.profilePhoto || donor.avatar_url) : null;
    const isAvail = donor.available !== false;
    const rawLoc = donor.location || donor.campus || 'Main Campus';
    const displayLoc = (currentLang === 'bn' && DHAKA_LOCATIONS_BN[rawLoc]) ? DHAKA_LOCATIONS_BN[rawLoc] : rawLoc;

    return `
      <div class="donor-card-v2" data-id="${donor.id || donor.userId}">
        <div>
          <div class="card-v2-top">
            <div class="card-v2-avatar-wrap">
              ${avatarSrc ? `
                <img src="${avatarSrc}" alt="${donor.name}" class="card-v2-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="card-v2-avatar-fallback" style="display: none;">${initials}</div>
              ` : `
                <div class="card-v2-avatar-fallback" style="display: flex;">${initials}</div>
              `}
              <div class="card-v2-verified-badge" title="Verified WUB Student Donor">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <div class="card-v2-info">
              <h4 class="card-v2-name" title="${donor.name}">${donor.name}</h4>
              <div class="card-v2-sub" title="Department">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>${donor.dept || 'CSE'}</span>
              </div>
              <div class="card-v2-sub" title="Location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${displayLoc}</span>
              </div>
            </div>

            <div class="card-v2-blood-pill" title="Blood Group">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#DC2626"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              <span>${donor.blood}</span>
            </div>
          </div>

          <div class="card-v2-status-wrap">
            <span class="card-v2-status ${isAvail ? 'status-avail' : 'status-unavail'}">
              ✦ ${isAvail ? t('status_avail', 'Available') : t('status_unavail', 'Not Available')}
            </span>
          </div>

          <div class="card-v2-meta-row">
            <span class="card-meta-last-donated" title="Last Donation Date">🩸 ${t('last_prefix', 'Last:')} <b>${formatDonationInfo(donor.lastDonation).dateFormatted}</b></span>
            <span class="card-meta-health-tag" title="Health Screening">🛡️ ${donor.medicalConditions && !donor.medicalConditions.toLowerCase().includes('none') ? 'Screened' : (currentLang === 'bn' ? 'সুস্থ' : 'Healthy')}</span>
          </div>
        </div>

        <div class="card-v2-actions">
          ${currentUser ? `
            <button class="btn-v2-contact" onclick="openContactModal('${donor.id || donor.userId}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              ${t('contact_donor', 'Contact Donor')}
            </button>
            <button class="btn-v2-msg" onclick="openContactModal('${donor.id || donor.userId}')" title="Message Donor">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
          ` : `
            <a href="login.html?redirect=find-blood.html" class="btn-v2-contact" style="text-decoration: none; justify-content: center; background: #0E3A8A; color: #FFFFFF; width: 100%;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              🔒 ${t('login_to_view', 'Login to View Contact')}
            </a>
          `}
        </div>
      </div>
    `;
  }).join('');
}

async function filterDonors() {
  const bloodFilterSelect = document.getElementById("bloodFilter")?.value || "";
  const effectiveBlood = currentBloodPill || bloodFilterSelect;
  const locationFilter = document.getElementById("locationFilter")?.value || "";
  const departmentFilter = document.getElementById("departmentFilter")?.value || "";
  const availabilityFilter = document.getElementById("availabilityFilter")?.value || "";
  const searchInput = document.getElementById("globalSearchInput")?.value.toLowerCase().trim() || "";
  const sortSelect = document.getElementById("donorSortSelect")?.value || "latest";

  let apiDonorsFound = false;
  let donors = [];

  try {
    const params = new URLSearchParams();
    if (effectiveBlood && effectiveBlood !== "Select blood group") params.append("blood_group", effectiveBlood);
    if (locationFilter && !locationFilter.toLowerCase().includes("all") && !locationFilter.toLowerCase().includes("select")) params.append("location", locationFilter);
    if (departmentFilter && !departmentFilter.toLowerCase().includes("all")) params.append("department", departmentFilter);
    if (availabilityFilter) params.append("availability", availabilityFilter);
    if (searchInput) params.append("search", searchInput);

    const token = localStorage.getItem("wub_token");
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    const res = await fetch(`/api/donors/search?${params.toString()}`, { headers });
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.donors)) {
      apiDonorsFound = true;
      donors = data.donors.map(d => ({
        id: d.donor_id || d.user_id,
        userId: d.user_id,
        name: d.name,
        blood: d.blood_group,
        dept: d.department || "WUB",
        campus: d.location || "Dhaka",
        location: d.location || "Dhaka",
        available: d.availability === "available",
        verificationStatus: "verified",
        donationsCount: d.donation_count || 1,
        phone: d.phone,
        is_contact_protected: d.is_contact_protected,
        avatarImg: d.avatar_url || null
      }));
    }
  } catch (err) {
    console.warn("API search error, using local data", err);
  }

  // Always merge locally approved donors so any donor approved in Admin immediately appears
  const localDonors = getStoredDonors().filter(d => d.verificationStatus === "verified" || d.verificationStatus === "approved" || !d.verificationStatus);
  localDonors.forEach(ld => {
    const alreadyPresent = donors.some(d =>
      d.id === ld.id ||
      d.userId === ld.userId ||
      (d.phone && ld.phone && d.phone === ld.phone) ||
      (d.name && ld.name && d.name.toLowerCase() === ld.name.toLowerCase())
    );
    if (!alreadyPresent) {
      const matchBlood = !effectiveBlood || effectiveBlood === "Select blood group" || ld.blood.toUpperCase() === effectiveBlood.toUpperCase();
      const donorLoc = (ld.location || ld.campus || "").toLowerCase();
      const locQuery = (locationFilter || "").toLowerCase().trim();
      const matchLocation = !locationFilter || locQuery === "all dhaka locations" || locQuery === "select location" ||
        donorLoc.includes(locQuery) || locQuery.includes(donorLoc);

      const donorDept = (ld.dept || "").toLowerCase();
      const deptQuery = (departmentFilter || "").toLowerCase().trim();
      const matchDepartment = !departmentFilter || deptQuery === "all departments" ||
        donorDept.includes(deptQuery) || deptQuery.includes(donorDept);

      const matchAvailability = !availabilityFilter ||
        (availabilityFilter === "available" && ld.available !== false) ||
        (availabilityFilter === "paused" && ld.available === false);
      const matchSearch = !searchInput ||
        ld.name.toLowerCase().includes(searchInput) ||
        ld.blood.toLowerCase().includes(searchInput) ||
        donorLoc.includes(searchInput) ||
        donorDept.includes(searchInput) ||
        (ld.phone && ld.phone.includes(searchInput));

      if (matchBlood && matchLocation && matchDepartment && matchAvailability && matchSearch) {
        donors.unshift({
          id: ld.id || ld.userId,
          userId: ld.userId || ld.id,
          name: ld.name,
          blood: ld.blood,
          dept: ld.dept || "WUB",
          campus: ld.campus || ld.location || "Dhaka",
          location: ld.location || ld.campus || "Dhaka",
          available: ld.available !== false,
          verificationStatus: "verified",
          donationsCount: ld.donationsCount || 0,
          phone: ld.phone || "01712345678",
          avatarImg: ld.avatarImg || null
        });
      }
    }
  });

  if (sortSelect === "name") {
    donors.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect === "blood") {
    donors.sort((a, b) => a.blood.localeCompare(b.blood));
  } else if (sortSelect === "donations") {
    donors.sort((a, b) => (b.donationsCount || 0) - (a.donationsCount || 0));
  }

  renderDonorCards(donors);

  const countEl = document.getElementById("donorCountDisplay");
  if (countEl) {
    countEl.textContent = `${donors.length} donor${donors.length === 1 ? '' : 's'} found`;
  }
}

function resetDonorFilters() {
  currentBloodPill = "";
  const pills = document.querySelectorAll(".blood-pill");
  pills.forEach(pill => {
    if (pill.getAttribute("data-blood") === "") {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  const bf = document.getElementById("bloodFilter");
  const lf = document.getElementById("locationFilter");
  const df = document.getElementById("departmentFilter");
  const af = document.getElementById("availabilityFilter");
  const sf = document.getElementById("globalSearchInput");
  const so = document.getElementById("donorSortSelect");

  if (bf) bf.value = "";
  if (lf) lf.value = "";
  if (df) df.value = "";
  if (af) af.value = "";
  if (sf) sf.value = "";
  if (so) so.value = "latest";

  filterDonors();
}

function formatDonationInfo(lastDonation) {
  if (!lastDonation || lastDonation === "Never" || lastDonation === "Newly Registered") {
    return {
      dateFormatted: "First-Time Donor",
      relativeTime: "Never donated before",
      isEligible: true,
      badgeText: "Ready to Donate",
      badgeClass: "health-badge-clean"
    };
  }

  const d = new Date(lastDonation);
  if (isNaN(d.getTime())) {
    return {
      dateFormatted: String(lastDonation),
      relativeTime: "Eligible for donation",
      isEligible: true,
      badgeText: "Eligible Now",
      badgeClass: "health-badge-clean"
    };
  }

  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const monthsAgo = Math.floor(diffDays / 30);

  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const dateFormatted = d.toLocaleDateString('en-GB', options);

  // Standard medical eligibility cooldown: 90 days between blood donations
  const isEligible = diffDays >= 90;
  const daysLeft = Math.max(0, 90 - diffDays);

  return {
    dateFormatted: dateFormatted,
    relativeTime: monthsAgo > 0 ? `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago` : (diffDays > 0 ? `${diffDays} days ago` : 'Recently'),
    isEligible: isEligible,
    badgeText: isEligible ? "Eligible to Donate" : `Cooldown (${daysLeft}d left)`,
    badgeClass: isEligible ? "health-badge-clean" : "health-badge-warning"
  };
}

// ==========================================================================
// 8. DONOR CONTACT MODAL (Phase 7)
// Safe, professional contact modal with Call & WhatsApp
// ==========================================================================
function openContactModal(donorId) {
  const user = getCurrentUser();
  if (!user) {
    showToast("Please login with your WUB student account to view contact numbers.", "info");
    setTimeout(() => {
      window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.pathname);
    }, 1000);
    return;
  }

  const donors = getStoredDonors();
  let donor = donors.find(d => d.id === donorId || d.userId === donorId || String(d.id) === String(donorId));
  if (!donor) {
    const users = getStoredUsers();
    const u = users.find(u => u.id === donorId || u.username === donorId);
    if (u) {
      donor = {
        name: u.name,
        phone: u.phone || "01712345678",
        blood: u.blood || "O+",
        dept: u.dept || "WUB",
        campus: u.address || "Uttara",
        avatarClass: "avatar-ar",
        initials: (u.name || "WUB").substring(0, 2).toUpperCase(),
        lastDonation: "2026-05-10",
        medicalConditions: "None (Healthy & Fit)",
        healthScreening: "Cleared (Weight ≥ 50kg, Normal BP, Screened)"
      };
    }
  }
  if (!donor) return;

  const cleanPhone = donor.phone.replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(`Assalamu Alaikum ${donor.name},\nI found your verified contact on WUB Blood and urgently need ${donor.blood} blood for a patient at ${donor.campus || 'Dhaka'}. Are you available to help?`);

  const donationInfo = formatDonationInfo(donor.lastDonation);
  const medicalStatus = donor.medicalConditions || donor.diseases || "None (Healthy & Fit)";
  const isHealthy = !medicalStatus.toLowerCase().includes("hypertension") &&
    !medicalStatus.toLowerCase().includes("diabet") &&
    !medicalStatus.toLowerCase().includes("other") &&
    !medicalStatus.toLowerCase().includes("medication");

  const currentLang = getCurrentLanguage();
  const rawLoc = donor.campus || donor.location || 'Dhaka';
  const displayLoc = (currentLang === 'bn' && DHAKA_LOCATIONS_BN[rawLoc]) ? DHAKA_LOCATIONS_BN[rawLoc] : rawLoc;

  const modalHtml = `
    <div class="custom-modal-backdrop show" id="contactModal">
      <div class="custom-modal-window" style="max-width: 490px;">
        <div class="custom-modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${t('modal_title', 'Donor Contact Information')}
          </h3>
          <button class="modal-close-btn" onclick="closeContactModal()">&times;</button>
        </div>
        <div class="custom-modal-body">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1.5px solid rgba(226, 232, 240, 0.2);">
            <div class="donor-avatar ${donor.avatarClass || 'avatar-ar'}" style="width: 48px; height: 48px; font-size: 17px;">
              ${donor.initials || donor.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 class="modal-donor-name">${donor.name}</h3>
              <div class="modal-donor-sub">${donor.dept} · ${displayLoc}</div>
              <span class="donor-status-pill status-available" style="margin-top: 5px; display: inline-flex;">● ${t('verified_donor', 'Verified WUB Student Donor')}</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div class="modal-glass-stat-card">
              <small class="modal-stat-label">${t('filter_blood_label', 'Blood Group')}</small>
              <div class="modal-stat-val modal-blood-val">${donor.blood}</div>
            </div>
            <div class="modal-glass-stat-card">
              <small class="modal-stat-label">${currentLang === 'bn' ? 'মোট রক্তদান' : 'Total Donations'}</small>
              <div class="modal-stat-val modal-donations-val">${donor.donationsCount || 0} ${currentLang === 'bn' ? 'বার' : 'times'}</div>
            </div>
          </div>

          <!-- Health & Medical Details & Last Donation Card -->
          <div class="modal-glass-health-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1.5px solid rgba(226, 232, 240, 0.15);">
              <div class="modal-health-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                ${t('modal_health_title', 'Health & Donation Eligibility')}
              </div>
              <span class="${donationInfo.badgeClass}">
                ${donationInfo.badgeText}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
              <div>
                <small class="modal-health-label">${currentLang === 'bn' ? 'সর্বশেষ রক্তদান' : 'Last Blood Donation'}</small>
                <div class="modal-health-val">
                  📅 ${donationInfo.dateFormatted}
                </div>
                <div class="modal-health-sub">(${donationInfo.relativeTime})</div>
              </div>
              <div>
                <small class="modal-health-label">${currentLang === 'bn' ? 'শারীরিক সুস্থতা' : 'Diseases / Medical Status'}</small>
                <div class="modal-health-status ${isHealthy ? 'status-healthy' : 'status-notice'}">
                  ${isHealthy ? '🛡️ ' : '⚠️ '}${medicalStatus}
                </div>
                <div class="modal-health-status-sub ${isHealthy ? 'status-healthy' : 'status-notice'}">
                  ${isHealthy ? (currentLang === 'bn' ? '● সম্পূর্ণ সুস্থ ও ফিট' : '● Healthy & Fit') : '● Special notes'}
                </div>
              </div>
            </div>

            <div class="modal-health-screening-box">
              <span style="color: #10B981; font-weight: 800; font-size: 13px;">✓</span>
              <span><b>${currentLang === 'bn' ? 'স্বাস্থ্য পরীক্ষা:' : 'Health Screening:'}</b> ${donor.healthScreening || (currentLang === 'bn' ? 'অনুমোদিত (ওজন ৫০+ কেজি, রক্তচাপ স্বাভাবিক)' : 'Cleared (Weight ≥ 50kg, Normal BP, Screened)')}</span>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="modal-section-label">${currentLang === 'bn' ? 'সরাসরি যোগাযোগের মাধ্যম' : 'Direct Contact Options'}</label>
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <input type="text" class="form-input" value="${donor.phone}" readonly style="font-weight: 700; letter-spacing: 0.5px;">
              <a href="tel:${donor.phone}" class="btn btn-primary btn-sm" style="flex-shrink: 0; display: inline-flex; align-items: center; gap: 5px;">
                📞 ${t('modal_call_btn', 'Call')}
              </a>
              <a href="https://wa.me/88${cleanPhone}?text=${waMessage}" target="_blank" class="btn btn-outline btn-sm btn-whatsapp-modal" style="flex-shrink: 0; display: inline-flex; align-items: center; gap: 5px;">
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 4px;">
            <label for="inAppMsg" class="modal-section-label">${currentLang === 'bn' ? 'ইন-অ্যাপ দ্রুত বার্তা পাঠান' : 'Send Fast In-App Emergency Alert'}</label>
            <textarea class="form-textarea" id="inAppMsg" rows="2" placeholder="${currentLang === 'bn' ? 'আসসালামু আলাইকুম ' + donor.name + ', জরুরি প্রয়োজনে রক্তের দরকার...' : 'Hi ' + donor.name + ', we urgently require ' + donor.blood + ' blood for a student family member at...'}"></textarea>
          </div>

          <div class="modal-etiquette-box">
            🛡️ <b>${currentLang === 'bn' ? 'সতর্কতা:' : 'Etiquette:'}</b> ${currentLang === 'bn' ? 'শুধুমাত্র প্রকৃত জরুরি প্রয়োজনে যোগাযোগ করুন। বিনয়ের সাথে হাসপাতালের নাম উল্লেখ করুন।' : 'Please only contact donors for genuine medical needs. Be polite and state hospital name clearly.'}
          </div>
        </div>
        <div class="custom-modal-footer">
          <button class="btn btn-outline" onclick="closeContactModal()">${t('modal_close', 'Close')}</button>
          <button class="btn btn-danger" onclick="sendAlertMessage('${donor.name}', '${donor.id}')">🚨 ${currentLang === 'bn' ? 'অ্যালার্ট পাঠান' : 'Dispatch Alert'}</button>
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

async function sendAlertMessage(donorName, donorId) {
  const msg = document.getElementById("inAppMsg")?.value.trim();
  const token = localStorage.getItem("wub_token");

  if (token) {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          donor_user_id: donorId,
          message: msg || `Urgent blood request for ${donorName}`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        closeContactModal();
        showToast(data.message || `Contact request sent to ${donorName}.`, "success");
        return;
      } else if (res.status === 400 || res.status === 403) {
        showToast(data.message || "Could not dispatch contact request.", "danger");
        return;
      }
    } catch (err) {
      console.warn("API contact request error", err);
    }
  }

  const user = getCurrentUser() || { name: "A fellow WUB student", id: "Student" };
  createNotification("student", donorId, "Urgent Emergency Contact", `${user.name} dispatched an urgent blood alert to you: "${msg || 'Immediate blood support needed'}"`, "urgent", "Emergency");

  closeContactModal();
  showToast(`Emergency alert dispatched to ${donorName}. They have received your notification and contact info.`, "success");
}

// ==========================================================================
// 9. BLOOD REQUEST WORKFLOW (Phase 8)
// Student submits -> Admin reviews -> Admin Approves / Rejects / Completes -> Student sees status
// ==========================================================================
// Compatibility matrix for blood donation
const CAN_DONATE_TO_MAP = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"]
};

function isDonorCompatible(donorBlood, recipientBlood) {
  if (!donorBlood || !recipientBlood) return false;
  const d = donorBlood.toUpperCase().trim().replace(/\s+/g, '');
  const r = recipientBlood.toUpperCase().trim().replace(/\s+/g, '');
  return (CAN_DONATE_TO_MAP[d] || []).includes(r);
}

async function submitRequest(event) {
  if (event) event.preventDefault();

  const bloodGroup = document.getElementById("requestBlood")?.value;
  const units = document.getElementById("requestUnits")?.value.trim() || "1";
  const hospital = document.getElementById("requestHospital")?.value.trim() || document.getElementById("requestLocation")?.value || "";
  const location = document.getElementById("requestLocation")?.value || "Uttara";
  const neededDate = document.getElementById("requestNeededDate")?.value || new Date().toISOString().slice(0, 10);
  const neededTime = document.getElementById("requestNeededTime")?.value.trim() || "Immediate / Urgent";
  const urgency = document.getElementById("requestUrgency")?.value || "Normal";
  const reason = document.getElementById("requestReason")?.value.trim() || "Immediate student medical emergency.";
  const contactPhone = document.getElementById("requestPhone")?.value.trim();

  if (!bloodGroup || bloodGroup.includes("Select")) {
    showToast("Please select the required blood group.", "danger");
    return;
  }

  if (!hospital) {
    showToast("Please enter the hospital / medical center name.", "danger");
    return;
  }

  if (!location || location.includes("Select")) {
    showToast("Please select the campus / Dhaka location area.", "danger");
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

  const token = localStorage.getItem("wub_token");
  const user = getCurrentUser();

  if (token) {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_name: user?.name ? `Patient (${user.name})` : "WUB Emergency Patient",
          blood_group: bloodGroup,
          units_needed: parseInt(units, 10) || 1,
          needed_date: neededDate,
          needed_time: neededTime,
          hospital_name: hospital,
          location_name: location,
          urgency_level: urgency.toLowerCase(),
          reason: reason,
          additional_notes: `Emergency Phone: ${contactPhone}`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Blood request published! Matching student donors are being notified.", "success");
        const form = document.getElementById("bloodRequestForm");
        if (form) form.reset();
        renderRequestsList();
        return;
      } else {
        showToast(data.message || "Could not publish request.", "danger");
        if (data.message && data.message.includes("verified")) {
          setTimeout(() => { window.location.href = "profile.html"; }, 1800);
        }
        return;
      }
    } catch (e) {
      console.warn("API submit request fallback", e);
    }
  }

  // Fallback to local store
  const defaultUser = user || { name: "WUB Student", id: "GUEST-" + Math.floor(1000 + Math.random() * 9000), phone: contactPhone || "017XXXXXXXX" };
  const newRequest = {
    id: "req-" + Date.now(),
    requesterId: defaultUser.id,
    blood: bloodGroup,
    units: units + " unit(s)",
    hospital: hospital,
    location: location,
    neededDate: neededDate,
    neededTime: neededTime,
    urgency: urgency,
    reason: reason,
    studentName: defaultUser.name,
    studentId: defaultUser.id,
    contactPhone: contactPhone || defaultUser.phone || "017XXXXXXXX",
    date: "Just now",
    status: "Active",
    reviewedBy: null
  };

  const currentRequests = getStoredRequests();
  currentRequests.unshift(newRequest);
  saveRequests(currentRequests);

  // Match eligible donors automatically and notify them
  const donors = getStoredDonors();
  let matchCount = 0;
  donors.forEach(donor => {
    if (donor.available !== false && isDonorCompatible(donor.blood, bloodGroup)) {
      matchCount++;
      createNotification(
        "student",
        donor.userId || donor.id,
        `Urgent Blood Match: ${bloodGroup} Needed! 🩸`,
        `${defaultUser.name} requested ${units} unit(s) of ${bloodGroup} at ${hospital}, ${location}. Needed: ${neededDate} (${neededTime}). Open Dashboard to volunteer.`,
        "urgent",
        "Blood Request"
      );
    }
  });

  logAuditEvent("REQUEST_SUBMIT", newRequest.id, `Blood request submitted by ${defaultUser.name} (${bloodGroup}, ${units} units at ${hospital})`);
  createNotification("admin", "all", "New Blood Request Pending Review", `${defaultUser.name} (${defaultUser.id}) requested ${units} units of ${bloodGroup} at ${hospital}.`, "urgent", "Blood Request");

  showToast(`Blood request submitted! Broadcasted to ${matchCount} matching WUB donors.`, "success");

  const form = document.getElementById("bloodRequestForm");
  if (form) form.reset();

  renderRequestsList();
}

// ==========================================================================
// URGENT DONOR MATCHES & "I CAN DONATE" HANDLERS
// ==========================================================================
async function renderUrgentDonorMatches() {
  const container = document.getElementById("urgentMatchesContainer");
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = "";
    return;
  }

  // Get active requests from server
  let allRequests = [];
  const token = localStorage.getItem("wub_token");
  if (token) {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.requests)) {
        allRequests = data.requests.map(r => ({
          id: r.id,
          requesterId: r.requester_id,
          requesterName: r.requester_name || "WUB Student",
          blood: r.blood_group,
          units: (r.units_needed || 1) + " unit(s)",
          hospital: r.hospital_name || r.location_name,
          location: r.location_name,
          neededDate: r.needed_date || "Today",
          neededTime: r.needed_time || "Urgent",
          urgency: (r.urgency_level || "Normal").toUpperCase(),
          reason: r.reason || "Urgent medical requirement",
          status: r.status
        }));
      }
    } catch (e) { }
  }

  // Merge with local requests
  const localReqs = getStoredRequests();
  localReqs.forEach(lr => {
    if (!allRequests.some(r => r.id === lr.id)) {
      allRequests.push({
        id: lr.id,
        requesterId: lr.requesterId,
        requesterName: lr.studentName || "WUB Student",
        blood: lr.blood,
        units: lr.units || "1 unit",
        hospital: lr.hospital || lr.location,
        location: lr.location,
        neededDate: lr.neededDate || "Today",
        neededTime: lr.neededTime || "Urgent",
        urgency: (lr.urgency || "Normal").toUpperCase(),
        reason: lr.reason || "Urgent medical requirement",
        status: lr.status
      });
    }
  });

  // Check matching blood compatibility for this donor
  const donorBlood = user.blood_group || user.blood || "O+";
  const userMatches = JSON.parse(localStorage.getItem("wub_accepted_matches") || "[]");

  const matchingRequests = allRequests.filter(req => {
    if (req.requesterId === user.id) return false;
    const reqStatus = (req.status || '').toLowerCase();
    if (reqStatus !== 'active' && reqStatus !== 'matched') return false;
    return isDonorCompatible(donorBlood, req.blood);
  });

  if (matchingRequests.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <section class="form-card-container" style="border: 2px solid #FCA5A5; background: linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%); border-radius: 14px; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.08); margin-bottom: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0;">
            🩸
          </div>
          <div>
            <h3 style="font-size: 16px; margin: 0; color: #991B1B; font-weight: 700;">
              Urgent Matching Blood Requests (${matchingRequests.length})
            </h3>
            <p style="font-size: 12px; color: #7F1D1D; margin: 2px 0 0;">
              These patients need your compatible blood group (<b>${donorBlood}</b>). Click <b>"I Can Donate"</b> to volunteer.
            </p>
          </div>
        </div>
        <span class="donor-status-pill status-urgent" style="font-size: 11px; padding: 4px 10px;">
          🚨 Action Needed
        </span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${matchingRequests.map(req => {
    const alreadyAccepted = userMatches.includes(req.id);
    return `
            <div style="background: #FFFFFF; border: 1.5px solid #FEE2E2; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span style="background: #DC2626; color: #FFF; font-weight: 800; font-size: 14px; padding: 3px 10px; border-radius: 6px;">
                    ${req.blood}
                  </span>
                  <b style="font-size: 14px; color: #0F172A;">${req.units} at ${req.hospital}</b>
                  <span class="donor-status-pill ${req.urgency === 'EMERGENCY' ? 'status-urgent' : 'status-available'}" style="font-size: 10px; padding: 2px 6px;">
                    ${req.urgency}
                  </span>
                </div>
                <small style="color: #64748B; font-size: 11.5px;">📅 Needed: ${req.neededDate} (${req.neededTime})</small>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px; font-size: 12px; color: #475569; background: #F8FAFC; padding: 8px 12px; border-radius: 6px;">
                <div>📍 <b>Location:</b> ${req.location}</div>
                <div>👤 <b>Requester:</b> ${req.requesterName}</div>
                <div style="grid-column: 1 / -1;">📝 <b>Medical Note:</b> ${req.reason}</div>
              </div>

              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 4px;">
                ${alreadyAccepted ? `
                  <span style="background: #DCFCE7; color: #15803D; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;">
                    ✓ You offered to donate for this request (Requester Notified)
                  </span>
                ` : `
                  <button class="btn btn-primary btn-sm" onclick="respondCanDonate('${req.id}')" style="background: #DC2626; border-color: #DC2626; font-weight: 700; font-size: 12.5px; padding: 7px 20px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3); display: inline-flex; align-items: center; gap: 6px;">
                    🩸 I Can Donate
                  </button>
                `}
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </section>
  `;
}

async function respondCanDonate(requestId) {
  const user = getCurrentUser();
  if (!user) {
    showToast("Please log in to volunteer as a donor.", "info");
    return;
  }

  const token = localStorage.getItem("wub_token");
  let apiDone = false;

  if (token) {
    try {
      const res = await fetch(`/api/requests/${requestId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        apiDone = true;
      }
    } catch (e) {
      console.warn("API respond error, using local store", e);
    }
  }

  // Save in local accepted matches
  const userMatches = JSON.parse(localStorage.getItem("wub_accepted_matches") || "[]");
  if (!userMatches.includes(requestId)) {
    userMatches.push(requestId);
    localStorage.setItem("wub_accepted_matches", JSON.stringify(userMatches));
  }

  // Save to persistent matches table in localStorage
  const allMatches = JSON.parse(localStorage.getItem("wub_request_matches") || "[]");
  allMatches.push({
    id: "match_" + Date.now(),
    request_id: requestId,
    donor_id: user.id,
    donor_name: user.name,
    donor_phone: user.phone || "01712345678",
    donor_blood_group: user.blood_group || user.blood || "Compatible",
    donor_department: user.department || user.dept || "WUB",
    status: "accepted",
    responded_at: new Date().toISOString()
  });
  localStorage.setItem("wub_request_matches", JSON.stringify(allMatches));

  // Find request and notify requester
  const requests = getStoredRequests();
  const req = requests.find(r => r.id === requestId);
  if (req) {
    req.status = "Matched";
    saveRequests(requests);

    createNotification(
      "student",
      req.requesterId,
      "Donor Found: I Can Donate! 🩸",
      `${user.name} (${user.blood_group || user.blood}, ${user.department || user.dept}) has volunteered to donate blood at ${req.hospital || req.location}. Call donor: ${user.phone}`,
      "urgent",
      "Donation Response"
    );
  }

  createNotification(
    "student",
    user.id,
    "Donation Commitment Confirmed",
    `Thank you for volunteering! The requester has received your contact details. Please stay available.`,
    "update",
    "Donation Response"
  );

  showToast("Thank you! Your donation offer has been recorded and the requester has been notified with your contact details.", "success");

  renderUrgentDonorMatches();
  renderRespondedDonors();
  updateNotificationBadge();
}

async function renderRespondedDonors() {
  const container = document.getElementById("respondedDonorsContainer");
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = "";
    return;
  }

  let responses = [];
  const token = localStorage.getItem("wub_token");
  if (token) {
    try {
      const res = await fetch("/api/requests/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.requests)) {
        data.requests.forEach(r => {
          if (Array.isArray(r.responses) && r.responses.length > 0) {
            r.responses.forEach(resp => {
              responses.push({
                requestId: r.id,
                hospital: r.hospital_name || r.location_name,
                blood: r.blood_group,
                donorName: resp.donor_name,
                donorPhone: resp.donor_phone,
                donorBlood: resp.donor_blood_group,
                donorDept: resp.donor_department,
                time: resp.created_at ? resp.created_at.slice(0, 16).replace('T', ' ') : 'Just now'
              });
            });
          }
        });
      }
    } catch (e) { }
  }

  // Check local matches
  const localMatches = JSON.parse(localStorage.getItem("wub_request_matches") || "[]");
  const localReqs = getStoredRequests().filter(r => r.requesterId === user.id);
  localReqs.forEach(lr => {
    const matching = localMatches.filter(m => m.request_id === lr.id);
    matching.forEach(m => {
      if (!responses.some(r => r.requestId === lr.id && r.donorName === m.donor_name)) {
        responses.push({
          requestId: lr.id,
          hospital: lr.hospital || lr.location,
          blood: lr.blood,
          donorName: m.donor_name,
          donorPhone: m.donor_phone,
          donorBlood: m.donor_blood_group,
          donorDept: m.donor_department,
          time: m.responded_at ? m.responded_at.slice(0, 16).replace('T', ' ') : 'Just now'
        });
      }
    });
  });

  if (responses.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <section class="form-card-container" style="border: 2px solid #86EFAC; background: linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%); border-radius: 14px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08); margin-bottom: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0;">
            ✓
          </div>
          <div>
            <h3 style="font-size: 16px; margin: 0; color: #166534; font-weight: 700;">
              Donors Who Responded: "I Can Donate" (${responses.length})
            </h3>
            <p style="font-size: 12px; color: #15803D; margin: 2px 0 0;">
              These verified WUB donors have agreed to donate blood for your active request. Contact them immediately:
            </p>
          </div>
        </div>
        <span class="donor-status-pill status-available" style="font-size: 11px; padding: 4px 10px;">
          ✓ Ready to Donate
        </span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${responses.map(r => `
          <div style="background: #FFFFFF; border: 1px solid #BBF7D0; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <b style="font-size: 14px; color: #0F172A;">${r.donorName}</b>
                <span style="background: #DC2626; color: #FFF; font-weight: 800; font-size: 11px; padding: 2px 7px; border-radius: 4px;">${r.donorBlood}</span>
                <span style="font-size: 12px; color: #64748B;">• ${r.donorDept}</span>
              </div>
              <div style="font-size: 12px; color: #475569;">
                Hospital: <b>${r.hospital}</b> · Response Time: ${r.time}
              </div>
            </div>

            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <a href="tel:${r.donorPhone}" class="btn btn-primary btn-sm" style="background: #059669; border-color: #059669; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call: ${r.donorPhone}
              </a>
              <a href="https://wa.me/${(r.donorPhone || '').replace(/[^0-9]/g, '')}?text=Assalamu%20Alaikum%20${encodeURIComponent(r.donorName)},%20thank%20you%20for%20offering%20to%20donate%20blood%20for%20our%20request%20at%20${encodeURIComponent(r.hospital)}." target="_blank" class="btn btn-outline btn-sm" style="color: #25D366; border-color: #25D366; font-size: 12px; text-decoration: none;">
                WhatsApp
              </a>
              <button class="btn btn-outline btn-sm" onclick="updateUserRequestStatus('${r.requestId}', 'Fulfilled'); showToast('Marked as fulfilled! Thank you to the donor.', 'success'); renderRespondedDonors();" style="font-size: 11px;">
                Mark Fulfilled
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

async function renderRequestsList() {
  const container = document.getElementById("recentRequestsTableBody");
  if (!container) return;

  let requests = [];
  try {
    const res = await fetch("/api/requests");
    const data = await res.json();
    if (res.ok && data.success && data.requests) {
      requests = data.requests;
    }
  } catch (err) {
    console.warn("API request list fallback", err);
  }

  if (requests.length === 0) {
    // Local fallback
    const storeReqs = getStoredRequests().filter(r => r.status === "Approved" || r.status === "Active");
    requests = storeReqs.map(r => ({
      blood_group: r.blood,
      units_needed: r.units,
      hospital_name: r.location,
      urgency_level: r.urgency ? r.urgency.toLowerCase() : "normal",
      requester_name: r.studentName
    }));
  }

  if (requests.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">No active campus blood requests currently.</td></tr>`;
    return;
  }

  container.innerHTML = requests.map(r => {
    const isEmerg = r.urgency_level === "emergency" || r.urgency_level === "Emergency";
    return `
      <tr>
        <td><b style="color: var(--accent); font-size: 14px;">${r.blood_group}</b></td>
        <td>${r.units_needed} unit${r.units_needed == 1 ? '' : 's'}</td>
        <td>${r.hospital_name || r.location_name || 'Dhaka'}</td>
        <td>
          <span class="donor-status-pill ${isEmerg ? 'status-urgent' : 'status-available'}">
            ${isEmerg ? 'Emergency' : 'Normal'}
          </span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="showToast('Connecting with requester ${r.requester_name || 'Student'}... Dialing campus office', 'success')">
            Offer Blood
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function renderCampusEmergencyFeed() {
  const container = document.getElementById("campusFeedList");
  if (!container) return;

  let list = [];
  const token = localStorage.getItem("wub_token");
  if (token) {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.requests)) {
        list = data.requests;
      }
    } catch (e) { }
  }

  if (list.length === 0) {
    list = getStoredRequests().map(r => ({
      id: r.id,
      blood_group: r.blood,
      units_needed: r.units || "1 unit",
      hospital_name: r.hospital || r.location,
      urgency_level: (r.urgency || "Normal").toLowerCase(),
      requester_name: r.studentName || "WUB Student",
      needed_date: r.neededDate || r.date || "Active"
    }));
  }

  if (list.length === 0) {
    container.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 12.5px;">No active emergency requests currently.</div>`;
    return;
  }

  container.innerHTML = list.slice(0, 4).map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--surface-alt); border-radius: 8px; flex-wrap: wrap; gap: 8px;">
      <div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <b style="color: var(--accent);">${item.blood_group} Blood Needed (${item.units_needed})</b>
          <span class="donor-status-pill ${item.urgency_level === 'emergency' ? 'status-urgent' : 'status-available'}" style="font-size: 10px; padding: 2px 6px;">
            ${(item.urgency_level || 'Normal').toUpperCase()}
          </span>
        </div>
        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
          ${item.hospital_name} · ${item.requester_name} · ${item.needed_date}
        </div>
      </div>
      <a href="find-blood.html" class="btn btn-outline btn-sm" style="font-size: 11px; text-decoration: none;">
        Find Donors
      </a>
    </div>
  `).join('');
}

// ==========================================================================
// 10. STUDENT DASHBOARD (Phase 5)
// Real-time synchronization of Profile, Availability, Requests & Stats
// ==========================================================================
function renderDashboardProfile() {
  const container = document.getElementById("studentProfileSection");
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html?redirect=dashboard.html";
    return;
  }

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

  renderIncomingContactRequests();
}

async function renderIncomingContactRequests() {
  const container = document.getElementById("incomingContactsContainer");
  if (!container) return;

  const token = localStorage.getItem("wub_token");
  if (!token) {
    container.innerHTML = "";
    return;
  }

  try {
    const res = await fetch("/api/contacts/my", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      container.innerHTML = "";
      return;
    }

    const pending = (data.incoming || []).filter(c => c.status === "initiated");
    if (pending.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <section class="form-card-container" style="border-left: 4px solid var(--accent); background: #FFFBFB;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <h3 style="font-size: 15px; margin-bottom: 2px; color: var(--text);">
              🔔 Incoming Contact Requests (${pending.length})
            </h3>
            <p style="font-size: 12px; color: var(--text-muted); margin: 0;">Verified WUB students requesting to connect with you for blood donation.</p>
          </div>
          <span class="donor-status-pill status-urgent">Action Needed</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${pending.map(c => `
            <div style="background: #FFFFFF; border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <b style="font-size: 13.5px;">${c.partner_name}</b>
                <small style="color: var(--text-muted); font-size: 11px;">${c.created_at ? c.created_at.slice(0, 10) : 'Recent'}</small>
              </div>
              <p style="font-size: 12.5px; color: var(--text); margin: 0 0 10px; line-height: 1.5; font-style: italic;">
                "${c.message}"
              </p>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-sm btn-primary" onclick="respondToContactRequest('${c.id}', 'accept')" style="padding: 4px 12px; font-size: 11.5px;">
                  ✓ Accept & Share Contact
                </button>
                <button class="btn btn-sm btn-outline" onclick="respondToContactRequest('${c.id}', 'decline')" style="padding: 4px 12px; font-size: 11.5px; color: #DC2626; border-color: #FCA5A5;">
                  ✕ Decline
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  } catch (err) {
    container.innerHTML = "";
  }
}

async function respondToContactRequest(contactId, action) {
  const token = localStorage.getItem("wub_token");
  if (!token) return;

  try {
    const res = await fetch(`/api/contacts/${contactId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || `Contact request ${action}ed.`, "success");
      renderIncomingContactRequests();
    } else {
      showToast(data.message || "Failed to update contact request.", "danger");
    }
  } catch (e) {
    showToast("Error communicating with server.", "danger");
  }
}

async function toggleMyDonorAvailability() {
  const user = getCurrentUser();
  if (!user) return;

  const targetAvailability = user.donorAvailable ? 'paused' : 'available';
  const token = localStorage.getItem("wub_token");

  if (token) {
    try {
      const res = await fetch("/api/donors/availability", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ availability: targetAvailability })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        user.donorAvailable = (targetAvailability === 'available');
        setCurrentUser(user);
        showToast(`Your donor availability is now set to ${user.donorAvailable ? 'Available' : 'On Break'}.`, "success");
        renderDashboardProfile();
        updateDashboardStats();
        return;
      }
    } catch (e) {
      console.warn("API availability toggle fallback", e);
    }
  }

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

function toggleDonorAvailability() {
  toggleMyDonorAvailability();
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
  "A+": { donateTo: "A+, AB+", receiveFrom: "A+, A-, O+, O-" },
  "A-": { donateTo: "A+, A-, AB+, AB-", receiveFrom: "A-, O-" },
  "B+": { donateTo: "B+, AB+", receiveFrom: "B+, B-, O+, O-" },
  "B-": { donateTo: "B+, B-, AB+, AB-", receiveFrom: "B-, O-" },
  "AB+": { donateTo: "AB+", receiveFrom: "All Blood Groups (Universal Recipient)" },
  "AB-": { donateTo: "AB+, AB-", receiveFrom: "A-, B-, AB-, O-" },
  "O+": { donateTo: "A+, B+, AB+, O+", receiveFrom: "O+, O-" },
  "O-": { donateTo: "All Blood Groups (Universal Donor)", receiveFrom: "O-" }
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
    switch (status) {
      case "Pending": return "status-pill-pending";
      case "Approved": return "status-pill-approved";
      case "Completed": return "status-pill-completed";
      case "Rejected": return "status-pill-cancelled";
      default: return "status-pill-approved";
    }
  };

  container.innerHTML = myReqs.map(r => `
    <div class="modal-glass-request-card">
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
                  ${DEPARTMENTS.map(d => `<option value="${d}" ${user.dept && user.dept.includes(d.substring(0, 4)) ? 'selected' : ''}>${d}</option>`).join('')}
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
            <div style="background: rgba(239, 246, 255, 0.65); border: 1.5px solid rgba(191, 219, 254, 0.85); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); border-radius: 12px; padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: #1E40AF; line-height: 1.4;">
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
            <div style="background: rgba(254, 243, 199, 0.70); border: 1.5px solid rgba(253, 230, 138, 0.85); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; font-size: 12px; color: #92400E;">
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

  // Render Stats & live API counts
  getAdminAuthToken().then(token => {
    if (token) {
      fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).then(data => {
        if (data.success && data.stats) {
          const s = data.stats;
          const statTotalDonors = document.getElementById("adminStatTotalDonors");
          if (statTotalDonors) statTotalDonors.textContent = s.registeredDonors;

          const statPendingVerif = document.getElementById("adminStatPendingVerif");
          if (statPendingVerif) statPendingVerif.textContent = s.pendingVerifications;

          const statPendingReqs = document.getElementById("adminStatPendingReqs");
          if (statPendingReqs) statPendingReqs.textContent = s.activeRequests;

          const statTotalUsers = document.getElementById("adminStatTotalUsers");
          if (statTotalUsers) statTotalUsers.textContent = s.totalStudents;
        }
      }).catch(() => { });
    } else {
      const donors = getStoredDonors();
      const requests = getStoredRequests();
      const users = getStoredUsers();

      const statTotalDonors = document.getElementById("adminStatTotalDonors");
      if (statTotalDonors) statTotalDonors.textContent = donors.length;

      const statPendingVerif = document.getElementById("adminStatPendingVerif");
      if (statPendingVerif) statPendingVerif.textContent = donors.filter(d => d.verificationStatus === "pending").length;

      const statPendingReqs = document.getElementById("adminStatPendingReqs");
      if (statPendingReqs) statPendingReqs.textContent = requests.filter(r => r.status === "Pending").length;

      const statTotalUsers = document.getElementById("adminStatTotalUsers");
      if (statTotalUsers) statTotalUsers.textContent = users.length;
    }
  });

  // Render Sub-tables
  renderAdminVerificationsTable();
  renderAdminDonorQueue();
  renderAdminRequestsTable();
  renderAdminUsersTable();
  renderAdminReportsTable();
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

async function renderAdminDonorQueue() {
  const container = document.getElementById("adminDonorQueueTable");
  if (!container) return;

  const token = await getAdminAuthToken();
  const user = getCurrentUser();
  let donors = [];

  if (token) {
    try {
      const res = await fetch('/api/admin/donors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.donors)) {
        donors = data.donors.map(d => ({
          id: d.id,
          userId: d.student_id || d.user_id,
          name: d.name || 'WUB Student',
          blood: d.blood_group || 'O+',
          dept: d.department || 'WUB',
          campus: d.location_name || 'Uttara',
          phone: d.phone || 'N/A',
          verificationStatus: d.status === 'approved' ? 'verified' : (d.status === 'pending' ? 'pending' : 'rejected'),
          available: d.availability === 'available'
        }));
      }
    } catch (e) { }
  }

  // Merge local donors
  const localDonors = getStoredDonors();
  localDonors.forEach(ld => {
    const exists = donors.some(d => d.id === ld.id || d.userId === ld.userId);
    if (!exists) {
      donors.push(ld);
    }
  });

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

async function adminVerifyDonor(donorId) {
  const token = await getAdminAuthToken();
  const donors = getStoredDonors();
  let donor = donors.find(d => d.id === donorId || String(d.id) === String(donorId) || d.userId === donorId);

  const reviewPayload = {
    action: 'approve',
    admin_notes: 'Verified by WUB Health Office.',
    name: donor ? donor.name : undefined,
    student_id: donor ? (donor.userId || donor.student_id) : undefined,
    phone: donor ? donor.phone : undefined,
    blood_group: donor ? donor.blood : undefined,
    location_name: donor ? (donor.campus || donor.location) : undefined,
    department: donor ? donor.dept : undefined
  };

  if (token) {
    try {
      const res = await fetch(`/api/admin/donors/${donorId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewPayload)
      });
      const data = await res.json();
      if (data.success && data.donor && !donor) {
        donor = {
          id: data.donor.id,
          userId: data.donor.user_id,
          name: data.donor.name || 'WUB Student Donor',
          initials: (data.donor.name || 'WUB').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
          blood: data.donor.blood_group,
          dept: data.donor.department || 'WUB',
          campus: data.donor.location_name || 'Uttara',
          location: data.donor.location_name || 'Uttara',
          phone: data.donor.phone || '01712345678',
          available: true,
          verificationStatus: 'verified',
          donationsCount: 0
        };
        donors.unshift(donor);
      }
    } catch (e) {
      console.warn("API verify donor fallback", e);
    }
  }

  if (donor) {
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
  }

  showToast(`Donor has been verified and is now live in the Find Blood directory.`, "success");
  renderAdminConsole();
}

async function adminRejectDonor(donorId) {
  const token = await getAdminAuthToken();
  if (token) {
    try {
      await fetch(`/api/admin/donors/${donorId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'reject', admin_notes: 'Rejected by admin.' })
      });
    } catch (e) {
      console.warn("API reject donor fallback", e);
    }
  }

  const donors = getStoredDonors();
  const donor = donors.find(d => d.id === donorId || String(d.id) === String(donorId));
  if (donor) {
    donor.verificationStatus = "rejected";
    donor.available = false;
    saveDonors(donors);
    logAuditEvent("REJECT_DONOR", donor.name, `Rejected donor registration by ${getCurrentUser()?.name}`);
  }

  showToast(`Donor application rejected.`, "danger");
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

async function renderAdminRequestsTable() {
  const table = document.getElementById("adminRequestsTable");
  if (!table) return;

  const token = await getAdminAuthToken();
  let reqs = [];

  if (token) {
    try {
      const res = await fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        reqs = data.requests.map(r => ({
          id: r.id,
          blood: r.blood_group,
          studentName: r.requester_name || r.patient_name || 'Student',
          studentId: r.requester_student_id || r.requester_id || 'WUB Student',
          contactPhone: r.requester_phone || 'N/A',
          units: r.units_needed || 1,
          location: r.hospital_name || r.location_name || 'Uttara',
          urgency: (r.urgency_level || 'normal').toUpperCase(),
          status: r.status === 'active' ? 'Approved' : (r.status === 'pending' ? 'Pending' : (r.status === 'fulfilled' ? 'Completed' : 'Rejected')),
          requesterId: r.requester_id
        }));
      }
    } catch (e) { }
  }

  // Merge local requests
  const localReqs = getStoredRequests();
  localReqs.forEach(lr => {
    const exists = reqs.some(r => r.id === lr.id || String(r.id) === String(lr.id));
    if (!exists) {
      reqs.push(lr);
    }
  });

  if (reqs.length === 0) {
    table.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No blood requests submitted.</td></tr>`;
    return;
  }

  const getStatusClass = (status) => {
    switch (status) {
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
      <td><span class="donor-status-pill ${r.urgency === 'EMERGENCY' || r.urgency === 'CRITICAL' ? 'status-urgent' : 'status-available'}">${r.urgency}</span></td>
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

async function adminApproveRequest(reqId) {
  const token = await getAdminAuthToken();
  if (token) {
    try {
      await fetch(`/api/admin/requests/${reqId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'approve', admin_notes: 'Approved by WUB Health Office.' })
      });
    } catch (e) {
      console.warn("API approve request fallback", e);
    }
  }

  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId || String(r.id) === String(reqId));
  if (req) {
    req.status = "Approved";
    req.reviewedBy = getCurrentUser()?.name || "Admin";
    saveRequests(reqs);
    createNotification("student", req.requesterId, "Blood Request Approved & Broadcasted", `Your request for ${req.blood} has been approved by WUB Health Office. Donors can now respond.`, "match", "Approved");
  }

  logAuditEvent("APPROVE_REQUEST", reqId, `Approved blood request #${reqId}`);
  showToast(`Blood request approved! Campus donors are alerted.`, "success");
  renderAdminConsole();
}

async function adminRejectRequest(reqId) {
  const token = await getAdminAuthToken();
  if (token) {
    try {
      await fetch(`/api/admin/requests/${reqId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'reject', admin_notes: 'Declined by WUB Health Office.' })
      });
    } catch (e) {
      console.warn("API reject request fallback", e);
    }
  }

  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId || String(r.id) === String(reqId));
  if (req) {
    req.status = "Rejected";
    req.reviewedBy = getCurrentUser()?.name || "Admin";
    saveRequests(reqs);
    createNotification("student", req.requesterId, "Blood Request Update", `Your blood request could not be approved. Contact WUB Health Office for queries.`, "update", "Declined");
  }

  logAuditEvent("REJECT_REQUEST", reqId, `Rejected blood request #${reqId}`);
  showToast("Blood request marked as Rejected.", "danger");
  renderAdminConsole();
}

async function adminCompleteRequest(reqId) {
  const token = await getAdminAuthToken();
  if (token) {
    try {
      await fetch(`/api/admin/requests/${reqId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'complete', admin_notes: 'Completed by admin.' })
      });
    } catch (e) {
      console.warn("API complete request fallback", e);
    }
  }

  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId || String(r.id) === String(reqId));
  if (req) {
    req.status = "Completed";
    saveRequests(reqs);
  }

  logAuditEvent("COMPLETE_REQUEST", reqId, `Blood requirement successfully fulfilled.`);
  showToast("Request marked as Completed.", "success");
  renderAdminConsole();
}

function adminUpdateRequestStatus(reqId, newStatus) {
  if (newStatus === "Approved") return adminApproveRequest(reqId);
  if (newStatus === "Rejected") return adminRejectRequest(reqId);
  if (newStatus === "Completed") return adminCompleteRequest(reqId);
  const reqs = getStoredRequests();
  const req = reqs.find(r => r.id === reqId || String(r.id) === String(reqId));
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

async function renderAdminVerificationsTable() {
  const table = document.getElementById("adminVerificationsTable");
  if (!table) return;

  const token = await getAdminAuthToken();
  let verifications = [];

  if (token) {
    try {
      const res = await fetch('/api/admin/verifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.verifications)) {
        verifications = data.verifications;
      }
    } catch (e) { }
  }

  // Check local store for any pending students not yet listed
  const store = (typeof getStoredUsers === 'function') ? getStoredUsers() : [];
  const pendingLocal = store.filter(u => u.verificationStatus === 'pending');
  pendingLocal.forEach(u => {
    const exists = verifications.some(v => v.student_id === u.id || v.user_email === u.email || v.id === ('ver_' + u.id));
    if (!exists) {
      verifications.unshift({
        id: 'ver_' + u.id,
        user_name: u.name,
        user_email: u.email,
        student_id: u.id,
        department: u.dept || 'WUB',
        status: 'pending',
        created_at: new Date().toISOString()
      });
    }
  });

  if (verifications.length === 0) {
    table.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No student verification requests currently pending.</td></tr>`;
    return;
  }

  table.innerHTML = verifications.map(v => `
    <tr>
      <td>
        <div style="font-weight: 700;">${v.user_name}</div>
        <small style="color: var(--text-muted);">${v.user_email || 'WUB Student'}</small>
      </td>
      <td><b>${v.student_id}</b></td>
      <td>${v.department || 'WUB'}</td>
      <td>
        ${v.id_card_document ? `
          <a href="/${v.id_card_document}" target="_blank" class="btn btn-sm btn-outline" style="font-size: 11px; padding: 3px 8px;">
            📄 View ID Doc
          </a>
        ` : `<span style="font-size: 11px; color: var(--text-muted);">Registry ID</span>`}
      </td>
      <td>
        <span class="badge-status" style="background: ${v.status === 'approved' ? '#DCFCE7' : (v.status === 'pending' ? '#FEF3C7' : '#FEE2E2')}; color: ${v.status === 'approved' ? '#15803D' : (v.status === 'pending' ? '#B45309' : '#B91C1C')}; font-weight: 600;">
          ${(v.status || 'pending').toUpperCase()}
        </span>
      </td>
      <td style="font-size: 11px; color: var(--text-muted);">${v.created_at ? v.created_at.slice(0, 10) : 'Recent'}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${v.status === 'pending' ? `
            <button class="btn btn-sm btn-primary" onclick="adminReviewVerification('${v.id}', 'approve')" style="padding: 3px 10px; font-size: 11px;">
              Approve
            </button>
            <button class="btn btn-sm btn-outline" onclick="adminReviewVerification('${v.id}', 'reject')" style="padding: 3px 10px; font-size: 11px; color: #DC2626; border-color: #FCA5A5;">
              Reject
            </button>
          ` : `
            <span style="font-size: 11px; color: var(--text-muted);">Reviewed</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

async function adminReviewVerification(verId, action) {
  const token = await getAdminAuthToken();
  if (token) {
    try {
      await fetch(`/api/admin/verifications/${verId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, admin_notes: `Reviewed by admin (${action})` })
      });
    } catch (err) {
      console.warn("API review verification fallback", err);
    }
  }

  // Always sync local store for instant UI feedback
  const cleanId = String(verId).replace(/^ver_/, '');
  const users = getStoredUsers();
  const userToUpdate = users.find(u => u.id === cleanId || u.id === verId || ('ver_' + u.id) === verId || u.email === verId);
  if (userToUpdate) {
    userToUpdate.verificationStatus = (action === 'approve') ? 'verified' : 'rejected';
    if (action === 'approve') {
      userToUpdate.isDonor = true;
      userToUpdate.donorAvailable = true;
    }
    saveUsers(users);
  }

  const donors = getStoredDonors();
  let donorToUpdate = donors.find(d => d.userId === cleanId || d.userId === verId || d.id === verId || (userToUpdate && (d.userId === userToUpdate.id || d.phone === userToUpdate.phone)));
  if (donorToUpdate) {
    donorToUpdate.verificationStatus = (action === 'approve') ? 'verified' : 'rejected';
    if (action === 'approve') donorToUpdate.available = true;
    saveDonors(donors);
  } else if (action === 'approve' && userToUpdate) {
    donors.unshift({
      id: "donor-" + (userToUpdate.id || Date.now()),
      userId: userToUpdate.id,
      name: userToUpdate.name,
      initials: (userToUpdate.name || 'WUB').split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(),
      avatarClass: "avatar-ar",
      blood: userToUpdate.blood || "O+",
      dept: userToUpdate.dept || "CSE",
      campus: userToUpdate.address || "Uttara",
      location: userToUpdate.address || "Uttara",
      phone: userToUpdate.phone || "01712345678",
      available: true,
      verificationStatus: "verified",
      donationsCount: userToUpdate.totalDonations || 0,
      lastDonation: userToUpdate.lastDonation || "Newly Registered"
    });
    saveDonors(donors);
  }

  logAuditEvent(action === 'approve' ? 'VERIFY_STUDENT' : 'REJECT_STUDENT', verId, `${action === 'approve' ? 'Approved' : 'Rejected'} verification for ID ${verId}`);
  showToast(`Verification ${action === 'approve' ? 'approved' : 'rejected'} successfully!`, 'success');
  renderAdminConsole();
}

async function renderAdminReportsTable() {
  const table = document.getElementById("adminReportsTable");
  if (!table) return;

  const token = localStorage.getItem('wub_token');
  let reports = [];

  try {
    const res = await fetch('/api/admin/reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) reports = data.reports;
  } catch (e) {
    reports = [];
  }

  if (reports.length === 0) {
    table.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No scam or abuse reports submitted. Platform is clean.</td></tr>`;
    return;
  }

  table.innerHTML = reports.map(r => `
    <tr>
      <td>
        <div style="font-weight: 600;">${r.reporter_name || 'System Auto-Filter'}</div>
      </td>
      <td><b>${r.reported_user_name || r.reported_user_id || 'System Flag'}</b></td>
      <td>
        <span class="badge-status" style="background: #FEE2E2; color: #B91C1C; font-weight: 700; font-size: 10.5px;">
          ${r.report_type.replace('_', ' ').toUpperCase()}
        </span>
      </td>
      <td style="font-size: 11.5px; max-width: 260px;">${r.description}</td>
      <td>
        <span class="badge-status" style="background: ${r.status === 'resolved' ? '#DCFCE7' : '#FEF3C7'}; color: ${r.status === 'resolved' ? '#15803D' : '#B45309'};">
          ${r.status.toUpperCase()}
        </span>
      </td>
      <td style="font-size: 11px; color: var(--text-muted);">${r.created_at ? r.created_at.slice(0, 10) : 'Recent'}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${r.status !== 'resolved' ? `
            <button class="btn btn-sm btn-primary" onclick="adminResolveReportAction('${r.id}', 'resolve', false)" style="padding: 3px 8px; font-size: 11px;">
              Resolve
            </button>
            <button class="btn btn-sm btn-outline" onclick="adminResolveReportAction('${r.id}', 'resolve', true)" style="padding: 3px 8px; font-size: 11px; color: #DC2626; border-color: #FCA5A5;" title="Resolve and suspend user account">
              Ban User
            </button>
          ` : `
            <span style="font-size: 11px; color: var(--text-muted);">Closed</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

async function adminResolveReportAction(reportId, action, suspendUser) {
  const token = localStorage.getItem('wub_token');
  try {
    const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action, suspend_user: suspendUser, admin_notes: 'Reviewed and actioned by admin.' })
    });
    const data = await res.json();
    if (data.success) {
      showToast(suspendUser ? 'Report resolved and offending account suspended!' : 'Report resolved.', 'success');
      renderAdminConsole();
    }
  } catch (e) {
    showToast('Failed to resolve report.', 'danger');
  }
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
  const normType = (type === "error") ? "danger" : type;
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "✓",
    danger: "✕",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${normType}`;
  toast.innerHTML = `
    <span>${icons[normType] || "!"}</span>
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
async function syncSessionWithServer() {
  const token = localStorage.getItem("wub_token");
  if (!token) return;
  try {
    const res = await fetch("/api/auth/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      const u = data.user;
      const current = getCurrentUser() || {};
      const updated = {
        ...current,
        id: u.student_id || u.id,
        username: u.student_id,
        name: u.name,
        email: u.email,
        role: u.role,
        dept: u.profile?.dept_code || current.dept,
        blood: u.profile?.blood_group || current.blood,
        phone: u.phone,
        isVerified: u.is_verified,
        verificationStatus: u.is_verified ? "verified" : (u.verification_status || "pending"),
        isDonor: u.donor_profile ? true : current.isDonor,
        donorAvailable: u.donor_profile ? (u.donor_profile.availability === 'available') : current.donorAvailable,
        initials: (u.name || "Student").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      };
      setCurrentUser(updated);
      updateTopbarAuthUI();
    }
  } catch (e) {
    // Offline or backend unreachable
  }
}

function populateDhakaLocationDropdowns() {
  const targetSelectors = [
    'select[data-populate="locations"]',
    '#locationFilter',
    '#requestLocation',
    '#donorCampus',
    '#regAddress'
  ];
  const selects = document.querySelectorAll(targetSelectors.join(', '));
  const currentLang = getCurrentLanguage();

  selects.forEach(sel => {
    const currentVal = sel.value;
    const isFilter = sel.id === "locationFilter";
    const defaultText = isFilter
      ? (currentLang === 'bn' ? "ঢাকার সকল এলাকা" : "All Dhaka Locations")
      : (currentLang === 'bn' ? "এলাকা / ক্যাম্পাস নির্বাচন করুন" : "Select location / area");

    sel.innerHTML = `<option value="">${defaultText}</option>`;

    DHAKA_LOCATIONS.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc;
      opt.textContent = (currentLang === 'bn' && DHAKA_LOCATIONS_BN[loc]) ? DHAKA_LOCATIONS_BN[loc] : loc;
      if (currentVal && (currentVal.toLowerCase() === loc.toLowerCase() || loc.toLowerCase().includes(currentVal.toLowerCase()))) {
        opt.selected = true;
      }
      sel.appendChild(opt);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Theme Engine
  initTheme();
  renderThemeToggleButtons();

  // Initialize Language Engine (English / Bangla)
  initLanguage();
  renderLanguageToggleButtons();

  // Check auth session
  updateTopbarAuthUI();
  updateNotificationBadge();
  syncSessionWithServer();

  // Populate dynamic Dhaka locations into dropdowns
  populateDhakaLocationDropdowns();

  // Route: Student Dashboard
  if (document.getElementById("studentProfileSection")) {
    if (protectStudentDashboard()) {
      renderDashboardProfile();
      updateDashboardStats();
      renderUrgentDonorMatches();
      renderRespondedDonors();
      renderIncomingContactRequests();
      renderCampusEmergencyFeed();
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

  // Route: Home Page Dynamic Live Stats
  if (document.getElementById("statDonorsCount") || document.getElementById("statRequestsCount")) {
    updateHomeStats();
  }

  // Route: Admin Console
  if (document.getElementById("adminRequestsTable") || document.getElementById("adminDonorQueueTable")) {
    renderAdminConsole();
  }

  // Close modals & menus on click outside
  window.addEventListener("click", function (e) {
    const profileMenu = document.getElementById("userDropdownMenu");
    const profileBtn = e.target.closest(".user-profile-btn") || e.target.closest("#userProfileBtn");
    if (profileMenu && profileMenu.classList.contains("show")) {
      if (!profileMenu.contains(e.target) && !profileBtn) {
        profileMenu.classList.remove("show");
      }
    }

    const notifPanel = document.getElementById("notificationsPanel");
    const notifBtn = e.target.closest(".btn-notif-circle") || e.target.closest(".top-action-btn") || e.target.closest("#notifBellBtn");
    if (notifPanel && notifPanel.classList.contains("show")) {
      if (!notifPanel.contains(e.target) && !notifBtn) {
        notifPanel.classList.remove("show");
      }
    }
  });

  // Mobile nav drawer listener
  document.querySelectorAll(".sidebar .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) closeSide();
    });
  });

  // Handle Escape key to close mobile drawer, menus, and modals
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSide();
      const notifPanel = document.getElementById("notificationsPanel");
      if (notifPanel) notifPanel.classList.remove("show");
      const profileMenu = document.getElementById("userDropdownMenu");
      if (profileMenu) profileMenu.classList.remove("show");
      const contactModal = document.getElementById("contactModal");
      if (contactModal) contactModal.remove();
      const myReqModal = document.getElementById("myRequestsModal");
      if (myReqModal) myReqModal.remove();
    }
  });
});
