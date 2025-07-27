const fs = require('fs');
const path = require('path');

// Path to the messages directory
const messagesDir = path.join(__dirname, '..', 'messages');

// Get all JSON files in the messages directory
const translationFiles = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));
console.log(`Found ${translationFiles.length} translation files: ${translationFiles.join(', ')}`);

// Use English as the reference file
const referenceFile = path.join(messagesDir, 'en.json');
const reference = JSON.parse(fs.readFileSync(referenceFile, 'utf8'));

/**
 * Recursively check that all keys in the reference object exist in the check object
 * and that all keys in the check object exist in the reference object
 */
function checkKeys(refObj, checkObj, path = '', errors = []) {
  // Check that all keys in the reference object exist in the check object
  for (const key of Object.keys(refObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (!(key in checkObj)) {
      errors.push(`Missing key: ${currentPath}`);
      continue;
    }
    
    // If the value is an object, recursively check its keys
    if (typeof refObj[key] === 'object' && refObj[key] !== null) {
      checkKeys(refObj[key], checkObj[key], currentPath, errors);
    }
  }
  
  // Check that all keys in the check object exist in the reference object
  for (const key of Object.keys(checkObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (!(key in refObj)) {
      errors.push(`Extra key: ${currentPath}`);
    }
  }
  
  return errors;
}

// Check each translation file against the reference file
let hasErrors = false;
for (const file of translationFiles) {
  // Skip the reference file
  if (file === 'en.json') continue;
  
  const filePath = path.join(messagesDir, file);
  const translation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const errors = checkKeys(reference, translation);
  
  if (errors.length > 0) {
    hasErrors = true;
    console.error(`\nErrors in ${file}:`);
    errors.forEach(error => console.error(`  - ${error}`));
  } else {
    console.log(`✓ ${file} is valid`);
  }
}

if (hasErrors) {
  console.error('\nValidation failed. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('\nAll translation files are valid!');
} 