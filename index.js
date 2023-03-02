import express from 'express'
import { callPuppeteer } from './controller.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/crawlUrl', callPuppeteer)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});