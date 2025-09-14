#!/usr/bin/env node

/**
 * Cleanup script for orphaned reports without user_id
 * This script should be run after the user_id column is added to the reports table
 * to clean up any reports that don't belong to any user.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

const dbFile = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbFile);
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

async function cleanupOrphanedReports() {
  try {
    console.log('Starting cleanup of orphaned reports...');
    
    // Check if user_id column exists
    const tableInfo = await dbAll(`PRAGMA table_info(reports)`);
    const hasUserId = tableInfo.some(col => col.name === 'user_id');
    
    if (!hasUserId) {
      console.log('user_id column does not exist in reports table. Please run the server first to add the column.');
      return;
    }
    
    // Find reports without user_id
    const orphanedReports = await dbAll(`
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
      const result = await dbRun(`
        DELETE FROM reports 
        WHERE user_id IS NULL OR user_id = ''
      `);
      
      console.log(`Deleted ${orphanedReports.length} orphaned reports.`);
    } else {
      console.log('Cleanup cancelled.');
    }
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    db.close();
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupOrphanedReports();
}

module.exports = { cleanupOrphanedReports };
