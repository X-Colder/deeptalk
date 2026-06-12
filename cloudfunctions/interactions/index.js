const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const action = event.action;
  const base = {
    _openid: wxContext.OPENID,
    createdAt: Date.now()
  };

  if (action === 'createInvite') {
    const result = await db.collection('invites').add({
      data: {
        ...base,
        questionId: event.questionId,
        reason: event.reason,
        status: 'pending'
      }
    });

    return {
      ok: true,
      data: {
        id: result._id
      }
    };
  }

  if (action === 'createQuestion') {
    const result = await db.collection('questions').add({
      data: {
        ...base,
        title: event.topic,
        intro: event.content.slice(0, 80),
        authorName: '匿名表达者',
        mood: '待分类',
        answerCount: 0,
        inviteCount: 0,
        qualityTags: event.tags || [],
        featuredAnswer: {
          userName: '待精选',
          style: '尚未生成',
          text: event.content
        }
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
        content: event.content,
        tags: event.tags || [],
        status: 'reviewing'
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
