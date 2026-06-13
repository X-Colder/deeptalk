const questions = [
  {
    _id: 'q_001',
    title: '当你意识到自己正在迎合别人时，你通常会怎么把自己拉回来？',
    intro: '这个问题适合讨论边界感、自我认同和关系里的清醒感。',
    authorName: '沉默的罗盘',
    authorSnapshot: {
      profileId: 'profile_author_001',
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
    createdAt: '今天 09:30',
    featuredAnswer: {
      answerId: 'a_001',
      userName: '青石',
      style: '温和但有判断力',
      communityTags: ['具体', '尊重边界', '能反观自己'],
      text: '我会先停下来问自己：我现在害怕失去什么？如果答案只是害怕对方不高兴，我会把表达调整得更温和，但不会把真实想法吞回去。以前我以为体贴就是不让别人失望，后来才发现，长期让自己失望的人也很难真诚地爱别人。'
    }
  },
  {
    _id: 'q_002',
    title: '你判断一个人“三观正”的依据是什么？',
    intro: '不是口号，而是具体行为：怎样对待弱者、分歧、亲密关系和利益。',
    authorName: '北窗',
    authorSnapshot: {
      profileId: 'profile_author_002',
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
    createdAt: '昨天 21:12',
    featuredAnswer: {
      answerId: 'a_002',
      userName: '拾页',
      style: '理性、克制',
      communityTags: ['理性', '克制', '能讨论分歧'],
      text: '我更看重一个人在拥有优势时是否克制，在观点不一致时是否还能尊重事实，在关系亲近时是否仍然保留边界。三观不是说出来的，是在不需要表演的时候自然流露出来的。'
    }
  },
  {
    _id: 'q_003',
    title: '如果你要给现在的自己写一封信，你最想提醒哪件事？',
    intro: '适合进入慢信件的入口问题，关注成长、选择和长期主义。',
    authorName: '余温',
    authorSnapshot: {
      profileId: 'profile_author_003',
      nickname: '余温',
      trustScore: 68,
      portraitSummary: '提问常围绕成长、焦虑和长期选择'
    },
    visibility: 'public',
    visibilityLabel: '公开问答',
    mood: '自我成长',
    answerCount: 27,
    inviteCount: 9,
    communityTags: ['有经历', '有温度', '不煽情'],
    createdAt: '周二 18:45',
    featuredAnswer: {
      answerId: 'a_003',
      userName: '远山',
      style: '平静、细腻',
      communityTags: ['平静', '有洞察', '不煽情'],
      text: '不要把所有慢都理解成落后。有些事情需要沉淀，尤其是判断自己真正想要什么。你可以焦虑，但不要在焦虑里随便交出方向盘。'
    }
  }
];

const letters = [
  {
    _id: 'l_001',
    partner: '青石',
    topic: '关系里的边界感',
    status: '等待你回信',
    lastText: '你说“温和但不退让”很准确。我想继续聊聊：当对方把你的边界理解成冷漠时，你会怎么处理？',
    updatedAt: '2 小时前'
  },
  {
    _id: 'l_002',
    partner: '拾页',
    topic: '怎样面对观点分歧',
    status: '对方正在写',
    lastText: '我不太相信绝对同频，真正难得的是双方都愿意把分歧讲清楚。',
    updatedAt: '昨天'
  }
];

const profile = {
  _id: 'profile_mock',
  nickname: '安静的表达者 A17C',
  avatarType: 'text',
  bio: '愿意认真表达，也尊重别人的沉默。',
  valuesTags: ['由问答内容总结', '尊重边界', '不消费痛苦'],
  communicationTags: ['由读者评价生成', '慢热', '愿意讨论分歧'],
  portraitSummary: '根据近期问答内容，你更关注关系边界、自我成长和理性表达。',
  evaluationSource: '画像来自公开问答、深聊反馈和读者评价，不由用户手动选择。',
  boundaries: ['不接受查户口式聊天', '不接受暧昧试探', '不交换私人联系方式'],
  trustScore: 66,
  inviteQuota: 3,
  inviteQuotaDate: '2026-06-12',
  status: 'active',
  role: 'member',
  stats: {
    questions: 2,
    answers: 5,
    invitesSent: 1,
    acceptedInvites: 0,
    reports: 0
  },
  liveStats: {
    questions: 2,
    answers: 5,
    invitesSent: 1
  },
  createdAt: '2026-06-12'
};

module.exports = {
  questions,
  letters,
  profile
};
