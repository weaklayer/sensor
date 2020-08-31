# Weaklayer Sensor

Welcome to the Weaklayer Sensor repository!
Weaklayer is a software system for Browser Detection and Response - like Endpoint Detection and Reponse (EDR) but in the browser.
The Weaklayer Sensor (a browser extension) collects and sends security data to a Weaklayer Gateway instance you are running.

The Weaklayer Sensor is written against the WebExtensions API using the [Mozilla WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill).
<<<<<<< HEAD
Here is a compatibility table for Weaklayer Sensor and the browsers that implement this technology.
=======
Here is a compatibility table for the Weaklayer Sensor and the browsers that implement this technology.
>>>>>>> Delete configuration information

| Browser | Supported | Minimum Version | Store Link | Notes |
|---------|-----------|-----------------|------------|-------|
| Firefox (Desktop)  | &#x2611; | 57.0  | [Mozilla Addons Store](https://addons.mozilla.org/firefox/addon/weaklayer-sensor/)   | - |
| Firefox (Android)  | &#x2612; | - | - | Firefox on Android does support extensions, but it does not support the [Managed Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/managed). |
| Chrome | &#x2611; | 51.0 | [Chrome Web Store](https://chrome.google.com/webstore/detail/weaklayer-sensor/joancbgicjhnjkkknlpablgmdcgcpnhj) | - |
| Edge | &#x2612; | - | - | Chromium-based Edge is in the works. |
| Opera | &#x2612; | - | - | Opera does not support the [Managed Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/managed) according to MDN. It might work still since Opera is Chromium-based. Create a Github issue if this is important to you. |
| Safari | &#x2612; | - | - | Safari 14 will have WebExtensions so this should be possible in the future. |

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
