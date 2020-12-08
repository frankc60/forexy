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

```

Check out the examples to see various options used.

### Events

#### on request

#### statusCode

#### stream

#### fulldata

#### pair

#### timestamp

This returns a Date object, which can be further manipulated, this will be approximately the current timestamp.

## Examples
