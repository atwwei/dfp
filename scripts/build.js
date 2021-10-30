const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

(function main() {
  const packageJson = resolve(__dirname, '../dist/package.json');
  CheckPackageJson(packageJson);
})();

function CheckPackageJson(packageJsonFile) {
  log('Checking package settings in ' + packageJsonFile, 34);

  let updated = false;

  const content = readFileSync(packageJsonFile).toString();
  const data = JSON.parse(content);

  if (!data) {
    throw new Error('package.json data error');
  }

  if (data.devDependencies) {
    log('Removing devDependencies section in package.json', 34);
    delete data.devDependencies;
    updated = true;
  }

  const { name, version } = data;

  const patchs = execSync(
    'npm view ' + name + '@~' + version + ' version',
  ).toString();

  const match = patchs.trim().match(/(\d+\.\d+\.\d+)'?$/);

  if (match) {
    const latest = match[1];
    if (latest > version || latest == version) {
      const split = latest.split('.');
      split[2] = parseInt(split[2]) + 1;
      data.version = split.join('.');
      log('Set version to ' + data.version, 34);
      updated = true;
    }
  }

  if (updated) {
    log('Resave package settings to package.json', 32);
    writeFileSync(packageJsonFile, JSON.stringify(data, null, 2));
  }
}

function log(message, color) {
  if (color) {
    message = '\x1b[' + color + 'm' + message + '\x1b[0m';
  }
  console.log(message);
}
