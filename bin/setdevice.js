#!/usr/bin/env node
var pbxproj = require("xcode");
var fs = require("fs");
var Path = require("path");
var glob = require("glob");
var targetDevice = "";

const families = {
  iphone: "1",
  ipad: "2",
  universal: "1,2"
};

const packagePath = Path.join(process.cwd(), "package.json");
if (fs.existsSync(packagePath)) {
  const pkg = require(packagePath);
  if (typeof pkg.iosDevice != "undefined") {
    targetDevice = pkg.iosDevice;
  }
}
var iosPath = Path.resolve(process.cwd(), "ios");
if (!fs.existsSync(iosPath)) {
  console.log("Could not find path ", iosPath);
  process.exit();
}
xpdir = glob.sync(Path.join(iosPath, "*.xcodeproj"))[0];
if (xpdir.length === 0) {
  console.log("Could not find xcodeproj directory inside: ", iosPath);
  process.exit();
}
let filename = Path.resolve(xpdir, "project.pbxproj");
let properties = {
  TARGETED_DEVICE_FAMILY:
    '"' + (families[targetDevice] ? families[targetDevice] : "1,2") + '"'
};
if (!fs.existsSync(filename)) {
  console.log("Could not find pbxproj file:", filename);
  process.exit();
}
var proj = pbxproj.project(filename);
proj.parse(function(err) {
  for (var key in properties) {
    proj.addBuildProperty(key, properties[key]);
  }
  const out = proj.writeSync();
  fs.writeFileSync(filename, out);
});
