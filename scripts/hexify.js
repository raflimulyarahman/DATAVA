// hexify.js - Convert string to hex for Move contract parameters

function stringToHex(str) {
  return Buffer.from(str, 'utf8').toString('hex');
}

function hexToString(hex) {
  return Buffer.from(hex, 'hex').toString('utf8');
}

// If running as script
if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.log('Usage: node hexify.js "string to convert"');
    process.exit(1);
  }
  
  console.log('Input:', input);
  console.log('Hex:', stringToHex(input));
}

module.exports = { stringToHex, hexToString };