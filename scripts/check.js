const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { rootDir } = require('./config');

const jsFiles = [
  'miniprogram/app.js',
  'miniprogram/utils/cloud.js',
  'miniprogram/data/mock.js',
  'miniprogram/pages/home/home.js',
  'miniprogram/pages/question/question.js',
  'miniprogram/pages/compose/compose.js',
  'miniprogram/pages/letter/letter.js',
  'miniprogram/pages/profile/profile.js',
  'cloudfunctions/bootstrap/index.js',
  'cloudfunctions/questions/index.js',
  'cloudfunctions/interactions/index.js',
  'cloudfunctions/users/index.js'
];

const jsonFiles = [
  'project.config.json',
  'miniprogram/app.json',
  'miniprogram/sitemap.json'
];

for (const file of jsonFiles) {
  JSON.parse(fs.readFileSync(path.join(rootDir, file), 'utf8'));
}

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', path.join(rootDir, file)], {
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log('check ok');
