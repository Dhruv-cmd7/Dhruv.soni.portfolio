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
  console.log(`[Request] ${req.method} ${req.url} - Range: ${req.headers.range || 'none'}`);
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

    const contentType = types[path.extname(file).toLowerCase()] || "application/octet-stream";
    const headers = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Range",
      "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges"
    };

    let range = req.headers.range;
    let isQueryRange = false;
    const queryIndex = req.url.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = req.url.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      const rangeParam = params.get('range');
      if (rangeParam) {
        range = `bytes=${rangeParam}`;
        isQueryRange = true;
      }
    }

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : data.length - 1;

      if (isNaN(start) || start >= data.length || end >= data.length || start > end) {
        res.writeHead(416, {
          "Content-Range": `bytes */${data.length}`,
          "Access-Control-Allow-Origin": "*"
        });
        res.end();
        return;
      }

      const chunk = data.subarray(start, end + 1);
      headers["Content-Length"] = chunk.length;

      if (isQueryRange) {
        // Query-parameter range requests expect status 200
        res.writeHead(200, headers);
      } else {
        // HTTP header Range requests expect status 206
        headers["Content-Range"] = `bytes ${start}-${end}/${data.length}`;
        res.writeHead(206, headers);
      }
      res.end(chunk);
    } else {
      headers["Content-Length"] = data.length;
      res.writeHead(200, headers);
      res.end(data);
    }
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving Dhruv Soni clone at http://127.0.0.1:${port}/`);
});
