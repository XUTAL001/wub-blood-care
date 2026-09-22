/**
 * WUB BloodConnect - Server Entry Point
 * World University of Bangladesh
 */

const app = require('./app');
const config = require('./config/env');
const db = require('./database/db');

async function startServer() {
  try {
    console.log('----------------------------------------------------');
    console.log('🔴 WUB BloodConnect — Student Blood Donation Platform');
    console.log('🏢 World University of Bangladesh');
    console.log('----------------------------------------------------');

    // Initialize Database
    await db.initDb();

    // Start Express server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 [SERVER] Application running at: http://localhost:${config.PORT}`);
      console.log(`🌐 [API] REST API endpoints available under: http://localhost:${config.PORT}/api/`);
      console.log(`🩺 [HEALTH] Health check: http://localhost:${config.PORT}/api/health`);
    });

    return server;
  } catch (err) {
    console.error('❌ [FATAL] Failed to start WUB BloodConnect server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = startServer;
