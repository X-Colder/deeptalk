const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

function normalizeQuestion(item) {
  return {
    ...item,
    visibility: item.visibility || 'public',
    visibilityLabel: item.visibilityLabel || (item.visibility === 'private' ? '私密深聊' : '公开问答'),
    authorName: item.authorName || (item.authorSnapshot && item.authorSnapshot.nickname) || '匿名提问者',
    authorSnapshot: item.authorSnapshot || {
      profileId: item.profileId,
      nickname: item.authorName || '匿名提问者',
      trustScore: 60,
      portraitSummary: '画像将根据持续提问、回答和他人评价生成。'
    },
    communityTags: item.communityTags || item.qualityTags || [],
    featuredAnswer: item.featuredAnswer || {
      answerId: '',
      userName: '等待回答',
      style: '尚未形成评价',
      communityTags: [],
      text: '这个问题还在等待第一个认真回答。'
    },
    createdAt: formatTime(item.createdAt)
  };
}

function formatTime(value) {
  if (!value || typeof value !== 'number') {
    return '刚刚';
  }

  const diff = Date.now() - value;
  if (diff < 3600000) {
    return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`;
  }
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  }
  return `${Math.floor(diff / 86400000)} 天前`;
}

exports.main = async (event) => {
  const action = event.action || 'list';

  if (action === 'detail') {
    const result = await db.collection('questions').doc(event.id).get();
    return {
      ok: true,
      data: normalizeQuestion(result.data)
    };
  }

  const result = await db.collection('questions')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  return {
    ok: true,
    data: result.data
      .filter((item) => item.visibility !== 'private')
      .map(normalizeQuestion)
  };
};
