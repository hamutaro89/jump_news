import express from 'express'
import { scrapeLogic, matchGoogle, matchPetal, straitsTimes, zaobao } from './controller.js';
import fs from 'fs';
const app = express();
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
  fs.writeFile('./test.txt', 'content234234', err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  res.status(200).send('Hello World!');
});

app.get('/read', (req, res) => {
  fs.readFile('./test.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }    
    res.status(200).send(data);
  });  
});

app.get('/scrapeUrl', scrapeLogic);

app.post('/scrape', (req, res) => {
  console.log(req.body);
  res.status(200).send(req.body);
});

app.post('/straitsTimes', straitsTimes);
app.post('/zaobao', zaobao);
app.post('/matchGoogle', matchGoogle);
app.post('/matchPetal', matchPetal);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});