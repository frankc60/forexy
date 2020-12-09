# forexy

![dependencies](https://img.shields.io/badge/0-Dependencies-blue)
![npm](https://img.shields.io/npm/v/forexy)
![install size](https://badgen.net/packagephobia/install/forexy)

A **'zero dependency'**, **light-weight** and **fast** node.js tool that retrieves the latest Forex Currency pair results.

## Installation

Using npm:

```shell
$ npm i --save forexy
```

## Usage and Examples

To retrieve forex results for the USD/GBP pair (US dollar to Great British Pound):

```javascript
const Forexy = require("forexy");

const currencyCheck = new Forexy();

currencyCheck
  .get("USDGBP")
  .then((result) => {
    console.log(`USD/GBP rate is ${result}`);
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
```

## Promise and Events

Forexy returns a promise, which allows you to use an **async**/**await** function, or using **then().catch()**.

```javascript
const currency = async (pair) => {
  try {
    let result = await currencyCheck.get("USDGBP");
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

console.log(`USD/GBP rate is ${currency("USDGBP")}`);
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

### Events

Forexy also has a host of Events that you can use through the lifecycle process.

#### fulldata

Get a JSON object with all data.

```javascript
currencyCheck.on("fulldata", (data) => {
  //returned JSON of all data.
  console.log("on fulldata:" + JSON.stringify(data));
  //eg. {"rates":{"USDLSL":{"rate":15.140088,"timestamp":1607414291}},"code":200}
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

```javascript
currencyCheck.on("statusCode", (data) => {
  //If no errors should return '200'
  console.log("on statusCode:" + data);
});
```

#### rate

_rate_ is the same as the default value returned from the get() method.

```javascript
currencyCheck.on("rate", (data) => {
  console.log("on rate:" + data);
  //eg. 1.2234
});
```

#### request

Triggered before the request is made. Returns the currency pair value.

```javascript
currencyCheck.on("request", (data) => {
  //called before the request is made, returns the currency pair
  console.log("on request:" + data);
});
```

#### stream

The same returned data as 'fulldata' but streamed.

```javascript
currencyCheck.on("stream", (data) => {
  //streamed data
  console.log("on stream: " + data);
});
```

## Error Handling

Forexy has built in Error Handling, which will catch any issues in Development.

### Unsupported Forex Pairs

Forexy currently only offers the most popular currency pairs. I plan to add more as the demand grows.

If you enter an invalid currency pair, the promise will reject with a list of supported currency pairs available.

If you use Forexy in an **async / await** then put the call into a Try {} catch {}. Otherwise use the Promise then().**catch((err)=>{//error handling})**

```javascript
const currency = async (pair) => {
  try {
    // code that we will 'try' to run
    let result = await currencyCheck.get("MONOPOLYMONEY");
  } catch (error) {
    // code to run if there are any problems
    console.error(`Error: ${err}`); //display Error message
  }
};
```

Or using promise then().catch():

```javascript
currencyCheck
  .get("MONOPOLYMONEY")
  .then((result) => {
    // code to run if the promise returns a resolve()
  })
  .catch((err) => {
    // code to run if there are any problems
    console.error(`Error: ${err}`);
  });
```
