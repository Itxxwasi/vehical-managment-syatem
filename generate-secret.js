import crypto from 'crypto';

// Generate a random 32-byte base64 string for NEXTAUTH_SECRET
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n===========================================');
console.log('Generated NEXTAUTH_SECRET:');
console.log('===========================================');
console.log(secret);
console.log('===========================================\n');
console.log('Copy this value and use it in your environment variables:');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('\nFor Heroku, run:');
console.log(`heroku config:set NEXTAUTH_SECRET="${secret}"`);
console.log('\n');
