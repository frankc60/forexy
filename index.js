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
  static #url = "https://www.freeforexapi.com/api/live";
  #data2 = "hello";
  constructor(params) {
    super();
    this.data = params;
    this.mockData = params.mock;
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
        this.emit("fulldata", {
          rates: { [d]: { rate: 15.140088, timestamp: 1607414291 } },
          code: 200,
        });
        this.emit("statusCode", 200);
        this.emit("stream", "stream data...");
        this.emit("pair", d);
        this.emit("timestamp", new Date());
        this.emit("rate", 1.2233);
        setTimeout(resolve, 1000, 1.2233);
      } else {
        https
          .get(`${Forexy.#url}?pairs=${d}`, (res) => {
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
                this.emit("fulldata", prs);
                this.emit("pair", [d]);

                if (prs.message) {
                  reject(
                    `${prs.message} Supported pairs: ${prs.supportedPairs}`
                  );
                } else {
                  this.emit(
                    "timestamp",
                    new Date(prs.rates[d].timestamp * 1000)
                  );
                  this.emit("rate", prs.rates[d].rate);
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

//--------------------------------------------------------------------------------------------
let a = new Forexy({ mock: false });

a.on("request", (x) => {
  console.log("on request:" + x);
});

a.get("usdLsl")
  .then((d) => {
    console.log("gbpusd> " + d);
  })
  .catch((e) => {
    console.error("error1:" + e);
  });

a.on("fulldata", (d) => {
  console.log("on fulldata:" + JSON.stringify(d));
});

a.on("stream", (d) => {
  console.log("on steam: " + d);
});

a.on("statusCode", (d) => {
  console.log("on statusCode:" + d);
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

/* tring USDGBP (exists) get:
  received all data:{"rates":{"USDGBP":{"rate":0.748885,"timestamp":1607405286}},"code":200}




/* trying GBPNZD get: (doesn't have)
received all data:{"message":"The currency pair 'GBPNZD' was not recognised or supported","supportedPairs":["AUDUSD","EURGBP","EURUSD","GBPUSD","NZDUSD","USDAED",
"USDAFN","USDALL","USDAMD","USDANG","USDAOA","USDARS","USDATS","USDAUD","USDAWG","USDAZM","USDAZN","USDBAM","USDBBD","USDBDT","USDBEF","USDBGN","USDBHD","USDBIF",
"USDBMD","USDBND","USDBOB","USDBRL","USDBSD","USDBTN","USDBWP","USDBYN","USDBYR","USDBZD","USDCAD","USDCDF","USDCHF","USDCLP","USDCNH","USDCNY","USDCOP","USDCRC",
"USDCUC","USDCUP","USDCVE","USDCYP","USDCZK","USDDEM","USDDJF","USDDKK","USDDOP","USDDZD","USDEEK","USDEGP","USDERN","USDESP","USDETB","USDEUR","USDFIM","USDFJD",
"USDFKP","USDFRF","USDGBP","USDGEL","USDGGP","USDGHC","USDGHS","USDGIP","USDGMD","USDGNF","USDGRD","USDGTQ","USDGYD","USDHKD","USDHNL","USDHRK","USDHTG","USDHUF",
"USDIDR","USDIEP","USDILS","USDIMP","USDINR","USDIQD","USDIRR","USDISK","USDITL","USDJEP","USDJMD","USDJOD","USDJPY","USDKES","USDKGS","USDKHR","USDKMF","USDKPW",
"USDKRW","USDKWD","USDKYD","USDKZT","USDLAK","USDLBP","USDLKR","USDLRD","USDLSL","USDLTL","USDLUF","USDLVL","USDLYD","USDMAD","USDMDL","USDMGA","USDMGF","USDMKD",
"USDMMK","USDMNT","USDMOP","USDMRO","USDMRU","USDMTL","USDMUR","USDMVR","USDMWK","USDMXN","USDMYR","USDMZM","USDMZN","USDNAD","USDNGN","USDNIO","USDNLG","USDNOK",
"USDNPR","USDNZD","USDOMR","USDPAB","USDPEN","USDPGK","USDPHP","USDPKR","USDPLN","USDPTE","USDPYG","USDQAR","USDROL","USDRON","USDRSD","USDRUB","USDRWF","USDSAR",
"USDSBD","USDSCR","USDSDD","USDSDG","USDSEK","USDSGD","USDSHP","USDSIT","USDSKK","USDSLL","USDSOS","USDSPL","USDSRD","USDSRG","USDSTD","USDSTN","USDSVC","USDSYP",
"USDSZL","USDTHB","USDTJS","USDTMM","USDTMT","USDTND","USDTOP","USDTRL","USDTRY","USDTTD","USDTVD","USDTWD","USDTZS","USDUAH","USDUGX","USDUSD","USDUYU","USDUZS",
"USDVAL","USDVEB","USDVEF","USDVES","USDVND","USDVUV","USDWST","USDXAF","USDXAG","USDXAU","USDXBT","USDXCD","USDXDR","USDXOF","USDXPD","USDXPF","USDXPT","USDYER",
"USDZAR","USDZMK","USDZMW","USDZWD"],"code":1002}


*/
