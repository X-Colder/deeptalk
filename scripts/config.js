const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const cliPath = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';
const envId = process.env.WX_CLOUD_ENV || 'cloud1-d7g6ppwwhbce71043';
const devtoolsPort = Number(process.env.WX_DEVTOOLS_PORT || 24139);
const automatorPort = Number(process.env.WX_AUTOMATOR_PORT || 9421);
const cloudFunctions = ['bootstrap', 'questions', 'interactions', 'users'];

module.exports = {
  rootDir,
  cliPath,
  envId,
  devtoolsPort,
  automatorPort,
  cloudFunctions
};
