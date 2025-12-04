/**
 * Ticket Store - In-Memory Storage
 * 
 * This module manages the lifecycle of CAS Service Tickets (ST) using in-memory Map.
 * Tickets are stored temporarily with automatic expiration (TTL 60 seconds).
 * 
 * Simple and efficient for small-scale deployments:
 * - No external dependencies (Redis)
 * - Fast in-memory operations
 * - Automatic cleanup with setTimeout
 * - Suitable for single-server deployments
 */

// In-memory ticket storage: Map<ticket, {userId, expires}>
const ticketStore = new Map();

const TICKET_PREFIX = 'ST-';
const TICKET_TTL = 60000; // 60 seconds in milliseconds

/**
 * Generate a random ticket ID
 * @returns {string} - Ticket ID with ST- prefix
 */
function generateTicket() {
  return TICKET_PREFIX + 
    Math.random().toString(36).substring(2, 10) + 
    Date.now().toString(36);
}

/**
 * Create a new service ticket and store in memory
 * @param {string} userId - User ID associated with the ticket
 * @returns {Promise<string>} - Generated ticket ID
 */
async function createTicket(userId) {
  const ticket = generateTicket();
  const expires = Date.now() + TICKET_TTL;
  
  // Store ticket in Map with expiration timestamp
  ticketStore.set(ticket, { userId, expires });

  // Auto-cleanup: Remove ticket after TTL expires
  setTimeout(() => {
    if (ticketStore.has(ticket)) {
      ticketStore.delete(ticket);
      console.log(`[TICKET EXPIRED] ${ticket} - Auto-deleted after ${TICKET_TTL/1000}s`);
    }
  }, TICKET_TTL);

  console.log(`[TICKET CREATED] ${ticket} for user ${userId} (TTL: ${TICKET_TTL/1000}s)`);
  return ticket;
}

/**
 * Validate and consume a service ticket (one-time use)
 * @param {string} ticket - Ticket ID to validate
 * @returns {Promise<string|null>} - User ID if valid, null otherwise
 */
async function validateTicket(ticket) {
  // Retrieve ticket from Map
  const ticketData = ticketStore.get(ticket);
  
  if (!ticketData) {
    console.log(`[TICKET INVALID] ${ticket} - Not found`);
    return null;
  }

  // Check if ticket has expired
  if (Date.now() > ticketData.expires) {
    ticketStore.delete(ticket);
    console.log(`[TICKET EXPIRED] ${ticket} - Expired`);
    return null;
  }

  // CRITICAL: Immediately delete ticket after retrieval (one-time use)
  // This prevents replay attacks where the same ticket is used multiple times
  ticketStore.delete(ticket);

  console.log(`[TICKET VALID] ${ticket} for user ${ticketData.userId} (consumed and deleted)`);
  return ticketData.userId;
}

/**
 * Invalidate (delete) a ticket manually
 * Used for explicit cleanup or logout scenarios
 * @param {string} ticket - Ticket ID to invalidate
 * @returns {Promise<boolean>} - true if ticket existed and was deleted
 */
async function invalidateTicket(ticket) {
  const existed = ticketStore.has(ticket);
  if (existed) {
    ticketStore.delete(ticket);
    console.log(`[TICKET INVALIDATED] ${ticket}`);
    return true;
  }
  return false;
}

module.exports = { createTicket, validateTicket, invalidateTicket };
