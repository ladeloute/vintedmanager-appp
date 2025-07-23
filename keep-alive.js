// Keep alive script pour maintenir l'app active
const https = require('https');

// URL de votre app Replit
const REPL_URL = 'https://e8c39cc9-cf2c-4307-b459-339a185d3aa2-00-2fom0j0gq2vvu.picard.repl.co';

// Ping l'application toutes les 3 minutes pour la maintenir active
setInterval(() => {
  https.get(`${REPL_URL}/ping`, (res) => {
    console.log(`Keep alive ping: ${res.statusCode} - ${new Date().toLocaleTimeString()}`);
  }).on('error', (err) => {
    console.log('Keep alive error:', err.message);
    // Retry after 30 seconds if error
    setTimeout(() => {
      https.get(`${REPL_URL}/ping`, (res) => {
        console.log(`Keep alive retry: ${res.statusCode}`);
      }).catch(() => {});
    }, 30000);
  });
}, 3 * 60 * 1000); // 3 minutes

// Ping initial immédiat
https.get(`${REPL_URL}/ping`, (res) => {
  console.log(`Initial keep alive ping: ${res.statusCode}`);
}).on('error', () => {});

console.log('Keep alive service started - App will stay active at:', REPL_URL);