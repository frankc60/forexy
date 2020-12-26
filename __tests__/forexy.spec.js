//const Forexy = require("../src/index"); //can see seperate line numbers in coveralls report!
const Forexy = require("../forexy.min");
const exec = require("child_process").exec;
//******************************************************************************** */
beforeAll(() => {
  return new Promise((resolve, reject) => {
    process.stdout.write("beforeAll()");

    const child = exec(
      "npm run minifyJS && npm run version:add --silent",
      function (err, stdout, stderr) {
        if (err || stderr) reject(err, stderr);
        else {
          //  console.log("minification complete. Now run tests on minified code.");

          resolve(stdout);
        }
      }
    );
  });
});
//******************************************************************************** */
describe("v.1.0 Tests", () => {
  /*
  test("get real data - USD GBP", async () => {
    const a = new Forexy({ v: 1 });

    expect(a.v).toBe(1);
    expect(a.mockData).toBe(false);

    const w = await a.get("usd gbp");

    expect(w).toEqual(expect.any(Number));
    expect(w).toEqual(a.rate);
    expect(a.rate).toEqual(expect.any(Number));
    expect(a.pair).toEqual(expect.any(String));
    expect(a.timestamp).toEqual(expect.any(Number)); //epoch number time
    expect(a.fulldata).toEqual(expect.any(Object));
    expect(true).toBe(true);
  });
*/
  test("V.1.0.x query GBPUSD, mockdata = true", () => {
    const b = new Forexy({ v: 1, mock: true });

    expect(b.v).toBe(1);
    // console.log(`b.mockData: ${b.mockData}`);
    expect(b.mockData).toBe(true);
    //const expected = { d: dnow.getDate(), m: dnow.getMonth() + 1 };
    // console.log(a);
    //expect(a).toMatchObject(expected);
  });

  test("mock=true, GBPUSD", async () => {
    const b = new Forexy({ v: 1, mock: true });

    //   console.log(`b.mockData: ${b.mockData}`);
    expect(b.mockData).toBe(true);
    expect(b.v).toBe(1);

    const w = await b.get("gbp usd");

    expect(w).toEqual(expect.any(Number));
    expect(w).toEqual(b.rate);
    expect(b.rate).toEqual(expect.any(Number));
    expect(b.pair).toEqual(expect.any(String));
    expect(b.timestamp).toEqual(expect.any(Date));
    expect(b.fulldata).toEqual(expect.any(Object));
    expect(true).toBe(true);
  });
});

//********************************************************************************* */
describe("v.2 Tests", () => {
  test("mock = false, returned value", () => {
    const a = new Forexy();
    expect(a.v).toBe(2);
    expect(a.mockData).toBe(false);

    a.get("GBP NZD")
      .then((pp) => {
        expect(pp).toEqual(expect.any(String)); //is a number, but in string format.
        expect(pp).toMatch(/\d+\D\d+/g); // 1.232334
      })
      .catch((err) => {
        expect(true).toBe(true);
        expect(err).toMatch(/this should not be displayed/g);
      });
  });

  test("mock = true, returned value", () => {
    const a = new Forexy({ mock: true });
    expect(a.v).toBe(2);
    expect(a.mockData).toBe(true);

    a.get("GBP NZD")
      .then((pp) => {
        expect(pp).toEqual(expect.any(Number));
      })
      .catch((err) => {
        expect(true).toBe(true);
        expect(err).toMatch(/this should not be displayed/g);
      });
  });

  test("defaults(mock=false, v.2), invalid currency", () => {
    const a = new Forexy();

    expect(a.mockData).toBe(false);
    expect(a.v).toBe(2);
    a.get("MONOPOLY")
      .then((pp) => {
        // console.log("a.pp = " + pp);

        expect(pp).toEqual("should not display this");
      })
      .catch((err) => {
        //'MONOPO' Not Supported, error 5001 @ Sat Dec 12 2020 12:32:24 GMT+1300 (New Zealand Daylight Time)
        expect(err).toMatch(/Not Supported, error 500./g);
      });
  });

  test("defaults (mock=false, v.2) get real data - GBPUSD", () => {
    const b = new Forexy({ mock: false });
    expect(b.v).toBe(2);

    // console.log(`b.mockData: ${b.mockData}`);
    expect(b.mockData).toBe(false);

    b.get("GBP USD")
      .then((pp) => {
        expect(b.timestamp).toEqual(expect.any(Number)); //is a date epoch, in number format.
        expect(pp).toEqual(expect.any(Number));
      })
      .catch((e1) => {
        expect(true).toBe(true);
        //   console.log("sdfg:" + e1);
      });
  });

  test("query NONPAIR value, mockdata = false", async () => {
    const c = new Forexy({ mock: false });

    c.mockData = false;
    expect(c.mockData).toBe(false);

    try {
      const w = await c.get("NONPAIR");

      expect(w).toMatch(/not processed/g);
    } catch (err) {
      expect(err).toMatch(/Not Supported, error 500./g);
    }
  });
});
//******************************************************************************** */
describe("V.2 Events", () => {
  const b = new Forexy({ mock: true });
  //const dnow = new Date();
  //******************************************************************************** */

  test("get('gbpusd') expect a returned number value, and check events", async () => {
    const b = new Forexy({ mock: true });
    expect(b.v).toBe(2);

    expect(b.mockData).toEqual(true);

    b.on("statusCode", (d) => {
      //  console.log("on statusCode:" + d);
      expect(d).toEqual(expect.any(Number));
      expect(d).toEqual(200);
      //  expect(b.rate).toEqual(expect.any(Number));
    });

    const w = await b.get("usd gbp");

    expect(w).toEqual(expect.any(Number));
    expect(w).toEqual(b.rate);
    expect(b.rate).toEqual(expect.any(Number));
    expect(b.pair).toEqual(expect.any(String));
    expect(b.timestamp).toEqual(expect.any(Date));
    expect(b.fulldata).toEqual(expect.any(Object));
    expect(true).toBe(true);
  });
});
//******************************************************************************** */
//******************************************************************************** */
//******************************************************************************** */
//******************************************************************************** *//
/*
const Forexy = require("../forex");

let a = new Forexy({ mock: false });

a.on("statusCode", (d) => {
  console.log("on statusCode:" + d);
});

a.on("request", (x) => {
  console.log("on request:" + x);
});

a.on("fulldata", (d) => {
  console.log("on fulldata:" + JSON.stringify(d));
});

a.on("stream", (d) => {
  console.log("on stream: " + d);
});

a.on("timestamp", (d) => {
  console.log("on timestamp:" + d);
});

a.on("rate", (d) => {
  console.log("on rate:" + d);
});

a.on("pair", (d) => {
  console.log("on pair:" + d);
});

a.get("usdgbp")
  .then((d) => {
    console.log("gbpusd> " + d);
  })
  .catch((e) => {
    console.error("error1:" + e);
  });
*/
