const fs = require('fs-extra');
const path = require('path');

// Define the source and target paths
const backupPath = path.resolve(__dirname, '..', 'prebuild_backup', 'google-services.json'); // Adjust the path as needed
const targetPath = path.resolve(__dirname, '..', 'android', 'app', 'google-services.json'); // Adjust the path as needed

// Check if the backup file exists
if (fs.existsSync(backupPath)) {
  // Copy the backup file back to its original location
  fs.copyFileSync(backupPath, targetPath);
  console.log('google-services.json restored successfully.');
} else {
  console.error('Backup file not found. Cannot restore google-services.json.');
}
