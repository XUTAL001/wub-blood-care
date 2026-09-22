-- ==========================================================================
-- WUB BloodConnect - Production PostgreSQL Database Schema
-- World University of Bangladesh (WUB)
-- ==========================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL,
    is_campus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table (Core Auth & Account)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin', 'super_admin')),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'rejected', 'deactivated')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. User Profiles Table (Extended details)
CREATE TABLE IF NOT EXISTS profiles (
    user_id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    blood_group VARCHAR(10),
    dept_code VARCHAR(20) REFERENCES departments(code) ON UPDATE CASCADE,
    location_name VARCHAR(120),
    bio TEXT,
    donor_status VARCHAR(30) DEFAULT 'not_applied' CHECK (donor_status IN ('not_applied', 'pending', 'approved', 'rejected', 'suspended')),
    availability VARCHAR(30) DEFAULT 'available' CHECK (availability IN ('available', 'unavailable')),
    last_donation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Student Verification Requests Table
CREATE TABLE IF NOT EXISTS verification_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    id_card_document TEXT,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by VARCHAR(50) REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Donor Profiles Table
CREATE TABLE IF NOT EXISTS donor_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blood_group VARCHAR(10) NOT NULL,
    location_name VARCHAR(120) NOT NULL,
    availability VARCHAR(30) DEFAULT 'available' CHECK (availability IN ('available', 'unavailable')),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    donation_count INT DEFAULT 0,
    last_donation_date DATE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Blood Requests Table
CREATE TABLE IF NOT EXISTS blood_requests (
    id VARCHAR(50) PRIMARY KEY,
    requester_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_name VARCHAR(120) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    units_needed INT DEFAULT 1,
    needed_date DATE NOT NULL,
    needed_time VARCHAR(30) NOT NULL,
    hospital_name VARCHAR(200) NOT NULL,
    location_name VARCHAR(120) NOT NULL,
    urgency_level VARCHAR(30) DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'emergency')),
    reason TEXT,
    additional_notes TEXT,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'matched', 'contacted', 'fulfilled', 'cancelled', 'expired', 'rejected')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Request Matches Table
CREATE TABLE IF NOT EXISTS request_matches (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    donor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_score INT DEFAULT 100,
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Contact Requests Table
CREATE TABLE IF NOT EXISTS contact_requests (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) REFERENCES blood_requests(id) ON DELETE SET NULL,
    requester_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    donor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'initiated' CHECK (status IN ('initiated', 'accepted', 'declined', 'completed')),
    message TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    reference_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Reports Table (Anti-Scam & Misuse)
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    reporter_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    reported_request_id VARCHAR(50) REFERENCES blood_requests(id) ON DELETE SET NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('commercial_selling', 'fake_request', 'spam', 'harassment', 'other')),
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    admin_notes TEXT,
    resolved_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit Logs Table (Administrative actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    actor_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(80) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_donor_blood_group ON donor_profiles(blood_group);
CREATE INDEX IF NOT EXISTS idx_donor_status_avail ON donor_profiles(status, availability);
CREATE INDEX IF NOT EXISTS idx_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_blood ON blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
