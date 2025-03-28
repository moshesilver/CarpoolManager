import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import HttpError from './HttpError.js';
import Family from './routes/family.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use('/api/family', Family);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(404, '404. Not Found');
  next(error);
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.statusCode = err.status || 500;
  res.send(err.message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`listening on port ${PORT}`));
