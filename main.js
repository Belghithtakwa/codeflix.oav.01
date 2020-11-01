const path = require("path");
const fs = require("fs");

function parseINIString(data) {
  var regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*;.*$/,
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach((line) => {
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      var match = line.match(regex.param);
      if (section) {
        value[section][match[1]] = match[2];
      } else {
        value[match[1]] = match[2];
      }
    } else if (regex.section.test(line)) {
      var match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    } else if (line.length == 0 && section) {
      section = null;
    }
  });
  return value;
}

function parseENV(data) {
  console.log(data);
  var regex = {
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*#*$/,
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach((line) => {
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      var match = line.match(regex.param);
      if (section) {
        value[section][match[1]] = match[2];
      } else {
        value[match[1]] = match[2];
      }
    }
  });
  return value;
}
if (path.extname(process.argv[2]) === ".env") {
  var data = fs.readFileSync(path.resolve(process.argv[2]), "utf8");
  var javascript_env = parseENV(data);
  fs.writeFile(
    (process.argv[2] + Math.random(100) + ".json"),
    JSON.stringify(javascript_env),
    (err) => {
      if (err) throw console.log(err);
    })
} else if (path.extname(process.argv[2] === ".ini")) {
  var data = fs.readFileSync(path.resolve(process.argv[2]), "utf8");
  var javascript_ini = parseINIString(data);
  fs.writeFile(
    process.argv[2] + Math.random(100) + ".json",
    JSON.stringify(javascript_ini),
    function (err) {
      if (err) return console.log(err);
    }
  );
} else {
  console.log("invalid extension");
}
