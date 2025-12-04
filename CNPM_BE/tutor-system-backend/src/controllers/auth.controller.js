/**
 * CONTROLLER: AuthController
 * FILE: auth.controller.js
 * MỤC ĐÍCH: Xử lý HTTP requests liên quan đến Authentication (UC-01, UC-02, UC-04)
 * 
 * USE CASES:
 * - UC-01: Login via SSO HCMUT
 * - UC-02: Logout
 * - UC-04: Auto-sync DATACORE on login (BR-007)
 * 
 * DEPENDENCIES:
 * - AuthService: Handle authentication logic
 * - DatacoreService: Sync user data from DATACORE
 */

// ============================================================
// FUNCTION: login()
// ============================================================
// METHOD: GET /api/v1/auth/login
// PURPOSE: Redirect user to SSO HCMUT login page
// 
// REQUEST:
// - No body (just redirect)
// 
// PROCESS:
// 1. Generate SSO login URL (from SSOConfig)
// 2. Redirect user to SSO portal
// 
// RESPONSE:
// - 302 Redirect to SSO_LOGIN_URL

// ============================================================
// FUNCTION: handleCallback()
// ============================================================
// METHOD: GET /api/v1/auth/callback
// PURPOSE: Handle callback từ SSO HCMUT sau khi login (UC-01, UC-04)
// 
// REQUEST:
// - Query params: { ticket: 'ST-xxxxx' }
// 
// PROCESS:
// 1. Validate ticket với SSO HCMUT (AuthService)
// 2. Extract user info from SSO response (email, mssv/maCB, fullName, faculty)
// 3. ⚠️ BR-007: Sync data from DATACORE (DatacoreService)
//    - Nếu mssv/maCB exists → Sync profile từ DATACORE
//    - Create/Update User model
//    - Create/Update Student/Tutor model (if applicable)
// 4. Generate JWT token (AuthService)
// 5. Set JWT in HTTP-only cookie
// 6. Redirect to frontend dashboard
// 
// RESPONSE:
// - 302 Redirect to FRONTEND_URL with JWT cookie
// 
// ERROR HANDLING:
// - Invalid ticket → 401 Unauthorized
// - DATACORE sync failure → 500 Internal Server Error
// - Missing required fields → 400 Bad Request

// ============================================================
// FUNCTION: logout()
// ============================================================
// METHOD: POST /api/v1/auth/logout
// PURPOSE: Logout user (UC-02)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Clear JWT cookie
// 2. (Optional) Blacklist JWT token (if using token blacklist)
// 3. Return success response
// 
// RESPONSE:
// {
//   "success": true,
//   "message": "Logged out successfully"
// }

// ============================================================
// FUNCTION: getCurrentUser()
// ============================================================
// METHOD: GET /api/v1/auth/me
// PURPOSE: Get current logged-in user info (UC-03)
// 
// REQUEST:
// - Headers: { Authorization: 'Bearer <JWT>' }
// 
// PROCESS:
// 1. Extract userId from JWT (via authMiddleware)
// 2. Query User model (populate Student/Tutor if applicable)
// 3. Return user profile
// 
// RESPONSE:
// {
//   "success": true,
//   "data": {
//     "userId": "...",
//     "email": "user@hcmut.edu.vn",
//     "fullName": "Nguyen Van A",
//     "role": "STUDENT",
//     "status": "ACTIVE",
//     "student": {
//       "mssv": "2210001",
//       "major": "Computer Science",
//       "gpa": 3.5
//     }
//   }
// }

import * as AuthService from '../services/auth/AuthService.js';
import * as UserService from '../services/user/UserService.js';
import CASService from '../services/auth/CASService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import ssoConfig from '../config/sso.config.js';
import casConfig from '../config/cas.config.js';
import jwt from 'jsonwebtoken';

const { SSO_LOGIN_URL, SSO_SERVICE_URL } = ssoConfig;

class AuthController {
  /**
   * GET /api/v1/auth/login
   * Redirect user to SSO HCMUT login page
   */
  login = asyncHandler(async (req, res) => {
    const serviceUrl = SSO_SERVICE_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/callback`;
    const loginUrl = `${SSO_LOGIN_URL}?service=${encodeURIComponent(serviceUrl)}`;
    
    res.redirect(loginUrl);
  });

  /**
   * GET /api/v1/auth/callback
   * Handle callback from SSO HCMUT (UC-01, UC-04)
   */
  handleCallback = asyncHandler(async (req, res) => {
    const { ticket } = req.query;
    const service = SSO_SERVICE_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/callback`;

    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: 'Missing SSO ticket'
      });
    }

    // Call AuthService to handle login flow
    const result = await AuthService.login(ticket, service);

    // Set JWT in HTTP-only cookie
    res.cookie('jwt', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Return JSON response (or redirect to frontend)
    res.status(200).json({
      success: true,
      data: result.user,
      token: result.token,
      message: 'Login successful'
    });
  });

  /**
   * POST /api/v1/auth/logout
   * Logout user (UC-02)
   */
  logout = asyncHandler(async (req, res) => {
    // Clear JWT cookie
    res.clearCookie('jwt');

    const result = await AuthService.logout();

    res.status(200).json(result);
  });

  /**
   * GET /api/v1/auth/me
   * Get current logged-in user info (UC-03)
   */
  getCurrentUser = asyncHandler(async (req, res) => {
    // userId is attached by authMiddleware
    const userId = req.userId;

    const user = await UserService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        mssv: user.mssv,
        maCB: user.maCB,
        student: user.student || null,
        tutor: user.tutor || null
      }
    });
  });

  /**
   * GET /api/v1/auth/cas/login
   * Redirect to CAS login page
   */
  casLogin = asyncHandler(async (req, res) => {
    const serviceUrl = casConfig.serviceUrl || `${req.protocol}://${req.get('host')}/api/v1/auth/cas/callback`;
    const casLoginUrl = CASService.generateLoginUrl(serviceUrl);
    
    res.redirect(casLoginUrl);
  });

  /**
   * GET /api/v1/auth/cas/callback
   * Handle CAS callback and validate ticket
   */
  casCallback = asyncHandler(async (req, res) => {
    const { ticket } = req.query;
    const serviceUrl = casConfig.serviceUrl || `${req.protocol}://${req.get('host')}/api/v1/auth/cas/callback`;

    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: 'Missing CAS ticket'
      });
    }

    // Validate ticket with CAS server
    const casUser = await CASService.validateTicket(ticket, serviceUrl);

    // Sync user data and generate JWT
    const result = await AuthService.loginWithCAS(casUser);

    // Set JWT in HTTP-only cookie
    res.cookie('jwt', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend or return JSON
    if (casConfig.frontendUrl) {
      res.redirect(`${casConfig.frontendUrl}?token=${result.token}`);
    } else {
      res.status(200).json({
        success: true,
        data: result.user,
        token: result.token,
        message: 'CAS login successful'
      });
    }
  });
}

export default new AuthController();

