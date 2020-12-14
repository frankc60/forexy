# forexy

![dependencies](https://img.shields.io/badge/dependency%20count-0-blue)
![npm](https://img.shields.io/npm/v/forexy)
![CI Testing](https://github.com/frankc60/forexy/workflows/CI_Testing/badge.svg)
![install size](https://badgen.net/badgesize/normal/https/unpkg.com/forexy/forexy.min.js)
![Code Scan Alerts](https://github.com/frankc60/forexy/workflows/CodeQL/badge.svg)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Ffrankc60%2Fforexy%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/frankc60/forexy/goto?ref=main)
[![Coverage Status](https://coveralls.io/repos/github/frankc60/forexy/badge.svg?branch=main)](https://coveralls.io/github/frankc60/forexy?branch=main)

A **small**, **'zero dependency'** **fast** node.js package that delivers the latest forex rates for a given currency pair.

## Installation

Using npm:

```shell
$ npm i --save forexy
```

## Usage and Examples

To retrieve the latest forex rates for USD/GBP (_US dollar to Great British Pound_) we pass the two currency codes to the **get()** method. The **get()** method returns the current rate, in the first currency denomination (in this example in USD $).

The currency pair are case insensitive and can be split using: a space, kept together, a forward slash /, or a dash -

[![See Demo on runkit](https://badge.runkitcdn.com/forexy.svg)](https://runkit.com/embed/7ez52pfsoc6p)

```javascript
const Forexy = require("forexy");

const currencyCheck = new Forexy();

currencyCheck
  .get("USD/GBP") //case insensitive and in formats: "usdgbp", "usb gbp", "usd-gbp", "usd/gbp"
  .then((result) => {
    console.log(`USD/GBP rate is ${result}`);
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
```

## Promise

Forexy returns a Promise, which allows you to use an **async**/**await** function, or **then().catch()**.

```javascript
const currency = async (pair) => {
  try {
    let result = await currencyCheck.get(pair).then((rate) => rate);
    console.log(`USD/GBP rate is ${result}`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

currency("USD GBP");
```

...which is the same as

```javascript
currencyCheck
  .get("usdgbp")
  .then((result) => {
    console.log(`USD-GBP rate is ${result}`);
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
```

## Events

Forexy also has a host of Events that you can use through the lifecycle process.

### fulldata

Get a JSON object with all data.

```javascript
currencyCheck.on("fulldata", (data) => {
  //returned JSON of all data.
  console.log("on fulldata:" + JSON.stringify(data));
  //eg. {"rates":{"USDLSL":{"rate":15.140088,"timestamp":1607414291}},"code":200}
});
```

### timestamp

This returns a Date object, which can be further manipulated, this will be approximately the current timestamp.

```javascript
currencyCheck.on("timestamp", (data) => {
  //This returns a Date object.
  console.log("on timestamp:" + data); //Tues Dec 08 2021 20:51:10 GMT
});
```

### pair

Returns the currency pair values, in uppercase.

```javascript
currencyCheck.on("pair", (data) => {
  console.log("on pair:" + data); //USDGBP
});
```

### statusCode

```javascript
currencyCheck.on("statusCode", (data) => {
  //If no errors then returns '200'
  console.log("on statusCode:" + data);
});
```

### rate

_rate_ is the same as the default value returned from the get() method.

```javascript
currencyCheck.on("rate", (data) => {
  console.log("on rate:" + data);
  //eg. 1.2234
});
```

### request

Triggered before the request is made. Returns the currency pair value.

```javascript
currencyCheck.on("request", (data) => {
  //called before the request is made, returns the currency pair
  console.log("on request:" + data);
});
```

### stream

The same returned data as 'fulldata' but streamed.

```javascript
currencyCheck.on("stream", (data) => {
  //streamed data
  console.log("on stream: " + data);
});
```

## Properties v.1.0

Forexy has constructor properties (prototypes), which get set during the last successful calling of the get() method.

### obj.timestamp

This is an **epoch** timestamp. Convert it to a **Date(obj.timestamp)** object type to manipulate it as a Date.

### obj.pair

Six characters of the two currency codes. For example, USDAUD (US Dollar against Australian Dollar).

### obj.rate

A _numeric float_ indicating the last returned rate for the given currency **pair**, for example, 1.7453

### obj.fulldata

An _object_ of all values returned from the last get().

---

#### A Properties Example:

```javascript
const forex = new Forexy();

const currency = async (pair) => {
  try {
    let result = await forex.get(pair).then((rate) => rate);
    console.log(
      `\nCurrency ${pair} rate is ${result}
      \ttimestamp:${Date(forex.timestamp)}
      \tpair:${forex.pair}  
      \trate:${forex.rate}         
      \tfulldata:${JSON.stringify(forex.fulldata)}
      `
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

currency("USD NZD");
```

output

```{r, engine='bash', count_lines}
Currency USD NZD rate is 1.410037
        timestamp:timestamp:Sun Dec 13 2021 11:39:21 GMT
        pair:USDNZD
        rate:1.410037
        fulldata:{"rates":{"USDNZD":{"rate":1.410037,"timestamp":1607812505}},"code":200}
```

---

## Error Handling

Forexy has built in Error Handling, which will _catch_ any issues in development.

### Unsupported Forex Pairs

Forexy currently only offers the most popular currency pairs. I plan to add more as the demand grows.

If you enter an invalid currency pair, the promise will reject with a list of supported currency pairs available.

If you use Forexy with **async / await** then wrap the call into a Try {} catch {}. Otherwise use the Promise then().catch(). Any Errors will be directed to the **catch()**

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

or using promise then().catch():

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

### Supported Currency Pairs. v.1.0

AUDUSD,EURGBP,EURUSD,GBPUSD,NZDUSD,USDAED,USDAFN,USDALL,USDAMD,USDANG,USDAOA,USDARS,USDATS,USDAUD,USDAWG,USDAZM,USDAZN,USDBAM,  
USDBBD,USDBDT,USDBEF,USDBGN,USDBHD,USDBIF,USDBMD,USDBND,USDBOB,USDBRL,USDBSD,USDBTN,USDBWP,USDBYN,USDBYR,USDBZD,USDCAD,USDCDF,  
USDCHF,USDCLP,USDCNH,USDCNY,USDCOP,USDCRC,USDCUC,USDCUP,USDCVE,USDCYP,USDCZK,USDDEM,USDDJF,USDDKK,USDDOP,USDDZD,USDEEK,USDEGP,  
USDERN,USDESP,USDETB,USDEUR,USDFIM,USDFJD,USDFKP,USDFRF,USDGBP,USDGEL,USDGGP,USDGHC,USDGHS,USDGIP,USDGMD,USDGNF,USDGRD,USDGTQ,  
USDGYD,USDHKD,USDHNL,USDHRK,USDHTG,USDHUF,USDIDR,USDIEP,USDILS,USDIMP,USDINR,USDIQD,USDIRR,USDISK,USDITL,USDJEP,USDJMD,USDJOD,  
USDJPY,USDKES,USDKGS,USDKHR,USDKMF,USDKPW,USDKRW,USDKWD,USDKYD,USDKZT,USDLAK,USDLBP,USDLKR,USDLRD,USDLSL,USDLTL,USDLUF,USDLVL,  
USDLYD,USDMAD,USDMDL,USDMGA,USDMGF,USDMKD,USDMMK,USDMNT,USDMOP,USDMRO,USDMRU,USDMTL,USDMUR,USDMVR,USDMWK,USDMXN,USDMYR,USDMZM,  
USDMZN,USDNAD,USDNGN,USDNIO,USDNLG,USDNOK,USDNPR,USDNZD,USDOMR,USDPAB,USDPEN,USDPGK,USDPHP,USDPKR,USDPLN,USDPTE,USDPYG,USDQAR,  
USDROL,USDRON,USDRSD,USDRUB,USDRWF,USDSAR,USDSBD,USDSCR,USDSDD,USDSDG,USDSEK,USDSGD,USDSHP,USDSIT,USDSKK,USDSLL,USDSOS,USDSPL,  
USDSRD,USDSRG,USDSTD,USDSTN,USDSVC,USDSYP,USDSZL,USDTHB,USDTJS,USDTMM,USDTMT,USDTND,USDTOP,USDTRL,USDTRY,USDTTD,USDTVD,USDTWD,  
USDTZS,USDUAH,USDUGX,USDUSD,USDUYU,USDUZS,USDVAL,USDVEB,USDVEF,USDVES,USDVND,USDVUV,USDWST,USDXAF,USDXAG,USDXAU,USDXBT,USDXCD,  
USDXDR,USDXOF,USDXPD,USDXPF,USDXPT,USDYER,USDZAR,USDZMK,USDZMW,USDZWD.

Drop me a line if your currency pair isn't there, and I will look at getting it added. You can also raise a [Github Issue](https://github.com/frankc60/forexy/issues).

## Version Changes

- 1.0.x - Using an public free API, JSON returned is fixed.

- 1.1.x - Setting up a Custom API, with the JSON customised for Forexy. Caching including to allow more traffic. Backwards
  compatible with v.1.0.x. A larger number of currency pair values available. New functionality to be added - coming very soon !

  BETA access is available for v.1.1.x - call the Forexy constructor method with the object values: { v:2 }, for example: `const currencyCheck = new Forexy({ v: 2 });`. When you call the get() method the **new** API call will be used and return a slightly different object, with different properties. It is planned to make this new functionality available soon and have it fully backwards compatible with v.1.0.x.
