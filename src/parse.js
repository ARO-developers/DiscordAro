const puppeteer = require('puppeteer');
var json = {};

async function scrape() {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto('https://sortiment.makro.cz/cs/catalog/category/action/?producers=7430&?view_mode=bal&?view_price=s');
    const list = await page.$$("form.multiprodsubmitform > div.mo-products > div.product");

    for (let i = 0; i < 2; i++) {
        const name = await list[i].$eval("h3.product-title", i => i.innerText);
        console.log(name);

        const pr_row = await list[i].$$("div.product-price-row");

        for (let j = 0; j < pr_row.length; j++) {
            const pr_lab = await pr_row[j].$eval("div.product-price-label", j => j.innerText);
            const pr_val = await pr_row[j].$eval("div.product-price-value", j => j.innerText);
            console.log(pr_lab, pr_val);
        }
        
    }
        
    browser.close();
}

scrape();
