const mock = require('../data/mock');

function shouldUseMock() {
  const app = getApp();
  return !app || !app.globalData || app.globalData.useMock;
}

function callCloud(name, data = {}) {
  if (shouldUseMock()) {
    return mockCall(name, data);
  }

  return wx.cloud.callFunction({
    name,
    data
  }).then((res) => res.result);
}

function mockCall(name, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (name === 'questions') {
        if (data.action === 'detail') {
          resolve({
            ok: true,
            data: mock.questions.find((item) => item._id === data.id) || mock.questions[0]
          });
          return;
        }

        resolve({
          ok: true,
          data: mock.questions
        });
        return;
      }

      if (name === 'interactions') {
        resolve({
          ok: true,
          data: {
            id: `mock_${Date.now()}`,
            message: '已记录，这个动作会在云环境中写入数据库。'
          }
        });
        return;
      }

      resolve({
        ok: true,
        data: {}
      });
    }, 180);
  });
}

module.exports = {
  callCloud
};
