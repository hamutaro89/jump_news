import express from 'express'
import bodyParser from 'body-parser'
import { scrapeLogic } from './controller.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/scrapeUrl', scrapeLogic)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});