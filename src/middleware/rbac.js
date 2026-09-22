/**
 * WUB BloodConnect - Role-Based Access Control (RBAC)
 */

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // super_admin always has access
    if (req.user.role === 'super_admin') {
      return next();
    }

    // admin has access to moderator/admin tasks
    if (req.user.role === 'admin' && (allowedRoles.includes('admin') || allowedRoles.includes('moderator') || allowedRoles.includes('student'))) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to perform this action.'
      });
    }

    next();
  };
}

function requireVerified(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  // Admins and Super Admins bypass verification check
  if (['admin', 'super_admin'].includes(req.user.role)) {
    return next();
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Verified WUB student status required. Please submit your WUB Student ID for verification.',
      verificationRequired: true
    });
  }

  next();
}

module.exports = {
  requireRole,
  requireVerified
};
