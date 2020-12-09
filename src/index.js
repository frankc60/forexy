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

  constructor({ mock } = { mock: false }) {
    super();
    //this.data = params;
    this.mockData = mock;
    this.timestamp = "";
    this.pair = "";
    this.rate = 0;
    this.fulldata = "";
  }
  get(pairs) {
    const uPairs = pairs.toUpperCase();
    return new Promise((resolve, reject) => {
      try {
        this.emit("request", uPairs);
        resolve(this._retrieveData(uPairs));
      } catch (err) {
        reject(err);
      }
    });
  }

  _retrieveData(d) {
    return new Promise((resolve, reject) => {
      if (this.mockData) {
        this.fulldata = {
          rates: { [d]: { rate: 15.140088, timestamp: 1607414291 } },
          code: 200,
        };
        this.pair = d;
        this.timestamp = new Date();
        this.rate = 1.2233;

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
