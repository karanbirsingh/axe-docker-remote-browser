# axe-docker-remote-browser

This project runs an axe-puppeteer scan in a Docker container via a browser executing on the host machine.

Steps:
- clone this repository
- run `yarn install`
- run `docker build -t axe-docker-remote-browser .`
- run `node .\start-browser-server.js`
- in a new terminal, run `docker run axe-docker-remote-browser https://markreay.github.io/AU/before.html`
- see axe-core results

How this works:
- `start-browser-server.js` creates a new puppeteer instance each time `https://localhost:8585/browser` is hit & returns the [websocket debugger URL](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#browserwsendpoint)
- `index.js` requests a new browser, retreives the websocket endpoint, and connects to it via [`puppeteer.connect`](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerconnectoptions)
- the `axe-core` scan runs in the host browser, and results are processed within the container

It has been tested on a Windows host so far. See use of `host.docker.internal` [here](https://github.com/karanbirsingh/axe-docker-remote-browser/blob/59117a5151e7ff231872d9ff00c1518880c1c758/index.js#L12) to manage access to the host service. 
