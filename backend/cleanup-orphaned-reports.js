#!/usr/bin/env node

/**
 * Cleanup script for orphaned reports without user_id
 * This script should be run after the user_id column is added to the reports table
 * to clean up any reports that don't belong to any user.
 */

const mysql = require('mysql2/promise');
const path = require('path');

// MySQL database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pitchlense',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  socketPath: process.env.INSTANCE_UNIX_SOCKET || null,
};

let db;

async function cleanupOrphanedReports() {
  try {
    console.log('Starting cleanup of orphaned reports...');
    
    // Remove socketPath if not set
    if (!dbConfig.socketPath) {
      delete dbConfig.socketPath;
    }
    
    // Connect to MySQL database
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
    
    // Check if user_id column exists
    const [tableInfo] = await db.execute(`DESCRIBE reports`);
    const hasUserId = tableInfo.some(col => col.Field === 'user_id');
    
    if (!hasUserId) {
      console.log('user_id column does not exist in reports table. Please run the server first to add the column.');
      return;
    }
    
    // Find reports without user_id
    const [orphanedReports] = await db.execute(`
      SELECT report_id, report_name, startup_name, created_at 
      FROM reports 
      WHERE user_id IS NULL OR user_id = ''
    `);
    
    if (orphanedReports.length === 0) {
      console.log('No orphaned reports found.');
      return;
    }
    
    console.log(`Found ${orphanedReports.length} orphaned reports:`);
    orphanedReports.forEach(report => {
      console.log(`- ${report.report_name} (${report.startup_name}) - ${report.created_at}`);
    });
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('Do you want to delete these orphaned reports? (y/N): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      // Delete orphaned reports
      const [result] = await db.execute(`
        DELETE FROM reports 
        WHERE user_id IS NULL OR user_id = ''
      `);
      
      console.log(`Deleted ${result.affectedRows} orphaned reports.`);
    } else {
      console.log('Cleanup cancelled.');
    }
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    if (db) {
      await db.end();
      console.log('📊 Database connection closed');
    }
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupOrphanedReports();
}

module.exports = { cleanupOrphanedReports };
