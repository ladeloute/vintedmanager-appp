// Keep alive script pour maintenir l'app active
const https = require('https');

// Ping l'application toutes les 5 minutes pour la maintenir active
setInterval(() => {
  const url = process.env.REPL_URL || 'https://your-repl-url.replit.dev';
  
  https.get(url, (res) => {
    console.log(`Keep alive ping: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log('Keep alive error:', err.message);
  });
}, 5 * 60 * 1000); // 5 minutes

console.log('Keep alive service started');