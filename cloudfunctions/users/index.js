const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function buildDefaultProfile(openid) {
  const suffix = openid.slice(-4).toUpperCase();
  return {
    _openid: openid,
    nickname: `安静的表达者 ${suffix}`,
    avatarType: 'text',
    bio: '愿意认真表达，也尊重别人的沉默。',
    valuesTags: ['由问答内容总结', '尊重边界', '不消费痛苦'],
    communicationTags: ['由读者评价生成', '慢热', '愿意讨论分歧'],
    portraitSummary: '画像将根据公开问答、深聊反馈和读者评价持续生成。',
    evaluationSource: '画像来自内容和他人评价，不由用户手动选择。',
    boundaries: ['不接受查户口式聊天', '不接受暧昧试探', '不交换私人联系方式'],
    trustScore: 60,
    inviteQuota: 3,
    inviteQuotaDate: todayKey(),
    status: 'active',
    role: 'member',
    stats: {
      questions: 0,
      answers: 0,
      invitesSent: 0,
      acceptedInvites: 0,
      reports: 0
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

async function getOrCreateProfile(openid) {
  const existed = await db.collection('profiles')
    .where({ _openid: openid })
    .limit(1)
    .get();

  if (existed.data.length) {
    const profile = existed.data[0];
    if (profile.inviteQuotaDate !== todayKey()) {
      await db.collection('profiles').doc(profile._id).update({
        data: {
          inviteQuota: 3,
          inviteQuotaDate: todayKey(),
          updatedAt: Date.now()
        }
      });

      return {
        ...profile,
        inviteQuota: 3,
        inviteQuotaDate: todayKey(),
        updatedAt: Date.now()
      };
    }

    return profile;
  }

  const profile = buildDefaultProfile(openid);
  const result = await db.collection('profiles').add({ data: profile });
  return {
    ...profile,
    _id: result._id
  };
}

function pickProfileUpdate(payload = {}) {
  const allowed = ['nickname', 'bio', 'boundaries'];
  return allowed.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      result[key] = payload[key];
    }
    return result;
  }, {});
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const action = event.action || 'getOrCreate';
  const profile = await getOrCreateProfile(wxContext.OPENID);

  if (action === 'updateProfile') {
    const update = pickProfileUpdate(event.profile);
    await db.collection('profiles').doc(profile._id).update({
      data: {
        ...update,
        updatedAt: Date.now()
      }
    });

    return {
      ok: true,
      data: {
        ...profile,
        ...update,
        updatedAt: Date.now()
      }
    };
  }

  if (action === 'stats') {
    const [questions, answers, invites] = await Promise.all([
      db.collection('questions').where({ _openid: wxContext.OPENID }).count(),
      db.collection('answers').where({ _openid: wxContext.OPENID }).count(),
      db.collection('invites').where({ _openid: wxContext.OPENID }).count()
    ]);

    return {
      ok: true,
      data: {
        ...profile,
        liveStats: {
          questions: questions.total,
          answers: answers.total,
          invitesSent: invites.total
        }
      }
    };
  }

  return {
    ok: true,
    data: profile
  };
};
