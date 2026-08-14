import http from "http";

const port = 5000;
const localhost = "127.0.0.1";

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page");
  } else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Page");
  } else if (req.url === "/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Users Page");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Route Not Found");
  }
});

server.listen(port, localhost, () => {
  console.log(`http://${localhost}:${port}`);
});
