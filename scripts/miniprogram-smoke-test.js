const automator = require('miniprogram-automator');
const { cliPath, rootDir, automatorPort, envId } = require('./config');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function withTimeout(promise, timeoutMs, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function waitForData(page, path, message) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 15000) {
    const value = await page.data(path);
    if (Array.isArray(value)) {
      if (value.length > 0) {
        return value;
      }
    } else if (value) {
      return value;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(message);
}

(async () => {
  console.log('launching miniprogram automator...');
  let miniProgram;
  try {
    miniProgram = await withTimeout(automator.launch({
      cliPath,
      projectPath: rootDir,
      port: automatorPort,
      trustProject: true,
      timeout: 60000
    }), 70000, 'automator launch');
  } catch (error) {
    if (!String(error.message || error).includes('Port') || !String(error.message || error).includes('in use')) {
      throw error;
    }

    console.log(`automator port ${automatorPort} is already open, connecting to it...`);
    miniProgram = await withTimeout(automator.connect({
      wsEndpoint: `ws://127.0.0.1:${automatorPort}`
    }), 20000, 'automator connect');
  }

  try {
    console.log('initializing cloud database with bootstrap...');
    const bootstrapResult = await withTimeout(miniProgram.evaluate(() => {
      return wx.cloud.callFunction({ name: 'bootstrap' }).then((res) => res.result);
    }), 30000, 'bootstrap cloud function');
    assert(bootstrapResult && bootstrapResult.ok, 'bootstrap cloud function failed');

    console.log('checking home page...');
    const home = await miniProgram.reLaunch('/pages/home/home');
    await waitForData(home, 'questions', 'home questions did not load');
    const questions = await home.data('questions');
    assert(questions[0]._id, 'first question has no id');

    console.log('checking question detail...');
    const detail = await miniProgram.reLaunch(`/pages/question/question?id=${questions[0]._id}`);
    await waitForData(detail, 'question', 'question detail did not load');
    await detail.callMethod('onReasonInput', {
      detail: {
        value: '我想继续聊这个具体问题'
      }
    });
    const reasonLength = await detail.data('inviteReasonLength');
    assert(reasonLength >= 8, 'invite reason input did not update page data');

    console.log('checking private question creation...');
    const compose = await miniProgram.switchTab('/pages/compose/compose');
    await compose.callMethod('switchMode', {
      currentTarget: {
        dataset: {
          mode: '提出问题'
        }
      }
    });
    await compose.callMethod('selectVisibility', {
      currentTarget: {
        dataset: {
          visibility: 'private'
        }
      }
    });
    await compose.callMethod('onTopicInput', {
      detail: {
        value: '[AUTO_TEST] 如何判断一次深聊是否真正尊重边界？'
      }
    });
    await compose.callMethod('onContentInput', {
      detail: {
        value: '这是自动化测试创建的私密问题，不会进入公开问题广场。它用于验证提问、私密可见性、云函数写入和用户档案联动是否正常。测试内容会保持克制，不涉及真实用户隐私，也不用于正式展示。'
      }
    });
    await compose.callMethod('submit');
    await compose.waitFor(1000);

    console.log('checking profile page...');
    const profile = await miniProgram.switchTab('/pages/profile/profile');
    await waitForData(profile, 'profile', 'profile did not load');
    const loadedProfile = await profile.data('profile');
    assert(loadedProfile.nickname, 'profile nickname missing');
    assert(loadedProfile.inviteQuotaDate, 'profile invite quota date missing');

    console.log(`miniprogram smoke test ok: ${envId}`);
  } finally {
    await miniProgram.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
