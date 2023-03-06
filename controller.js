import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

const scrapeLogic = async function(req, res){
  const browser = await puppeteer.launch({
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
    res.status(200).send("Error", error);
  } finally{
    await browser.close();
  }
};

async function matchGoogle(req, res){
  let data = req.body;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  let result = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1200 });
    for(let d of data){
      try{     
        console.log(d);
        await page.goto(`https://www.google.com/search?q=${d.title}`, { timeout: 100000, waitUntil: "networkidle2" }); 
        try{
          await page.waitForSelector('.QXROIe', { timeout: 1500 }).then( async () => {
            const screenshot = await page.screenshot({
              type: 'jpeg',
              quality: 60
            });
            const imageData = screenshot.toString('base64');          
            result.push({
              _id: d._id,
              google: true,
              screenshot: imageData
            })
          });
        }catch(err){
          result.push({
            _id: d._id,
            google: false,
            screenshot: null
          }) 
        }
      }catch(err){
        console.log(err)   
      }
    }    
  } catch (error) {
    console.log(error);
    res.status(400).send("Error", error);
  } finally{
    await browser.close();
  }
  res.status(200).send(result);
}

async function matchPetal(req, res){
  let data = req.body;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  let result = [];
  try {
    const page = await browser.newPage();
    for(let d of data){
      try{
        console.log(d);
        await page.goto(`https://www.petalsearch.com/search?query=${d.title}`, { timeout: 100000, waitUntil: "networkidle2" }); 
        try{
          await page.waitForSelector('.news-card', { timeout: 1500 }).then( async () => {
            result.push({
              _id: d._id,
              petal: true
            })
          });
        }catch(err){
          result.push({
            _id: d._id,
            petal: false
          }) 
        }
      }catch(err){
        console.log(err)   
      }
    }    
  } catch (error) {
    console.log(error);
    res.status(400).send("Error", error);
  } finally{
    await browser.close();
  }
  res.status(200).send(result);
}

async function straitsTimes(req, res){
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_PATH : puppeteer.executablePath()
  });
  let result = null;
  try {
    const page = await browser.newPage();
    console.log("start straitsTimes")
    try {
      await page.goto(`https://www.straitstimes.com/singapore`, { timeout: 90000, waitUntil: "networkidle2" });
      result = await page.evaluate(() => {
        const element = document.querySelector('.block-block-most-popular');
        return element.outerHTML;
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("Error", error);
    }  
  } catch (error) {
    console.log(error);
    res.status(400).send("Error", error);
  } finally{
    await browser.close();
  }
  res.status(200).send(result);
}

export { scrapeLogic, matchGoogle, matchPetal, straitsTimes };