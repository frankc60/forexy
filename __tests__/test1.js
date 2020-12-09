const Forexy = require("../forexy.min");
const exec = require("child_process").exec;

beforeAll(() => {
  return new Promise((resolve, reject) => {
    process.stdout.write("beforeAll()");

    const child = exec(
      "npm run minifyJS && npm run version:add --silent",
      function (err, stdout, stderr) {
        if (err || stderr) reject(err, stderr);
        else {
          process.stdout.write(
            "minification complete. Now run tests on minified code."
          );

          resolve(stdout);
        }
      }
    );
  });
});

/*jest.mock("http");

//http.get.mockResolvedValue("hello world");

/*
jest.mock("../onday.min.js", () => {
  return {
    check: jest.fn().mockImplementation(() => 1.42),
  };
});
*/

describe("Forexy()", () => {
  const b = new Forexy({ mock: true });
  const dnow = new Date();
  //******************************************************************************** */

  test("Default value is to use Real Data, mockdata to be false", () => {
    const a = new Forexy();

    expect(a.mockData).toBe(false);
    console.log(`mockData: ${a.mockData}`);
    //const expected = { d: dnow.getDate(), m: dnow.getMonth() + 1 };
    // console.log(a);
    //expect(a).toMatchObject(expected);
  });
  test("query GBPUSD, mockdata = true", () => {
    expect(b.mockData).toBe(true);

    console.log(`mockData: ${b.mockData}`);
    //const expected = { d: dnow.getDate(), m: dnow.getMonth() + 1 };
    // console.log(a);
    //expect(a).toMatchObject(expected);
  });

  //******************************************************************************** */
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
