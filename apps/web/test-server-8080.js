const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server working on 8080\n');
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Test server running at http://0.0.0.0:8080/');
});