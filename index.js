import express from 'express';
import cors from 'cors';
import userRoutes from './routes/router.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(userRoutes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor de backend iniciado en http://localhost:${PORT}`));

