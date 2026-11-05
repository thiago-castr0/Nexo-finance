import http from "node:http";
import net from "node:net";
import { spawn } from "node:child_process";

/**
 * Inicializa o Next.js na porta 3001 (Nova Proposta v5.0) e mantém um bridge
 * na porta 3000 (Versão v4.0) para comparação lado a lado.
 */
const nextProc = spawn(
  process.execPath,
  ["--use-system-ca", "./node_modules/next/dist/bin/next", "dev", "-p", "3001"],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env },
  }
);

const bridge3000 = http.createServer((req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: 3001,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: "localhost:3000",
      "x-nexo-port": "3000",
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", () => {
    res.statusCode = 502;
    res.end("Iniciando servidor Nexo...");
  });

  req.pipe(proxyReq, { end: true });
});

bridge3000.on("upgrade", (req, socket, head) => {
  const proxySocket = net.connect(3001, "127.0.0.1", () => {
    const reqLine = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
    const headers = Object.entries(req.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\r\n");
    proxySocket.write(`${reqLine}${headers}\r\n\r\n`);
    if (head && head.length) proxySocket.write(head);
    socket.pipe(proxySocket).pipe(socket);
  });
  proxySocket.on("error", () => socket.destroy());
});

bridge3000.listen(3000, "127.0.0.1", () => {
  console.log("✓ Comparador ativo em http://localhost:3000 (Versao v4.0)");
  console.log("✓ Nova Proposta ativa em http://localhost:3001 (Nova UI v5.0)");
});

nextProc.on("exit", (code) => {
  bridge3000.close();
  process.exit(code ?? 0);
});
