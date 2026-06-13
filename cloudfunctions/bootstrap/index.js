const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const seedQuestions = [
  {
    title: '当你意识到自己正在迎合别人时，你通常会怎么把自己拉回来？',
    intro: '这个问题适合讨论边界感、自我认同和关系里的清醒感。',
    authorName: '沉默的罗盘',
    authorSnapshot: {
      profileId: 'seed_author_001',
      nickname: '沉默的罗盘',
      trustScore: 71,
      portraitSummary: '常提出关系边界和自我认同相关的问题'
    },
    visibility: 'public',
    visibilityLabel: '公开问答',
    mood: '关系边界',
    answerCount: 18,
    inviteCount: 6,
    communityTags: ['具体', '自省', '尊重边界'],
    createdAt: Date.now(),
    featuredAnswer: {
      answerId: 'seed_answer_001',
      userName: '青石',
      style: '温和但有判断力',
      communityTags: ['具体', '尊重边界', '能反观自己'],
      text: '我会先停下来问自己：我现在害怕失去什么？如果答案只是害怕对方不高兴，我会把表达调整得更温和，但不会把真实想法吞回去。以前我以为体贴就是不让别人失望，后来才发现，长期让自己失望的人也很难真诚地爱别人。'
    }
  },
  {
    title: '你判断一个人“三观正”的依据是什么？',
    intro: '不是口号，而是具体行为：怎样对待弱者、分歧、亲密关系和利益。',
    authorName: '北窗',
    authorSnapshot: {
      profileId: 'seed_author_002',
      nickname: '北窗',
      trustScore: 83,
      portraitSummary: '长期关注价值判断、事实边界和关系责任'
    },
    visibility: 'public',
    visibilityLabel: '公开问答',
    mood: '价值观',
    answerCount: 42,
    inviteCount: 11,
    communityTags: ['清醒', '不审判', '能讨论分歧'],
    createdAt: Date.now() - 86400000,
    featuredAnswer: {
      answerId: 'seed_answer_002',
      userName: '拾页',
      style: '理性、克制',
      communityTags: ['理性', '克制', '能讨论分歧'],
      text: '我更看重一个人在拥有优势时是否克制，在观点不一致时是否还能尊重事实，在关系亲近时是否仍然保留边界。三观不是说出来的，是在不需要表演的时候自然流露出来的。'
    }
  }
];

exports.main = async () => {
  const collections = ['questions', 'answers', 'invites', 'letters', 'profiles', 'reports', 'blocks', 'evaluations'];

  await Promise.all(collections.map(async (name) => {
    try {
      await db.createCollection(name);
    } catch (error) {
      // Collection already exists in normal repeated bootstrap runs.
    }
  }));

  const existed = await db.collection('questions').limit(1).get();
  if (!existed.data.length) {
    await Promise.all(seedQuestions.map((item) => db.collection('questions').add({ data: item })));
  }

  return {
    ok: true,
    collections,
    seeded: !existed.data.length
  };
};
