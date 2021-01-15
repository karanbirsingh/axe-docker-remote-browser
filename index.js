const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    try {
        if (process.argv.length < 3) {
            console.log(`missing URL parameter to scan`);
            process.exit(1);
        }

        const response = await axios.get('http://host.docker.internal:8585/browser');
        console.log(`made new browser request, got wsEndpoint ${response.data.wsEndpoint}`)
        const wsUrl = response.data.wsEndpoint.replace("127.0.0.1", "host.docker.internal");
        console.log(`replaced 127.0.0.1 to get ${wsUrl}`);
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsUrl,
        });
    
        const page = await browser.newPage();
        await page.setBypassCSP(true);
     
        await page.goto(process.argv[2]);
     
        const results = await new AxePuppeteer(page).analyze();
        console.log(results.violations);
     
        await page.close();
        await browser.close();
    } catch (e) {
        console.log(e);
    }
})();