This is the source for the Weaklayer Sensor. 
It is a browser extension designed to act endpoint detection and response (EDR), except in the browser.
This is why I use the term 'browser detection and response'.

Firefox (>= 57.0) is currently supported (desktop only). 
Unfortunately Firefox on Android does not work because it is missing the [managed storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/managed).
Support for other browsers with the WebExtensions API is in the works.

# Building the Extension
This requires you have the `npm` command line utility.

```
git clone https://github.com/weaklayer/sensor.git
cd sensor
npm install
npm run build-firefox
```

The result is a minified browser extension identical to our extension store submissions (firefox in this case).
The `dist` directory contains the extension that you can load as a temporary add-on in Firefox developer edition.
