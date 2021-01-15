const puppeteer = require('puppeteer');
const http = require('http');

(async () => {
    const browsers = [];
    const server = http.createServer(async function (req, res) {
        if (req.url.endsWith("browser")) {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--disable-dev-shm-usage'],
                defaultViewport: {
                    width: 1920,
                    height: 1080,
                    deviceScaleFactor: 1,
                },
            });
            console.log(`browser started with endpoint ${browser.wsEndpoint()}`)
            
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ wsEndpoint: browser.wsEndpoint() }));
            browsers.push(browser);
        }
        res.end();
    }).on('close', async function () {
        for (var b in browsers) {
            console.log(`closing browser ${b.wsEndpoint()}`)
            await b.close();
        }
    });
    
    process.on('SIGINT', () => server.close());
    
    server.listen(8585, () => {
        console.log(`make a request to http://localhost:8585/browser to start a new browser instance; ws endpoint will be returned`);
    });
})();

