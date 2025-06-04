import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { clerkMiddleware, requireAuth } from '@clerk/express';

import HttpError from './HttpError.js';
import Family from './routes/family.js';
// import Authentication from './routes/auth.js';
// import { PrismaClient } from '@prisma/client';

const app = express();
const server = http.createServer(app);
// const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use(clerkMiddleware());

// app.use('/api/auth', Authentication);

app.use('/api/family', requireAuth(), Family);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(404, '404. Not Found');
  next(error);
});

app.use(
  (err: HttpError, req: Request, res: Response /* , next: NextFunction */) => {
    res.statusCode = err.status || 500;
    res.send(err.message);
  }
);

const PORT = process.env.PORT || 3000; // should i have a default port?
server.listen(PORT, () => console.log(`listening on port ${PORT}`));

export default app;
