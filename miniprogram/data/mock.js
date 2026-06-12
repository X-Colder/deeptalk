const questions = [
  {
    _id: 'q_001',
    title: '当你意识到自己正在迎合别人时，你通常会怎么把自己拉回来？',
    intro: '这个问题适合讨论边界感、自我认同和关系里的清醒感。',
    authorName: '沉默的罗盘',
    mood: '关系边界',
    answerCount: 18,
    inviteCount: 6,
    qualityTags: ['具体', '自省', '尊重边界'],
    createdAt: '今天 09:30',
    featuredAnswer: {
      userName: '青石',
      style: '温和但有判断力',
      text: '我会先停下来问自己：我现在害怕失去什么？如果答案只是害怕对方不高兴，我会把表达调整得更温和，但不会把真实想法吞回去。以前我以为体贴就是不让别人失望，后来才发现，长期让自己失望的人也很难真诚地爱别人。'
    }
  },
  {
    _id: 'q_002',
    title: '你判断一个人“三观正”的依据是什么？',
    intro: '不是口号，而是具体行为：怎样对待弱者、分歧、亲密关系和利益。',
    authorName: '北窗',
    mood: '价值观',
    answerCount: 42,
    inviteCount: 11,
    qualityTags: ['清醒', '不审判', '能讨论分歧'],
    createdAt: '昨天 21:12',
    featuredAnswer: {
      userName: '拾页',
      style: '理性、克制',
      text: '我更看重一个人在拥有优势时是否克制，在观点不一致时是否还能尊重事实，在关系亲近时是否仍然保留边界。三观不是说出来的，是在不需要表演的时候自然流露出来的。'
    }
  },
  {
    _id: 'q_003',
    title: '如果你要给现在的自己写一封信，你最想提醒哪件事？',
    intro: '适合进入慢信件的入口问题，关注成长、选择和长期主义。',
    authorName: '余温',
    mood: '自我成长',
    answerCount: 27,
    inviteCount: 9,
    qualityTags: ['有经历', '有温度', '不煽情'],
    createdAt: '周二 18:45',
    featuredAnswer: {
      userName: '远山',
      style: '平静、细腻',
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

module.exports = {
  questions,
  letters
};
