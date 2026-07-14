const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav"
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const requested = path.join(root, clean);
  const normalized = path.normalize(requested);

  if (!normalized.startsWith(root)) return null;
  if (fs.existsSync(normalized) && fs.statSync(normalized).isFile()) return normalized;
  if (fs.existsSync(normalized) && fs.statSync(normalized).isDirectory()) {
    const index = path.join(normalized, "index.html");
    if (fs.existsSync(index)) return index;
  }

  const html = `${normalized}.html`;
  if (fs.existsSync(html)) return html;

  return path.join(root, "index.html");
}

http.createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream"
    });
    res.end(data);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving Jacob Schneider clone at http://127.0.0.1:${port}/`);
});
