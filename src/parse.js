const puppeteer = require('puppeteer');

async function scrape() {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto('https://sortiment.makro.cz/cs/catalog/category/action/?producers=7430&?view_mode=bal');
    const list = await page.$$("form.multiprodsubmitform > div.mo-products > div.product");

    for (let i = 0; i < list.length; i++) {
        const name = await list[i].$eval("h3.product-title", i => i.innerText);
        console.log(name);
    }
        
    browser.close();
}

scrape();
