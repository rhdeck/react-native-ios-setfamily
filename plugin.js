const Path = require("path");
const fs = require("fs");
const cp = require("child_process");
module.exports = [
  {
    name: "setdevice <devicetype>",
    description: "Set iOS device type (options: iphone, ipad, universal)",
    func: (a, b, c) => {
      const input = a[0];
      const validvalues = ["ipad", "iphone", "universal"];
      if (validvalues.indexOf(input) == -1) {
        console.log("This is not a valid device type: ", input);
        console.log(
          "Try iphone, ipad or universal if you want to support both"
        );
      } else {
        const ppath = Path.join(process.cwd(), "package.json");
        const p = require(ppath);
        p.iosDevice = input;
        fs.writeFileSync(ppath, JSON.stringify(p, null, 2));
        const path = Path.join(__dirname, "bin", "setdevice.js");
        cp.spawnSync("/usr/bin/env", ["node", path], { stdio: "inherit" });
      }
    }
  }
];
