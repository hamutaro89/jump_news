import puppeteer from 'puppeteer-extra';
import chromium from "@sparticuz/chromium";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function scrapeLogic(req, res){
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: await chromium.executablePath()
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
  const browser = await callPuppeteer();
  const page = await browser.newPage();
  let result = [];
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
  const browser = await callPuppeteer();
  const page = await browser.newPage();
  let result = [];

  await page.setViewport({ width: 420, height: 1600 }); 
  for(let d of data){
    let error = false;
    try{      
      console.log(d);
      await page.goto(`https://search-dre.dt.dbankcloud.com/search?query=${d.title}&channel=all&&page_start=0&sregion=sg&locale=zh-cn&ml=zh-cn`, 
        { timeout: 600000, waitUntil: "networkidle2" });
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
          await page.waitForSelector('.news-container', { timeout: 1500 }).then( async () => {
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
  let result = null;
  const browser = await callPuppeteer();
  const page = await browser.newPage();
  let dateNow = new Date();
  try {
    await page.goto(`https://www.straitstimes.com/singapore`, { timeout: 160000, waitUntil: "networkidle0" });
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
  console.log("start straitsTimes asia");
  let result = null;
  const browser = await callPuppeteer();
  const page = await browser.newPage();
  let dateNow = new Date();
  try {
    await page.goto(`https://www.straitstimes.com/asia`, { timeout: 160000, waitUntil: "networkidle0" });
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

async function straitsTimesGlobal(req, res){
  console.log("start straitsTimes global");
  let result = null;
  const browser = await callPuppeteer();
  const page = await browser.newPage(); 
  let dateNow = new Date();
  try {
    await page.goto(`https://www.straitstimes.com/global`, { timeout: 160000, waitUntil: "networkidle0" });
    result = await page.evaluate(() => {
      const element = document.querySelector('.block-block-most-popular');
      return element.outerHTML;
    });

    result = `<div>${dateNow}</div>` + result;
    console.log(result);
    await fs.writeFile('./public/straitstimes_global.txt', result, err => {
      if (err) {
        console.error(err);
      }
    });    
  } catch (error) {
    console.log("start straitstimes_global", error);
    res.status(400).send(error);
  }  
  
  await browser.close();
  res.status(200).send('start straitstimes_global done');
}

async function zaobao(req, res){
  console.log('start zaobao');  
  let result = null;
  const browser = await callPuppeteer();
  const page = await browser.newPage();
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

async function callPuppeteer(){
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
  return browser;
}

export { scrapeLogic, matchGoogle, matchPetal, straitsTimes, zaobao, straitsTimesAsia, straitsTimesGlobal };