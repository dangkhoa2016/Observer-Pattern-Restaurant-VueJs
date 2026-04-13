const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.vue': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function send(response, statusCode, headers, body) {
  response.writeHead(statusCode, headers);
  response.end(body);
}

function safePathname(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, '');
  return normalized === '/' ? '/index.html' : normalized;
}

const server = http.createServer((request, response) => {
  const pathname = safePathname(request.url || '/');
  const filePath = path.join(rootDir, pathname);

  if (!filePath.startsWith(rootDir)) {
    send(response, 403, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      if (error.code === 'ENOENT') {
        send(response, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found');
        return;
      }

      send(response, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Internal server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(response, 200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
    }, file);
  });
});

server.listen(port, host, () => {
  process.stdout.write(`Static server running at http://${host}:${port}\n`);
});