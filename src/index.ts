import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from '../data-source'; // Asegúrate de que la ruta sea correcta
import campaignsRoutes from './routes/campaigns';
import interactionsRoutes from './routes/interactions';

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());

    // Rutas
    app.use('/api', campaignsRoutes);
    app.use('/api', interactionsRoutes);

    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
