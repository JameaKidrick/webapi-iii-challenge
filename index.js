console.log('=== RUNNING ==='); // confirming backend is running

const server = require('./server'); // import server

// CREATE PORT HERE 
server.listen(5000, () => {
  console.log('\n=== Server Running on http://localhost:5000 ===\n');
});
