
console.log("Hello via Bun!");
import os from "os"
import path from "path"
// import pty from "node-pty"
import cp from "child_process"
import crypto from "crypto"
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh';
let shells = {}
Bun.serve({
    fetch(req, server) {
  // upgrade the request to a WebSocket
  if (server.upgrade(req, {
    data: {
        id: crypto.randomUUID().toString()
    }
  })) {
    return; // do not return a Response
  }
  const p = new URL(req.url).pathname;
  const file = Bun.file(path.join(__dirname, "static", p == '/' ? 'index.html' : p));
  return new Response(file);
  // return new Response("Test", { status: 200 })
    },
    error() {
      return new Response(null, { status: 404 });
    },
    websocket: {
        message(ws, message) {
            console.log(message)
            // ws.sendText('ur mom')
            shells[ws.data.id].stdin.write(message.toString())
        },
    open(ws) {
        console.log(ws.data.id)
        // ws. 
    let sh = cp.spawn(shell, {
        cwd: process.env.HOME,
        env: process.env
    })
    sh.stdout.on('data', (d) => ws.send(d.toString()))
    sh.stderr.on('data', (d) => ws.send(d.toString()))
    shells[ws.data.id] = sh
    },
    close(ws, code, reason) {
        
    },
    },
    port: 3000
})