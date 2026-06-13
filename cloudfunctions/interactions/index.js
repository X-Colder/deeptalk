const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

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

function assertCanInteract(profile) {
  if (profile.status === 'banned' || profile.status === 'muted') {
    return {
      ok: false,
      error: 'USER_LIMITED',
      message: '当前账号状态暂不能发布或邀请。'
    };
  }

  return null;
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const action = event.action;
  const profile = await getOrCreateProfile(wxContext.OPENID);
  const limited = assertCanInteract(profile);
  if (limited) {
    return limited;
  }

  const base = {
    _openid: wxContext.OPENID,
    profileId: profile._id,
    authorName: profile.nickname,
    createdAt: Date.now()
  };

  if (action === 'createInvite') {
    if ((profile.inviteQuota || 0) <= 0) {
      return {
        ok: false,
        error: 'INVITE_QUOTA_EMPTY',
        message: '今天的深聊邀请次数已用完。'
      };
    }

    const result = await db.collection('invites').add({
      data: {
        ...base,
        questionId: event.questionId,
        targetProfileId: event.targetProfileId,
        reason: event.reason,
        status: 'pending'
      }
    });

    await db.collection('profiles').doc(profile._id).update({
      data: {
        inviteQuota: _.inc(-1),
        'stats.invitesSent': _.inc(1),
        updatedAt: Date.now()
      }
    });

    return {
      ok: true,
      data: {
        id: result._id,
        inviteQuota: Math.max(0, (profile.inviteQuota || 0) - 1)
      }
    };
  }

  if (action === 'createQuestion') {
    const result = await db.collection('questions').add({
      data: {
        ...base,
        title: event.topic,
        intro: event.content.slice(0, 80),
        visibility: event.visibility || 'public',
        visibilityLabel: event.visibility === 'private' ? '私密深聊' : '公开问答',
        authorSnapshot: {
          profileId: profile._id,
          nickname: profile.nickname,
          trustScore: profile.trustScore,
          portraitSummary: profile.portraitSummary || '画像将根据持续提问、回答和他人评价生成。'
        },
        mood: '待分类',
        answerCount: 0,
        inviteCount: 0,
        communityTags: [],
        evaluationSummary: {
          source: 'community',
          note: '标签将由读者评价和内容分析生成。'
        },
        featuredAnswer: {
          answerId: '',
          userName: '等待回答',
          style: '尚未形成评价',
          communityTags: [],
          text: '这个问题还在等待第一个认真回答。'
        }
      }
    });

    await db.collection('profiles').doc(profile._id).update({
      data: {
        'stats.questions': _.inc(1),
        trustScore: _.inc(1),
        updatedAt: Date.now()
      }
    });

    return {
      ok: true,
      data: {
        id: result._id
      }
    };
  }

  if (action === 'createAnswer') {
    const result = await db.collection('answers').add({
      data: {
        ...base,
        topic: event.topic,
        questionId: event.questionId,
        questionAuthorName: event.questionAuthorName,
        content: event.content,
        visibility: event.visibility || 'public',
        communityTags: [],
        status: 'reviewing',
        authorSnapshot: {
          profileId: profile._id,
          nickname: profile.nickname,
          communicationTags: profile.communicationTags,
          trustScore: profile.trustScore,
          portraitSummary: profile.portraitSummary || '画像将根据持续提问、回答和他人评价生成。'
        }
      }
    });

    await db.collection('profiles').doc(profile._id).update({
      data: {
        'stats.answers': _.inc(1),
        trustScore: _.inc(1),
        updatedAt: Date.now()
      }
    });

    return {
      ok: true,
      data: {
        id: result._id
      }
    };
  }

  if (action === 'createEvaluation') {
    const result = await db.collection('evaluations').add({
      data: {
        ...base,
        questionId: event.questionId,
        answerId: event.answerId,
        targetName: event.targetName,
        tags: event.tags || [],
        source: 'reader'
      }
    });

    await db.collection('profiles').doc(profile._id).update({
      data: {
        trustScore: _.inc(1),
        updatedAt: Date.now()
      }
    });

    return {
      ok: true,
      data: {
        id: result._id
      }
    };
  }

  return {
    ok: false,
    error: 'UNKNOWN_ACTION'
  };
};
