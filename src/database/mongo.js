const dns = require('dns');
try {
  // Use public DNS to ensure robust SRV resolution on Windows
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS override errors
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config/env');

let client = null;
let db = null;
let isConnected = false;

async function connectMongo() {
  if (!config.MONGODB_URI) {
    console.log('ℹ [MongoDB] No MONGODB_URI found in environment.');
    return { isConnected: false };
  }

  try {
    console.log('Connecting to MongoDB Atlas cluster...');
    client = new MongoClient(config.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 6000,
      socketTimeoutMS: 12000,
    });

    await client.connect();
    db = client.db(config.MONGODB_DBNAME || 'wub_bloodcare');
    
    // Ping to verify active connection
    await db.command({ ping: 1 });
    isConnected = true;
    console.log(`✔ [MongoDB] Connected successfully to Atlas database: "${config.MONGODB_DBNAME}"`);
    return { isConnected: true, db, client };
  } catch (err) {
    isConnected = false;
    console.error(`✖ [MongoDB] Connection error: ${err.message}`);
    return { isConnected: false, error: err };
  }
}

function getDb() {
  return db;
}

function getClient() {
  return client;
}

function isMongoConnected() {
  return isConnected;
}

module.exports = {
  connectMongo,
  getDb,
  getClient,
  isMongoConnected
};
