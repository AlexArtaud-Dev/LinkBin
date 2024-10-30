// scripts/cleanupScheduler.js

// Load environment variables from .env file
require('dotenv').config();

const axios = require('axios');
const cron = require('node-cron');

// Environment Variables
const API_URL = process.env.CLEANER_API_URL || 'http://localhost:3000/api/jobs/cleaner';
const API_KEY = process.env.CLEANER_API_KEY;

// Validate Environment Variables
if (!API_KEY) {
  console.error('❌ ERROR: CLEANER_API_KEY is not defined in .env');
  process.exit(1);
}

if (!API_URL) {
  console.error('❌ ERROR: CLEANER_API_URL is not defined in .env');
  process.exit(1);
}

/**
 * Function to trigger the cleanup API endpoint
 */
async function triggerCleanup() {
  try {
    console.log(`[${new Date().toISOString()}] 🚀 Triggering cleanup job.`);
    await axios.post(API_URL, {}, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });
    console.log(`[${new Date().toISOString()}] ✅ Cleanup successful !`);
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(`[${new Date().toISOString()}] ❌ Cleanup failed: ${error.response.status} - ${error.response.data.error}`);
    } else if (error.request) {
      // No response received
      console.error(`[${new Date().toISOString()}] ❌ Cleanup failed: No response received from the server.`);
    } else {
      // Other errors
      console.error(`[${new Date().toISOString()}] ❌ Cleanup failed: ${error.message}`);
    }
  }
}

/**
 * Function to start the cron job
 */
function startScheduler() {
  // Schedule the task to run every 5 minutes
  cron.schedule('*/1 * * * *', () => {
    console.log(`[${new Date().toISOString()}] 🔄 Triggering cleanup job.`);
    triggerCleanup();
  });

  console.log('🕒 Cleanup scheduler started. Running every 1 minutes.');
}

/**
 * Handle unexpected errors to prevent the script from crashing
 */
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Optionally, you can implement a retry mechanism or other recovery steps here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, you can implement a retry mechanism or other recovery steps here
});

// Start the scheduler
setTimeout(() => {
  console.log('🚀 Starting cleanup scheduler...');
  startScheduler();
}, 3000);

