const fs = require('fs-extra');
const path = require('path');

// Define the source and backup paths
const sourcePath = path.resolve(__dirname, '..', 'android', 'app', 'google-services.json'); // Adjust the path as needed
const backupPath = path.resolve(__dirname, '..', 'prebuild_backup', 'google-services.json'); // Adjust the path as needed

// Copy the google-services.json file to the backup location
fs.copyFileSync(sourcePath, backupPath);
console.log('google-services.json backed up successfully.');
