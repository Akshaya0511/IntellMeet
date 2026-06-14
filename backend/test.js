const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.o2p0svi.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.log("DNS Error:", err);
    } else {
      console.log(addresses);
    }
  }
);