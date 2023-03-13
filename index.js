import express from 'express'
import { scrapeLogic, matchGoogle, matchPetal, straitsTimes, zaobao, straitsTimesAsia } from './controller.js';

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/scrapeUrl', scrapeLogic);

app.post('/scrape', (req, res) => {
  console.log(req.body);
  res.status(200).send(req.body);
});

app.get('/straitsTimes', straitsTimes);
app.get('/straitsTimesAsia', straitsTimesAsia);
app.get('/zaobao', zaobao);
app.post('/matchGoogle', matchGoogle);
app.post('/matchPetal', matchPetal);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});