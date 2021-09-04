// cd dist
// node ../scripts/publish.js

var fs = require('fs');
var process = require('process');
var child_process = require('child_process');

var config = JSON.parse(fs.readFileSync('../package.json'));

if (!config || !config.name || !config.version) {
  console.error('package.json error');
  process.exit(1);
}

var version = next_version(config.name, config.version);
exec('npm version ' + version + ' --allow-same-version');
exec('npm publish');
if (exec('git add . -v')) {
  exec('git commit -m "npm publish ' + config.name + '@' + version + '"');
}

function next_version(name, version) {
  var next = version + '';

  var cmd_version = 'npm view ' + name + '@~' + version + ' version';
  var versions = exec(cmd_version);
  var m =
    versions.match(/'(\d+\.\d+\.\d+)'$/) || versions.match(/^(\d+\.\d+\.\d+)$/);
  if (m) {
    var current = m[1].split('.');
    current[2] = parseInt(current[2]) + 1;
    next = current.join('.');
  }

  return next;
}

function exec(cmd) {
  console.log(cmd);
  var execed = child_process.execSync(cmd).toString().trim();
  console.log(execed + '\n');
  return execed;
}
