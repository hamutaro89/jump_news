import express from 'express'
import { scrapeLogic, matchGoogle, matchPetal, straitsTimes } from './controller.js';

const app = express();
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/scrapeUrl', scrapeLogic);

app.post('/scrape', (req, res) => {
  console.log(req.body);
  res.status(200).send(req.body);
});

app.post('/straitsTimes', straitsTimes);
app.post('/matchGoogle', matchGoogle);
app.post('/matchPetal', matchPetal);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});