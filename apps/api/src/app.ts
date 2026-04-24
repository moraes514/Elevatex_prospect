import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Serve static files from the React app
const webDistPath = path.resolve(__dirname, '../../web/dist');
app.use(express.static(webDistPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(webDistPath, 'index.html'));
});

export default app;
