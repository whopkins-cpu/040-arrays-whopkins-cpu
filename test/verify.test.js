const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create an array named iceCreamFlavors that contains chocolate, vanilla and twist', async function() {
    const iceCreamFlavors = await page.evaluate(() => iceCreamFlavors);
    expect(iceCreamFlavors).toBeDefined();
    expect(iceCreamFlavors.length).toBe(3);
    expect(iceCreamFlavors[0]).toBe('chocolate');
    expect(iceCreamFlavors[1]).toBe('vanilla');
    expect(iceCreamFlavors[2]).toBe('twist');
  });

  it('should assign the innerHTML of the HTML element with the id result to the iceCreamFlavors', async function() {
    const iceCreamFlavors = await page.evaluate(() => iceCreamFlavors);
    const innerHtml = await page.$eval("#result", (result) => {
      return result.innerHTML;
    });
    
    expect(innerHtml).toBe(iceCreamFlavors.toString());
  });
});
