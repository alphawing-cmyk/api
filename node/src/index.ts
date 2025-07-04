import build from "./app.js";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import RBACPlugin from "./plugins/rbac.ts";
import cors from '@fastify/cors'
import websocket from '@fastify/websocket';


const app = build({ logger: true });

// Register cookie plugin
app.register(cookie, {
  secret: process.env.COOKIE_SECRET ? process.env.COOKIE_SECRET : "123",
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PRODUCTION',
    sameSite:  process.env.NODE_ENV === 'PRODUCTION' ? 'lax' : 'none',
    path: '/',
    maxAge: 3600 * 24 * 1,
    partitioned: process.env.NODE_ENV === 'PRODUCTION',
    domain:  process.env.NODE_ENV === 'PRODUCTION' ? 'alphawing.com': undefined
  },
} as FastifyCookieOptions);


// Register cors
app.register(cors, 
    {
      origin: ["http://localhost:5173"], 
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
);

// Register Websocket
await app.register(websocket,  { 
    options: { maxPayload: 1048576 }
});

// Register RBAC plugin
app.register(RBACPlugin);


const start = async () => {
  try {
    await app.listen({
      port: process.env.API_PORT ? parseInt(process.env.API_PORT) : 5000,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
