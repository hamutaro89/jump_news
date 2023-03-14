import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const scrapeLogic = async function(req, res){
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  try {    
    const page = await browser.newPage();

    await page.goto('https://developer.chrome.com/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    // Type into search box
    await page.type('.search-box__input', 'automate beyond recorder');

    // Wait and click on first result
    const searchResultSelector = '.search-box__link';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      'text/Customize and automate'
    );
    console.log(textSelector);
    const fullTitle = await textSelector.evaluate(el => el.textContent);
 
    res.status(200).send(fullTitle);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  } finally{
    await browser.close();
  }
  res.status(200).send();
};

async function matchGoogle(req, res){
  console.log("start Match google");
  let data = req.body;
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  let result = [];

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1200 });
  for(let d of data){
    try{
      console.log(d);
      await page.goto(`https://www.google.com/search?q=${d.title}`, { timeout: 600000, waitUntil: "networkidle2" }); 
      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: 70,
        encoding: "base64"
      });
      let google = null;
      try{
        await page.waitForSelector('.QXROIe', { timeout: 1500 }).then( async () => {                     
          google = true;
        });
      }catch(err){
        google = false;
      }
      result.push({
        _id: d._id,
        google,
        screenshot
      })    
    }catch(err){
      console.log(err)   
    }
  }
  await browser.close();  
  
  await fs.writeFile('./public/matchGoogle.json', JSON.stringify(result), err => {
    if (err) {
      console.error(err);
    }
  });
  res.status(200).send('start match google done');
}

async function matchPetal(req, res){
  console.log("start Match Petal");
  let data = req.body;
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
     ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  let result = [];

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1200 });
  await page.setCookie({
    domain: "www.petalsearch.com",
    name: "P_PERF",
    value: "%7B%22ml%22%3A%22en-gb%22%2C%22locale%22%3A%22zh-cn%22%2C%22sregion%22%3A%22sg%22%2C%22s_safe%22%3A%22off%22%7D"
  },{
    domain: "www.petalsearch.com",
    name: "P_UA",
    value: "%7B%22biw%22%3A1202%2C%22bih%22%3A1050%2C%22tz%22%3A%22GMT%2B08%3A00%22%2C%22vendor%22%3A%22Samsung%22%2C%22equipment_model%22%3A%22SM-G981B%22%7D"
  },{
    domain: "www.petalsearch.com",
    name: "P_PID",
    value: "cGV0YWw6TzIzMFQ0NVdyYkczWVk5cFpNWWI2UFN3ZkhFNVRkVmhvVlpCVHpEVW05WHZvQVJvY3Z2ZU13Y0FzZEtKemZIUkNqRzE6MGJlOTFhZjU2YTAxMDhjMTE4MTI2N2VlOTUwZjgzNmYwNjFkNDAwMmViMTkwYTVlZTNlODBjZjA4MDRlZGNiZjphOWExZmM2YzM3ODczM2I0ODZjNjlhZjQ2OGQ1NTMyZA=="
  },{
    domain: "www.petalsearch.com",
    name: "HW_idts_HuaweiSearch_www_petalsearch_com",
    value: "1678762737074"
  },{
    domain: "www.petalsearch.com",
    name: "HW_viewts_HuaweiSearch_www_petalsearch_com",
    value: "1678762909775"
  },{
    domain: "www.petalsearch.com",
    name: "HW_refts_HuaweiSearch_www_petalsearch_com",
    value: "1668133858570"
  },{
    domain: "www.petalsearch.com",
    name: "HW_id_HuaweiSearch_www_petalsearch_com",
    value: "15acddb3c3304f5b9e870040209e65be"
  },{
    domain: "www.petalsearch.com",
    name: "HW_idn_HuaweiSearch_www_petalsearch_com",
    value: "368302d96a584dfda294a305b6038de2"
  },{
    domain: "www.petalsearch.com",
    name: "X-CSRF-TOKEN",
    value: "C3dJhPr7pSMOzCw7OuH0v49E3dOruMvVfICfGybhY/k="
  },{
    domain: "www.petalsearch.com",
    name: "HW_idvc_HuaweiSearch_www_petalsearch_com",
    value: "374"
  },{
    domain: "www.petalsearch.com",
    name: "dc67616b8be54bc28a855b19c81b2c16",
    value: "WyI0MjY0NjMyODY2Il0"
  })
  
  for(let d of data){
    let error = false;
    try{      
      console.log(d);
      await page.goto(`https://www.petalsearch.com/search?query=${d.title}&channel=all&from=PCweb&ps=10&pn=1&sid=2krmnzinus2wh1x34xypjk7f2htmzu9f&qs=1&page_start=0&sregion=sg&locale=zh-cn&ml=en-gb`, { timeout: 600000, waitUntil: "networkidle2" });
      let co = await page.cookies();
      console.log(co)
      const screenshot_petal = await page.screenshot({
        type: 'jpeg',
        quality: 70,
        encoding: "base64"
      });
      
      let petal = null;

      try {
        await page.waitForSelector('.error-container', { timeout: 500 }).then(() => {          
          console.log('Error: too frequent');
          error = true;
        });        
      }catch {
        try{
          await page.waitForSelector('.news-card', { timeout: 1500 }).then( async () => {
            petal = true;
          });
        }catch(err){
          petal = false;          
        }
        result.push({
          _id: d._id,
          petal,
          screenshot_petal
        })
      }
    }catch(err){
      console.log(err)   
    }
    if(error){
      break;
    }
  } 
  await browser.close();
  await fs.writeFile('./public/matchPetal.json', JSON.stringify(result), err => {
    if (err) {
      console.error(err);
    }
  });
  res.status(200).send('start match petal done');
}

