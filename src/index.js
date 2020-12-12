const https = require("https");

class Ee {
  constructor() {
    this.handlers = [];
  }
  on = (type, fn) => {
    this.handlers.push([type, fn]);
  };
  emit = (type, data) => {
    this.handlers
      .filter((handler) => handler[0] == type)
      .forEach((handler) => handler[1](data, type));
  };
}

class Forexy extends Ee {
  static _url = "https://www.freeforexapi.com/api/live";
  static _url2 = "https://coffeeboat.co.uk/forexy/forexy.php";

  constructor(args = {}) {
    super();

    this.v = args.v || 1;
    this.mockData = args.mock || false;
    this.timestamp = "";
    this.pair = "";
    this.rate = 0;
    this.fulldata = "";
    this.cache = 0;
    this.code = 0;
    this.author = "";
  }

  static v2Split(pair) {
    let twoPair = pair.split(/(...)(...)/);

    let f = twoPair[1];
    let t = twoPair[2];

    // console.log(`t:${t}, f:${f}`);
    return [f, t];
  }

  static tidyPairs(pair) {
    let formattedPair = pair.toUpperCase();
    formattedPair = formattedPair.replace(/\//g, "");
    formattedPair = formattedPair.replace(/\-/g, "");
    formattedPair = formattedPair.replace(/\s/g, "");
    // console.log("tidyPairs:" + pair + " to: " + formattedPair);
    return formattedPair;
  }

  get(pairs) {
    const uPairs = Forexy.tidyPairs(pairs);
    //console.log(`this.v: ${this.v}, this.mockData: ${this.mockData}`);
    return new Promise((resolve, reject) => {
      try {
        this.emit("request", uPairs);
        if (this.v == 1) {
          resolve(this._retrieveData(uPairs));
        } else {
          let [ff, tt] = Forexy.v2Split(uPairs);
          resolve(this._retrieveData2(ff, tt));
          //console.log(`this.v = ${this.v}`);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  _retrieveData(d) {
    return new Promise((resolve, reject) => {
      if (this.mockData) {
        resolve(this.mockRetrieveData(d));
      } else {
        https
          .get(`${Forexy._url}?pairs=${d}`, (res) => {
            let data = "";
            this.emit("statusCode", res.statusCode);
            this.emit("headers", res.headers);

            res.on("data", (chunk) => {
              //process.stdout.write(chunk);
              this.emit("stream", chunk);
              data += chunk;
            });
            res.on("end", () => {
              try {
                let prs = JSON.parse(data);
                this.fulldata = prs;
                this.pair = d;
                this.emit("fulldata", this.fulldata);
                this.emit("pair", this.pair);

                if (prs.message) {
                  reject(
                    `${prs.message} Supported pairs: ${prs.supportedPairs}`
                  );
                } else {
                  this.timestamp = prs.rates[d].timestamp * 1000;
                  this.rate = prs.rates[d].rate;
                  this.emit("timestamp", new Date(this.timestamp));
                  this.emit("rate", this.rate);
                  resolve(prs.rates[d].rate);
                }
                // {"message":"The currency pair 'GBPNZD' was not recognised or supported"
              } catch (er) {
                reject(er);
              }
            });
          })
          .on("error", (e) => {
            reject(e);
          });
      }
    });
  }

  mockRetrieveData(d) {
    return new Promise((resolve, reject) => {
      //

      this.pair = d;
      this.timestamp = new Date();
      this.rate = 1.2233;
      this.cache = 0;
      this.code = 200;
      this.author = "frankc60";
      this.fulldata = {
        rates: {
          [d]: {
            rate: this.rate,
            timestamp: this.timestamp,
            code: this.code,
            cache: this.cache,
            author: this.author,
            pair: this.pair,
          },
        },
        code: this.code,
      };

      setTimeout(() => {
        this.emit("headers", {
          date: "Tue, 08 Dec 2020 07:58:34 GMT",
          "content-type": "text/html; charset=UTF-8",
          "transfer-encoding": "chunked",
          connection: "close",
          "set-cookie": [
            "__cfduid=d830149f8dcf; expires=Thu, 07-Jan-21 07:58:34 GMT; path=/; domain=.google.com; HttpOnly; SameSite=Lax",
          ],
          vary: "Accept-Encoding",
          "cf-cache-status": "DYNAMIC",
          nel: '{"report_to":"cf-nel","max_age":604800}',
        });
        this.emit("fulldata", this.fulldata);
        this.emit("statusCode", 200);
        this.emit("stream", "stream data...");
        this.emit("pair", this.pair);
        this.emit("timestamp", this.timestamp);
        this.emit("rate", this.rate);
        resolve(this.rate);
      }, 1000);
    });
  }

  _retrieveData2(ffrom, tto) {
    return new Promise((resolve, reject) => {
      if (this.mockData) {
        resolve(this.mockRetrieveData(ffrom + tto));
      } else {
        //console.log(`_retrieveData2(${ffrom}, ${tto})`);
        https
          .get(`${Forexy._url2}?f=${ffrom}&t=${tto}`, (res) => {
            let data = "";
            this.emit("statusCode", res.statusCode);
            this.emit("headers", res.headers);

            res.on("data", (chunk) => {
              //process.stdout.write(chunk);
              this.emit("stream", chunk);
              data += chunk;
            });
            res.on("end", () => {
              //console.log(JSON.parse(data));
              try {
                let prs = JSON.parse(data);
                this.fulldata = prs;
                this.pair = ffrom + tto;
                this.cache = prs.cache;
                this.code = prs.code;
                this.author = prs.author;

                this.emit("fulldata", this.fulldata);
                this.emit("pair", this.pair);

                if (prs.error) {
                  reject(
                    `${prs.error}, error ${prs.code} @ ${Date(prs.timestamp)}`
                  );
                } else {
                  this.timestamp = prs.timestamp * 1000;
                  this.rate = prs.rate;
                  this.emit("timestamp", new Date(this.timestamp));
                  this.emit("rate", this.rate);
                  resolve(prs.rate);
                }
                // {"message":"The currency pair 'GBPNZD' was not recognised or supported"
              } catch (er) {
                reject(er);
              }
            });
          })
          .on("error", (e) => {
            reject(e);
          });
      }
    });
  }
}

module.exports = Forexy;

//--------------------------------------------------------------------------------------------
/*
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
