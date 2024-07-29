import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from '../data-source';
import campaignsRoutes from './routes/campaigns';
import interactionsRoutes from './routes/interactions';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', campaignsRoutes);
app.use('/api', interactionsRoutes);

const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
      break;
    } catch (err: any) {
      console.error('Error during Data Source initialization', err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

startServer();
