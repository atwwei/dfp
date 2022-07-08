const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

(function main() {
  const packageJson = resolve(__dirname, '../package.json');
  UpdatePackageJson(packageJson);
})();

function UpdatePackageJson(packageJsonFile) {
  log('Checking package settings in ' + packageJsonFile, 34);

  let updated = false;

  const content = readFileSync(packageJsonFile).toString();
  const data = JSON.parse(content);

  if (!data) {
    throw new Error('package.json data error');
  }

  ['dependencies', 'devDependencies'].forEach((key) => {
    if (data[key]) {
      Object.keys(data[key]).forEach((package) => {
        const version = data[key][package];
        data[key][package] = execSync('npm view ' + package + '@latest version')
          .toString()
          .trim();
        if (version[0] == '^' || version[0] == '~') {
          data[key][package] = version[0] + data[key][package];
        }
        if (version != data[key][package]) {
          log('Upgrade to ' + package + '@' + data[key][package], 32);
          updated = true;
        }
      });
    }
  });

  if (updated) {
    log('Resave package settings to package.json', 32);
    writeFileSync(packageJsonFile, JSON.stringify(data, null, 2) + '\n');
  }
}

function log(message, color) {
  if (color) {
    message = '\x1b[' + color + 'm' + message + '\x1b[0m';
  }
  console.log(message);
}
