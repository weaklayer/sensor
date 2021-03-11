# Weaklayer Sensor

**N.B.** As of early 2021, this project is no longer under active development and has been removed from browser extension stores. However, the Weaklayer sensor and gateway still work well at the time of writing. The sensor just requires installing from source now.

Welcome to the Weaklayer Sensor repository!
Weaklayer is a software system for Browser Detection and Response - like Endpoint Detection and Reponse (EDR) but in the browser.
The Weaklayer Sensor (a browser extension) collects and sends security data to a Weaklayer Gateway instance you are running.

The Weaklayer Sensor is written against the WebExtensions API using the [Mozilla WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill).
Here is a compatibility table for the Weaklayer Sensor and the browsers that implement this technology.

| Browser | Supported | Minimum Version | Notes |
|---------|-----------|-----------------|-------|
| Firefox (Desktop)  | &#x2611; | 57  |  - |
| Firefox (Android)  | &#x2612; | - |
| Chrome | &#x2611; | 51 | - |
| Edge | &#x2611; | 79 | Edge on MacOS support is not available since managed storage is not functioning as expected on this platform. |
| Opera | &#x2612; | - | Opera does not support the [Managed Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/managed) according to MDN. It might work still since Opera is Chromium-based. Please create a Github issue if this is important to you. |
| Safari | &#x2612; | - | Safari 14 will have WebExtensions so this should be possible in the future. |

## Usage

Detailed usage instructions can be found in the [Docs section of the Weaklayer Website](https://weaklayer.com/docs/).
This includes instructions for installation and configuration.
Things that follow in this README are for Weaklayer Sensor development.

## Building From Source

This requires you have `npm` installed.

```
git clone https://github.com/weaklayer/sensor.git
cd sensor
npm install
npm test
npm run build-firefox # or build-chrome or build-edge
```

This produces a minified browser extension in the `dist` directory.
You can load this extension in your browser's developer mode as an unpacked extension.
