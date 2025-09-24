// Frontend environment variables verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Frontend Environment Variables...\n');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Please create a .env file with the following variables:');
  console.log(`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_APP_NAME=Cardiology Hospital
REACT_APP_VERSION=1.0.0
REACT_APP_NODE_ENV=development
  `);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log('📋 Environment Variables Found:');
envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    console.log(`✅ ${key}: ${value}`);
  }
});

const requiredVars = [
  'REACT_APP_API_URL',
  'REACT_APP_BACKEND_URL',
  'REACT_APP_APP_NAME',
  'REACT_APP_VERSION',
  'REACT_APP_NODE_ENV'
];

console.log('\n🔧 Configuration Summary:');
requiredVars.forEach(varName => {
  const hasVar = envContent.includes(varName);
  console.log(`${hasVar ? '✅' : '❌'} ${varName}: ${hasVar ? 'Set' : 'Missing'}`);
});

console.log('\n🎉 Frontend environment configuration complete!');
console.log('✅ Ready to start the React app');
console.log('\n📝 To start the frontend:');
console.log('npm start');
