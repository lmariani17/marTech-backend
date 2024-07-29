import express from 'express';
import bodyParser from 'body-parser';
import campaignsRoutes from './routes/campaigns';
import interactionsRoutes from './routes/interactions';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rutas
app.use('/api', campaignsRoutes);
app.use('/api', interactionsRoutes);

app.get('/', (req, res) => {
  res.send('Healthy service!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
