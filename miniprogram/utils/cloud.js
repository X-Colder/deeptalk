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
        if (data.action === 'createInvite') {
          mock.profile.inviteQuota = Math.max(0, mock.profile.inviteQuota - 1);
          mock.profile.stats.invitesSent += 1;
        }
        if (data.action === 'createQuestion') {
          mock.profile.stats.questions += 1;
          mock.profile.liveStats.questions += 1;
          if (data.visibility !== 'private') {
            mock.questions.unshift({
              _id: `mock_q_${Date.now()}`,
              title: data.topic,
              intro: data.content.slice(0, 80),
              authorName: mock.profile.nickname,
              authorSnapshot: {
                profileId: mock.profile._id,
                nickname: mock.profile.nickname,
                trustScore: mock.profile.trustScore,
                portraitSummary: mock.profile.portraitSummary
              },
              visibility: data.visibility || 'public',
              visibilityLabel: data.visibility === 'private' ? '私密深聊' : '公开问答',
              mood: '待分类',
              answerCount: 0,
              inviteCount: 0,
              communityTags: [],
              createdAt: '刚刚',
              featuredAnswer: {
                answerId: '',
                userName: '等待回答',
                style: '尚未形成评价',
                communityTags: [],
                text: '这个问题还在等待第一个认真回答。'
              }
            });
          }
        }
        if (data.action === 'createAnswer') {
          mock.profile.stats.answers += 1;
          mock.profile.liveStats.answers += 1;
        }
        if (data.action === 'createEvaluation') {
          mock.profile.trustScore += 1;
        }

        resolve({
          ok: true,
          data: {
            id: `mock_${Date.now()}`,
            message: '已记录，这个动作会在云环境中写入数据库。'
          }
        });
        return;
      }

      if (name === 'users') {
        if (data.action === 'updateProfile') {
          Object.assign(mock.profile, data.profile || {});
        }

        resolve({
          ok: true,
          data: mock.profile
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
