# forexy

A 'no dependency', light-weight fast node.js tool to retrieve the latest up to date Forex Currency pair results.

## Installation

Install with npm

```shell
$ npm install forexy
```

## Usage and Examples

To retrieve forex results for the USD/GBP pair (US dollar to Great British Pound:

```javascript
const Forexy = require("forexy");

const currencyCheck = new Forexy();

currencyCheck
  .get("USDGBP")
  .then((result) => {
    console.log(`USD/GBP ${result}`);
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
```

## Promise and Events

Forexy returns a promise, which allows you to use an async/await function, or using then().catch().

```javascript
const currency = async (pair) => {
  let rate = await currencyCheck.get("USDGBP");

  console.log(`USDGBP rate is ${rate}`);
};

console.log(`USD-GBP rate is ${currency("USDGBP")}`);
```

...which is the same as

```javascript
currencyCheck
  .get("USDGBP")
  .then((result) => {
    console.log(`USD-GBP rate is ${result}`);
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
```

Forexy also has a host of Events that you can use through the lifecycle process.

```javascript
const currencyCheck = new Forexy();

//On Events
currencyCheck.on("request", (data) => {
  //called before the request is made, returns the currency pair
  console.log("on request:" + data);
});

currencyCheck.on("received", (data) => {
  console.log("on received: " + data);
});

currencyCheck.on("stream", (data) => {
  //streamed data
  console.log("on stream: " + data);
});

currencyCheck.on("statusCode", (data) => {
  //If no errors should return '200'
  console.log("on statusCode:" + data);
});

currencyCheck.on("rate", (data) => {
  //rate is the default value returned the get() method
  console.log("on rate:" + data);
});

currencyCheck
  .get("USDGBP")
  .then((result) => {
    console.log(`USD-GBP rate is ${result}`);
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
```

Check out the examples to see various options used.

### Events

#### fulldata

Get a JSON object with all data.

```javascript
currencyCheck.on("fulldata", (data) => {
  //returned JSON of all data.
  console.log("on fulldata:" + JSON.stringify(data));
});
```

#### timestamp

This returns a Date object, which can be further manipulated, this will be approximately the current timestamp.

```javascript
currencyCheck.on("timestamp", (data) => {
  //This returns a Date object.
  console.log("on timestamp:" + data); //Tues Dec 08 2021 20:51:10 GMT
});
```

#### pair

Returns the currency pair values, in uppercase.

```javascript
currencyCheck.on("pair", (data) => {
  console.log("on pair:" + data); //USDGBP
});
```

#### statusCode

#### stream

#### pair
