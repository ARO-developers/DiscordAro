const puppeteer = require('puppeteer');
var fs = require('fs');

var json = {};

async function scrape() {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto('https://sortiment.makro.cz/cs/catalog/category/action/?producers=7430&view_mode=bal&view_price=s');
    const list = await page.$$("form.multiprodsubmitform > div.mo-products > div.product");

    for (let i = 0; i < list.length; i++) {
        const name = await list[i].$eval("h3.product-title", i => i.innerText);
        json[name] = {};

        const pr_row = await list[i].$$("div.product-price-row");

        for (let j = 0; j < pr_row.length; j++) {
            const pr_lab = await pr_row[j].$eval("div.product-price-label", j => j.innerText);
            const pr_val = await pr_row[j].$eval("div.product-price-value", j => j.innerText);
            json[name][pr_lab] = pr_val;
        }
        
    }
    browser.close();

    fs.writeFile('./akce.json', JSON.stringify(json, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to akce.json");
        }
    });
}

async function callback() {
    console.log("done");
}

scrape();
