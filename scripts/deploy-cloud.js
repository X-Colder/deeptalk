const { spawnSync } = require('child_process');
const { cliPath, rootDir, envId, devtoolsPort, cloudFunctions } = require('./config');

function runCli(args, options = {}) {
  const result = spawnSync(cliPath, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit'
  });

  if (options.capture) {
    return {
      status: result.status,
      output: `${result.stdout || ''}${result.stderr || ''}`
    };
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  return {
    status: result.status,
    output: ''
  };
}

function deploy() {
  return runCli([
    'cloud',
    'functions',
    'deploy',
    '--env',
    envId,
    '--names',
    ...cloudFunctions,
    '--remote-npm-install',
    '--project',
    rootDir,
    '--port',
    String(devtoolsPort),
    '--lang',
    'zh'
  ], { capture: true });
}

let result = deploy();
process.stdout.write(result.output);

if (result.status !== 0 && result.output.includes('Creating')) {
  console.log('cloud functions are still creating, retrying in 20s...');
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20000);
  result = deploy();
  process.stdout.write(result.output);
}

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log(`cloud deploy ok: ${envId}`);