async function straitsTimes(req, res){
  console.log('starting straitstimes');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
  });
  let result = null;
  const page = await browser.newPage();
  console.log("start straitsTimes")
  let dateNow = new Date();
  try {
    await page.goto(`https://www.straitstimes.com/singapore`, { timeout: 60000, waitUntil: "networkidle0" });
    result = await page.evaluate(() => {
      const element = document.querySelector('.block-block-most-popular');
      return element.outerHTML;
    });    
    result = `<div>${dateNow}</div>` + result;
    await fs.writeFile('./public/straitstimes.txt', result, err => {
      if (err) {
        console.error(err);
      }
    });    
  } catch (error) {
    console.log("start straitstimes", error);
    res.status(400).send(error);
  }  
  await browser.close();
  res.status(200).send('start straitstimes done');
}

async function straitsTimesAsia(req, res){
  console.log('starting');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
  });
  let result = null;
  const page = await browser.newPage();
  console.log("start straitsTimes asia")
  let dateNow = new Date();

  try {
    await page.goto(`https://www.straitstimes.com/asia`, { timeout: 60000, waitUntil: "networkidle0" });
    result = await page.evaluate(() => {
      const element = document.querySelector('.block-block-most-popular');
      return element.outerHTML;
    });

    result = `<div>${dateNow}</div>` + result;
    console.log(result);
    await fs.writeFile('./public/straitstimes_asia.txt', result, err => {
      if (err) {
        console.error(err);
      }
    });    
  } catch (error) {
    console.log("start straitstimes_asia", error);
    res.status(400).send(error);
  }  
  
  await browser.close();
  res.status(200).send('start straitstimes_asia done');
}

async function zaobao(req, res){
  console.log('start zaobao');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  let result = null;

  const page = await browser.newPage();
  console.log("start zaobao")
  try {
    await page.goto(`https://www.zaobao.com.sg/news/singapore`, { timeout: 600000, waitUntil: "networkidle2" });
    result = await page.evaluate(() => {
      const element = document.querySelector('.article-list');
      return element.outerHTML;
    });
    let dateNow = new Date();
    result = `<div>${dateNow}</div>` + result;
    console.log(result);
    await fs.writeFile('./public/zaobao.txt', result, err => {
      if (err) {
        console.error(err);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
  await browser.close();
  res.status(200).send('start zaobao done');
}

export { scrapeLogic, matchGoogle, matchPetal, straitsTimes, zaobao, straitsTimesAsia };