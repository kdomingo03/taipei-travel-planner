const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

// Use environment variable for port, default to 4173, but try alternatives if conflict
const desiredPort = Number(process.env.PORT || 4173);
const portsToTry = [desiredPort, 3000, 8080, 4174, 5173, 8000];

let serverPort = desiredPort;

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = http.createServer((req, res) => res.end());
    tester.listen(port, () => {
      tester.close();
      resolve(true);
    });
    tester.on('error', () => {
      resolve(false);
    });
  });
}

async function findAvailablePort() {
  for (const port of portsToTry) {
    const available = await isPortAvailable(port);
    if (available) {
      serverPort = port;
      return port;
    }
  }
  // If no port is available, use the desired port anyway
  return serverPort;
}

// Find an available port
findAvailablePort().then((port) => {
  // Create server with the available port
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    // Serve from root folder - all files are at root level
    let requestedPath;
    if (pathname === '/' || pathname === '/index.html') {
      requestedPath = 'index.html';
    } else {
      requestedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    }
    requestedPath = decodeURIComponent(requestedPath);

    // Try to find the file - first at root, then in docs/ folder
    const rootFilePath = path.join(__dirname, requestedPath);
    const docsFilePath = path.join(__dirname, 'docs', requestedPath);

    let data;
    try {
      data = fs.readFileSync(rootFilePath);
    } catch {
      try {
        data = fs.readFileSync(docsFilePath);
      } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not found');
        return;
      }
    }

    const ext = path.extname(rootFilePath).toLowerCase();
    let contentType;
    if (ext === '.xlsx') {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (ext === '.html') {
      contentType = 'text/html';
    } else if (ext === '.js') {
      contentType = 'text/javascript';
    } else if (ext === '.css') {
      contentType = 'text/css';
    } else {
      contentType = mime[ext] || 'application/octet-stream';
    }
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(data);
  }).listen(port, '0.0.0.0', () => console.log(`Taipei Travel Planner: http://localhost:${port} (also on LAN)`));

  // Export port for use by other modules
  module.exports = { server, serverPort };
}).catch((err) => {
  console.error('Error starting server:', err);
});