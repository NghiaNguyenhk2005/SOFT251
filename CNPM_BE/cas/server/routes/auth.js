/**
 * Auth routes implementing CAS-like flows (Phase 1)
 * - POST /login  -> authenticates user, creates session, issues a Service Ticket (ST)
 * - POST /validate -> validates a ticket server-to-server and returns user info
 * - GET /check-session -> quick check whether the browser session is logged in
 * - POST /logout -> destroy the session
 *
 * Note: In this phase tickets are stored in-memory and are short-lived and one-time-use.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user.model');
const { createTicket, validateTicket, invalidateTicket } = require('../ticketStore');

// GET /auth/login
// Serves the login form HTML page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// POST /auth/login
// Body: { username, password, service }
// On success: creates session and returns a redirect URL with `?ticket=ST-...`.
router.post('/login', async (req, res) => {
  const { username, password, service } = req.body;
  if (!username || !password || !service) {
    return res.status(400).json({ success: false, message: 'username, password and service are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Create server-side session (browser will hold session cookie)
    req.session.user = { id: user._id.toString(), username: user.username, email: user.email };

    // Issue a one-time Service Ticket (ST)
    const ticket = await createTicket(user._id.toString());

    // Build redirect URL for the service, appending the ticket as query param
    try {
      const redirectUrl = new URL(service);
      redirectUrl.searchParams.set('ticket', ticket);
      return res.json({ success: true, redirectUrl: redirectUrl.toString() });
    } catch (err) {
      // service param is not a valid URL
      return res.status(400).json({ success: false, message: 'Invalid service URL' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /auth/validate
// Body: { ticket, service }
// This is a server-to-server call: the client service will call CAS to validate the ticket.
router.post('/validate', async (req, res) => {
  const { ticket, service } = req.body;
  if (!ticket || !service) return res.status(400).json({ success: false, message: 'ticket and service are required' });

  // Validate the ticket (Redis store)
  const userId = await validateTicket(ticket);
  if (!userId) return res.json({ success: false });

  // Note: validateTicket() already deletes the ticket (one-time use)
  // No need to call invalidateTicket separately

  try {
    const user = await User.findById(userId).select('_id username email');
    if (!user) return res.json({ success: false });
    return res.json({ success: true, user: { id: user._id.toString(), username: user.username, email: user.email } });
  } catch (err) {
    console.error('Validate error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /auth/check-session
// Returns whether the current session (cookie) is logged in.
router.get('/check-session', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
});

module.exports = router;
