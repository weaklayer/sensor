# Weaklayer Sensor

Welcome to the Weaklayer Sensor repository!
Weaklayer is a software system for Browser Detection and Response - like Endpoint Detection and Reponse (EDR) but in the browser.
The Weaklayer Sensor (a browser extension) collects and sends security data to a Weaklayer Gateway instance you are running.

The Weaklayer Sensor is written against the WebExtensions API using the [Mozilla WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill).
Here is a compatibility table for the browsers that implement this technology.

| Browser | Supported | Minimum Version | Store Link | Notes |
|---------|-----------|-----------------|------------|-------|
| Firefox (Desktop)  | &#x2611; | 57.0  | [Mozilla Addons Store](https://addons.mozilla.org/firefox/addon/weaklayer-sensor/)   | - |
| Firefox (Android)  | &#x2612; | - | - | Does not support the [Managed Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/managed) |
| Chrome | &#x2612; | - | - | Working on a release for Chrome currently |
| Edge | &#x2612; | - | - | Chromium-based Edge will be done after Chrome |
| Opera | &#x2612; | - | - | Chromium-based Opera will be done after Edge |
| Safari | &#x2612; | - | - | Safari 14 will have WebExtensions so this should be possible |


## Installation

The reccomended installation source is from the extension store listing for your browser.

Clicking install in the extension stores works very well for local testing and usage.

Large deployments should use their browser's automated installation mechanism:
- [Firefox policies](https://support.mozilla.org/en-US/products/firefox-enterprise/policies-customization-enterprise/policies-overview-enterprise)

## Configuration

This is where you give the Weaklayer Sensor some required information:
- The location of the Weaklayer Gateway that data should be sent to
- An install key the sensor uses to authenticate to your gateway instance
- A (preferrably unique) label for the sensor to help you correlate data (something involving the endpoint hostname is a good starting point) 

The configuration process differs for each combination of browser and operating system. However it generally involves some combination of placing an appropiately formatted config file in a directory and setting a registry key on Windows. Example configs are provided in the repository under `configs`. 

For example, copying `configs/firefox/sensor@weaklayer.com.json` to `~/Library/Application Support/Mozilla/ManagedStorage/sensor@weaklayer.com.json` would configure the Wekalayer Sensor for Firefox on macOS for the given user.

Here are the doumentation pages for configuring browser extension managed storage:
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#Manifest_location)

__N.B. You should not use the example config content in production. You should generate your own install keys according to Weaklayer Gateway docs.__

## Building From Source

This requires you have `npm` installed.

```
git clone https://github.com/weaklayer/sensor.git
cd sensor
npm install
npm run build-firefox
```

This produces a minified browser extension in the `dist` directory.

Run unit tests with this commnad.
```
npm test
```

